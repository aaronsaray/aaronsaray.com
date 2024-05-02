---
title: "Production Merge in GitHub Actions"
date: 2024-05-02T12:23:50-05:00
tag:
- git
- github
---
You're using Pull Requests in GitHub and everything is working great! Nice workflow! But now you have a problem: deploying from `develop` to `main` via a ... what? A PR? A merge commit if you bring the two branches down to your local machine? What else?  What about a GitHub action that you can use to do this? Here's a simple proof of concept with explanation - you may still need to alter this for your workflow.

<!--more-->

{{< filename-header ".github/workflows/production-merge.yml" >}}
```yaml
name: Production Merge

on: workflow_dispatch

permissions:
  contents: write

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

Let's break it down and talk about each section.  Once you know how each works, then you can modify it to suit your specific needs (like merging `main` into `develop` first - or anything else.

First, set a name - simple. That's going to be the thing that people click on in the Action section of GitHub, though, so make sure it makes sense.

Next, we only allow this to happen on `workflow_dispatch` - this means that you can click into the actions, select a drop down and run the action.  In my workflow, I want PRs to `develop` to be merged in after a PR automatically. What I don't want is production merges willy nilly.  So this is only done by hand.

The permissions gives us the ability to write to the contents of the repository. This is necessary in our last step when we want to push back our changes. Normally workflows don't have this permission - and that's a good thing.

The job is called `Merge` and shows up as a step inside of the GitHub actions workflow viewer.

Next, let's set the runs-on to something very basic -and then set two environment variables.  These are set so you can easily copy and paste this - and use different branch names if you like. Just in general, it's nice to not have 'magic constants' and put those things into variables anyway.

For the steps, they're pretty simple.  The first is using the official GitHub actions checkout.  The things to note here is the use of the environment variables in the `ref` parameter (no matter what you're running this against, we're starting out with your `develop` branch).  Also, the `fetch-depth` is set to `0` in order to effectively disable the detached head checkouts that this normally does. This means you'll have the full checkout - including refs to other branches.

Next, I just separated the two steps - but I'll describe them together.

We set the git user and email using variables from the GitHub action context.  The email address is one that is configured for users of GitHub and built in. This will link the action to your account without making it look like you did it locally/personally.

Next, we checkout the main branch using the environment variable.  This is basically a 'switch' to another branch in all intents and purposes because of the deep fetch we did earlier.  Then, merge (I'm letting it choose it's way automatically - but you could put other options here - like `no-ff` or whatever git parameters you want) it in.  Finally, push the merge up.
