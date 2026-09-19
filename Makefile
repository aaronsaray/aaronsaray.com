# Recipes call the leaf scripts in package.json through npm run; the
# groupings live here. A "## " comment on a target line is its help
# text; a "##@ " line is a heading in help.

.DEFAULT_GOAL := help
.NOTPARALLEL:
MAKEFLAGS += --no-print-directory
.PHONY: help install ci dev build preview post check lint lint-js lint-format lint-md lint-fix format test test-e2e test-a11y clean verify

help: ## List targets
	@awk 'BEGIN {FS = ":.*## "} /^##@ / {printf "\n%s\n", substr($$0, 5)} /^[a-zA-Z0-9_-]+:.*## / {printf "  %-12s %s\n", $$1, $$2}' $(MAKEFILE_LIST)

##@ Setup

# .npmrc sets ignore-scripts, so the browser download that normally
# rides along with npm ci never runs.
install: ## npm ci, then the Chromium download
	npm ci
	npx playwright install chromium

# --only-shell skips the headed Chromium build that install otherwise
# fetches alongside the headless shell. Safe while no test sets
# `channel` or runs headed; the shell renders screenshots differently,
# so visual comparison against a headed local run would not match.
ci: ## Fresh install, then verify (the GitHub workflow runs only this)
	npm ci
	npx playwright install --with-deps --only-shell chromium
	$(MAKE) verify

##@ Build and run

dev: ## Dev server on port 4321
	npm run dev

build: ## Static build to dist/ (warm cache)
	npm run build

# astro preview resolves each request against dist/ at request time,
# so with no build it answers 404 instead of failing.
preview: build ## Build, then serve dist/
	npm run preview

##@ Write

# "$$TITLE" reads the title from the environment, where its quotes and
# apostrophes are data. node runs directly so stdout is the path alone.
post: ## New draft post dated today (TITLE="My Post Title")
	@node scripts/new-post.mjs "$$TITLE"

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

# $(ARGS) stays unquoted so ARGS="--grep copy" reaches playwright as
# two arguments.
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
clean: ## Remove dist/, both Astro content caches, Playwright output, the draft fixture, .DS_Store files
	rm -rf dist playwright-report test-results
	rm -f node_modules/.astro/data-store.json .astro/data-store.json
	rm -f src/content/blog/draft-fixture-for-tests.md
	find . -name node_modules -prune -o -name .DS_Store -type f -exec rm -f {} +

# A stale data-store.json feeds old post HTML to both the build and the
# dev server the tests start; clean first is what catches it. ARGS= keeps
# a command-line ARGS from reaching the test step through MAKEFLAGS.
verify: ## The gate: clean, check, build, lint, test
	$(MAKE) clean
	$(MAKE) check
	$(MAKE) build
	$(MAKE) lint
	$(MAKE) test ARGS=
