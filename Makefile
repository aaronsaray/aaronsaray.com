MAKEFLAGS += --no-print-directory
.PHONY: help install ci dev build preview post check lint lint-js lint-format lint-md lint-fix format test test-e2e test-a11y clean verify

# A "## " comment on a target line is its help text; a "##@ " line is
# a heading.
help: ## List targets
	@awk 'BEGIN {FS = ":.*## "} /^##@ / {printf "\n%s\n", substr($$0, 5)} /^[a-zA-Z0-9_-]+:.*## / {printf "  %-12s %s\n", $$1, $$2}' $(MAKEFILE_LIST)

##@ Setup

install: ## npm ci, then the Chromium download
	npm ci
	npx playwright install chromium

# --only-shell fetches the headless shell alone. A test that sets
# `channel` or runs headed needs the full Chromium build.
ci: ## Fresh install, then verify (the GitHub workflow runs only this)
	npm ci
	npx playwright install --with-deps --only-shell chromium
	$(MAKE) verify

##@ Build and run

dev: ## Dev server at http://localhost:4321
	npm run dev

build: ## Static build to dist/ (warm cache)
	npm run build

preview: build ## Build, then serve dist/
	npm run preview

##@ Write

# The title reaches the script through the environment, never pasted
# into the shell command, so quotes and $ in it arrive as typed. make
# expands a command-line variable before exporting it, which would eat
# a $; $(value) takes it unexpanded, and override lets a makefile
# assignment beat the command line.
override TITLE := $(value TITLE)
export TITLE

post: ## New draft post dated today (TITLE="My Post Title")
	@node scripts/new-post.ts "$$TITLE"

##@ Lint

check: ## astro check (TypeScript)
	npm run check

lint: lint-js lint-format lint-md ## All three linters: ESLint, Prettier check, markdownlint

lint-js: ## ESLint only
	npm run lint:js

lint-format: ## Prettier check only (no writes)
	npm run lint:format

lint-md: ## markdownlint only
	npm run lint:md

lint-fix: ## Fix what lint reports: ESLint --fix, Prettier write, markdownlint --fix
	npm run lint:js -- --fix
	npm run format
	npm run lint:md -- --fix

format: ## Prettier write only
	npm run format

##@ Test

test: ## All browser tests: e2e and a11y (ARGS="--grep copy")
	npm run test -- $(ARGS)

test-e2e: ## Only the e2e subset of test (behavior)
	npm run test:e2e -- $(ARGS)

test-a11y: ## Only the a11y subset of test (axe sweep)
	npm run test:a11y -- $(ARGS)

##@ Gate

# Astro keeps two content caches: astro build reads
# node_modules/.astro/data-store.json, astro dev (which the tests start)
# reads .astro/data-store.json. The rest of .astro/ stays: tsconfig.json
# includes .astro/types.d.ts.
# -exec rather than -delete: -delete implies depth-first on BSD and GNU
# find, which disables -prune, and the sweep would walk node_modules.
clean: ## Remove dist/, both Astro content caches, Playwright output, .DS_Store files
	rm -rf dist test-results
	rm -f node_modules/.astro/data-store.json .astro/data-store.json
	find . -name node_modules -prune -o -name .DS_Store -type f -exec rm -f {} +

# ARGS= keeps a command-line ARGS from reaching the test step through
# MAKEFLAGS.
verify: ## The gate: clean, check, build, lint, test
	$(MAKE) clean
	$(MAKE) check
	$(MAKE) build
	$(MAKE) lint
	$(MAKE) test ARGS=
