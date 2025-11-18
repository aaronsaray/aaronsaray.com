---
title: "Github Workflow for Production Merge"
date: 2025-011-18
tag:
- git
- github
---
Github actions are awesome. In fact, we often write about them or share details on [MasteringLaravel.io](https://masteringlaravel.io) in the tips section or the community.

Let's take a look at one particular workflow that appears pretty simple - after you understand it all.

How do we merge from develop into main for a production deploy or merge? By using this Github action.

<!--more-->

I'll share here, and then I'll dissect it.

```yaml
name: Production Merge

on: workflow_dispatch

permissions:
  contents: write
  actions: write

jobs:
  Merge:
    runs-on: ubuntu-latest

    env:
      MAIN_BRANCH: main
      DEVELOP_BRANCH: develop

    steps:
      - name: Checkout Develop ( ${{env.DEVELOP_BRANCH}} )
        uses: actions/checkout@v4
        with:
          ref: ${{env.DEVELOP_BRANCH}}
          fetch-depth: 0 # checkout the entire history
          persist-credentials: true
          token: ${{ secrets.PAT }}

      - name: Set Git credentials
        run: |
          git config user.name "${{ github.actor }}"
          git config user.email "${{ github.actor_id }}+${{ github.actor }}@users.noreply.github.com"

      - name: Execute production merge
        run: |
          git checkout $MAIN_BRANCH
          git merge $DEVELOP_BRANCH
          git push origin $MAIN_BRANCH
```

There's a lot to look at here, even though it's very simple. Let's dive in.

First, we name it. This will show up in the Github actions. Production Merge will have a workflow job called 'Merge'.

Next, it's only dispatched with `workflow_dispatch` - this basically means that we only use it through the UI. There will be an option next to the workflow to run all jobs.

Moving on - permissions: We want to be explicit with the permissions this action requires. We need the ability to write to our Github repo for this action.

In the job, we define some environment variables. This just makes it easier to drop this in when clients or projects have different named branches.

Using the Github `actions/checkout` workflow, we then retrieve the develop branch (this may also be the default, it may not be).  The `secrets.PAT` is the Personal Access Token for a Github user. This is used just to check it out. Sadly, we can't get this from the current actor. This must be configured in your secrets. As long as the user exists who this PAT belongs to, it will be fine. (If you have a better alternative to this, I'm all ears!)

Next, set the credentials of the git user to the current user. This is the user who is activating this Github action. We configure their name and their email (to the built-in email for Github that they provide all users).

Finally, checkout the main branch, merge, and push to the origin. Consider this merged!
