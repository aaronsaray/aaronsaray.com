---
name: testing
description: How the Playwright tests are chosen, written, and run. Read before running, adding, or changing a test.
---

# Testing

A test is one page load, one piece of the site, one way of working
it, walked start to finish: focus the nav button, open the panel, move
inside, leave, close, reopen. The steps of that job are never separate
tests; `maxFailures: 1` stops the run at the first failed expect
either way, so splitting them buys a page load and nothing else. The
route sweep is the same unit on a page: one test per route runs every
check that load must pass.

What makes a second test:

* **A different input.** Keyboard, mouse, and touch each get their
  own, because each skips on a different fixture and a person notices
  "hover is broken" apart from "Tab is broken."
* **A different piece of the site.** The skip link, a nav panel, the
  copy button: never two controls in one test, even on one page.
* **A different page load.** A job that follows a link ends there; the
  new page is not the start of a second job in the same test.

The title says what a person would notice was broken, at a desktop
and a phone. A test that cannot name that does not get written, and a
title that needs "and also" across two controls is doing two tests'
work.

## Tested

* **Served bytes.** Feeds parse as XML, the contact page never carries
  the literal address, head metadata.
* **Links.** Click and assert the URL, never just the `href`.
* **Operation.** Keyboard, tap, clipboard: skip link, nav panels, copy
  button, Enter on the 404 page.
* **Accessibility.** axe at WCAG 2.2 AA over every route, plus what
  axe cannot see: accessible names, focus stops, the copyright-line
  underline (axe passes same-color links by default).
* **Fit.** No sideways scroll at either viewport or at 320px.
* **Pipeline output.** The DOM the markdown plugins emit, with a real
  post as the fixture.
* **Conventions the pipeline relies on.** CV role headings lead with a
  date; `ROUTES` matches `dist/`.

## Never tested

* **Geometry.** No `getBoundingClientRect`, baselines, gaps,
  alignment. That pins one day's math and fails on the next redesign
  without saying anything true.
* **Design choices.** Colors, spacing, DOM order, `alt=""`. The built
  site is the reference and Aaron's eyes are the check.
* **Screenshots.** A Mac baseline fails on the Ubuntu runner: the same
  font files wrap at different words under FreeType.
* **Aria snapshots.** Every content edit fails them.

A computed style is asserted only when the style is the requirement
and the owning tool is blind to it. Prove that by breaking the thing
and running the tool; the comment names the blind spot.

## The tool that owns the concern

axe judges WCAG. A click judges a link. `request` judges bytes.
`DOMParser` judges XML. `getByRole` and `toHaveAccessibleName` judge
names. Nothing one of these owns gets a hand-rolled check.

## Where a test lives

* `tests/layout.spec.ts`: the shell every page shares.
* `tests/pages/all.spec.ts`: the sweep every route gets, and the head
  metadata. A new per-route check goes inside the sweep's one test. A new page gets a `ROUTES` line; the `dist/` check fails
  until it has one.
* `tests/pages/<page>.spec.ts`: what one template does that the sweep
  cannot see. `post.spec.ts` is the markdown pipeline, one `describe`
  per feature.
* `tests/<name>.spec.ts`: what is not a page. Feeds, internal links,
  the Konami code.
* `tests/support/`: helpers shared by more than one spec.

## Writing one

* Fixtures are permanent posts, the comment saying why that post. A
  permanent post's values are known: assert the string or count the
  built page carries, never that two fields agree or that a count is
  above zero. A live page (CV, books, about, blog index) gets a shape
  check instead. Nothing goes in `src/content/` for a test.
* Both projects run every test. `test.skip(isMobile, "why")` or
  `hasTouch` only when one form factor cannot show the behavior.
* `expect(locator)` retries; `page.evaluate` only when no locator can
  ask. A test stops at its first failed expect and the run stops at
  its first failed test: never `expect.soft`, never a collected list
  of faults.
* Comments answer which fixture and why, or what the owning tool
  cannot see.
* Helpers sit above the tests that call them, as `function`
  declarations, not arrows.

## Running

* **Stale content cache.** After a change to `src/plugins/` or
  `markdown` in `astro.config.ts`, a warm `make build` or `make test`
  serves stale post HTML. `make verify` cleans first; while iterating,
  `make clean` before believing an impossible result. The comment on
  `clean` in the Makefile has the mechanism.
* **Port 4321 in use: stop and tell Aaron.** It is almost always his
  `make dev`. Never investigate or kill it, or work around it with
  `reuseExistingServer`. Say verify cannot finish because a dev server
  holds the port, and re-run once he says it is stopped.
