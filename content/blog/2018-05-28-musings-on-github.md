---
title: Musings on GitHub
date: 2018-05-28
tags:
- git
- misc-web
---
[Github](https://github.com) is one of the most useful tools I have in my arsenal.  With over 100 repositories (some of which are private), it's the best $7/mo I spend.  However, there are a couple things about GitHub you might not know.

<!--more-->

### You Can Archive Repositories

In the past, I used to use a descriptive "tag" called `[ABAONDONED]` in some of my repositories that I no longer work on.  (I have historical repositories, not just current ones.  In the same manner as I keep old blog entries, I think it's good to keep old repositories as well).  

Turns out now you can **archive** your repository.  When you do this, you no longer will be able to push to the repository and all wiki/issues will be frozen.  If you're under a plan that charges per-repository, these are no longer charged as active repositories.  You can always reactivate these repositories if you'd like.

To archive your repository, visit the GitHub page of your repository.  Then, click the settings tab.  Towards the bottom, you'll see a button to archive the repository - the you're set.

The last cool thing I have to mention about this is the fact that it puts a `Archive` tag next to your repository title in the listing.  When you click through to it, it highlights at the top of the page that you've archived this repository.  No more needing to indicate that this code is no longer active and being updated.

### Star It, Don't Fork It

Forking a repository has a clearly defined usage and benefits. It allows you to make changes to your copy of it.  You can keep separate versions of the library active with your development. As part of open source, you can submit pull requests back to the source repository to add features/functionality that you're trying to contribute.

**If you're not planning on developing on the code, don't fork it.**

**Star the repository to indicate your appreciation as well as to use as a bookmark.**  I'm not certain, but I think a lot of people are forking repositories so that they show up in their own repository list.  I _think_ this is because they want to not forget about this repository.  The star system is very helpful for this.  It has a side-effect of indicating to a repository owner that you believe their work is worthwhile.  Also, repository validity, popularity and quality is measured on how many stars the repository has, not how many people have forked it (with some intention to develop on it).

It really drives crazy too when I have job applicants that give me a link to their GitHub page that has only a list of repositories they have forked.  When I glance through them and see no development was done on any of them, it's really frustrating. Not only is your GitHub page worthless to me, you've actually wasted some of my time, too.

### GitHub Pages

Project documentation and advertisement is often done with static websites.  With GitHub pages, you can now host those static websites on the GitHub platform using git, [Jekyll](https://jekyllrb.com), and the `github.io` domain.  In fact, you can also use custom domains and even SSL now!  

If you'd like to configure your static website to stay with your project, you can use the `gh-pages` branch to keep the source code and documentation in the same repository.  In cases like this blog, I've made the `master` branch the source of the GitHub pages deployment.  (Yes, this blog is hosted currently on GitHub Pages.  More about this in a different blog entry - hopefully I remember to come back and update a cross-link here!)

Think GitHub Pages is for you?  Then check out the [GitHub Pages Documentation](https://pages.github.com)

### At Least Have a Good Readme

When you visit a repository page on GitHub, it tries to load up a `Readme.md` file in the root of your project.  This is shown to the visitor automatically below the code source tree.  Please please please put a good description, summary and set of instructions on how to get started in this file.  

There's nothing more frustrating than coming across a new repository just to find there is no documentation.  What is the point of this code? How do I get started?  (Even if you're using GitHub pages, you should link in the Readme file to your GitHub pages main URL then.)  If you're using the Wiki for documentation, at least indicate this.  I still think it's a good idea to put a summary of the repository's purpose here, too.

And remember, just because GitHub might give you alternatives to documentation (pages, wiki), other third-party services you integrate with might not support that.  For example, if you publish your PHP package on Packagist, it will understand and display the readme file.  It won't have the context of your wiki or automatically feature GitHub pages link.

### There Is So Much More

Looking for a way to give contributors instructions on how to participate? Check out the [contributors documentation](https://help.github.com/articles/setting-guidelines-for-repository-contributors/) feature.

Same thing with Pull Requests - indicate proper [pull request functionality with templates](https://help.github.com/articles/using-templates-to-encourage-high-quality-issues-and-pull-requests-in-your-repository/)

Like a person's work?  [Follow them](https://help.github.com/articles/following-people/)

Creating a new project? Maybe think about creating an [organization](https://help.github.com/articles/managing-your-membership-in-organizations/)

Actually, I'd say just [RTFM](https://help.github.com/) - there's a lot in the manual, but you don't need to read it all.  They've broken it up into topics and a nice tree.  Click through and figure out how to make GitHub useful to you and stick with the known conventions.
