---
title: "Use Github Actions Permissions with 3rd Party Actions"
date: 2023-12-06T08:58:51-06:00
tag:
- github
- security
---
I can't say how much I love [Github actions](https://github.com/features/actions). It really felt like a game-changer for me. But I always had some concerns about security. How do we stop 3rd party actions from accessing stealing our code?

<!--more-->

There are many reasons why you might use 3rd party Github actions.  For example, a lot of people will set up multiple PHP versions using [setup-php](https://github.com/shivammathur/setup-php) or handle stale issue management with [@actions/stale](https://github.com/actions/stale).

But while I might trust Github and their `@actions/stale` command (and I'm going to pick on them because I do trust them and don't want to accuse a regular programmer of nefarious things), you shouldn't completely. Why?

Well, let's just say that you went to audit the source code of an action. You do that right?  Well let's say you look at the [main.ts](https://github.com/actions/stale/blob/main/src/main.ts) file in the project - and you see it - it's not just modifying issues for you, but it's copying your whole github repository or stealing your credentials.

No good.  This doesn't necessarily mean that the provider is nefarious. It could be a supply chain hack, too. But either way, that doesn't matter to you. What matters to you is the security of your project and source code.

So what can we do about this?  Well you should definitely check every source for problems like this - and you should from time to time. But, come on, we trust the wisdom of crowds. Who has time to check into everything like that?!

The best way to handle this is to reduce the scope of any permissions of the action using the `permissions` key. You can find the [details and documentation here](https://docs.github.com/en/actions/using-jobs/assigning-permissions-to-jobs).  But let's use their example real quick.

```yaml
jobs:
  stale:
    runs-on: ubuntu-latest

    permissions:
      issues: write
      pull-requests: write

    steps:
      - uses: actions/stale@v5
```

As you can see here, we're limiting the permissions of this specific job (and all of its steps).  Now it only has permission to the things it needs.  Feels a little bit more secure.