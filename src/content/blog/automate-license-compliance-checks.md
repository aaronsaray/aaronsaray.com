---
title: "Automate license compliance checks"
date: "2026-01-08"
tags:
  - composer
  - scripting
origin:
  name: Mastering Laravel
  url: "https://masteringlaravel.io/daily/2026-01-08-automate-license-compliance-checks"
  canonical: true
---

In the previous tip, I showed you how to list your dependencies' licenses.
Now let's make it more useful.

<!--more-->

First, get a quick summary:

```bash
composer licenses --format=summary
```

This groups packages by license type.
Nice to eyeball, but not easy to automate.

If you want to check against specific licenses, you can use JSON output with `jq`.
For example, say your project only allows `MIT` and `Apache-2.0` licenses.
This command shows any packages outside that list:

```bash
composer licenses -f json | \
  jq '.dependencies | to_entries[]' | \
  jq 'select(any(.value.license[]; IN("MIT", "Apache-2.0")) | not)' | \
  jq -r '.key'
```

Empty output means you're compliant.
Any package names that appear need review.

For CI, drop this in a GitHub Action and fail the build if there's output.
