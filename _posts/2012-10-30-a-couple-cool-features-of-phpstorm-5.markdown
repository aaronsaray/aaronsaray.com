---
layout: post
title: A couple cool features of PHPStorm 5
tags:
- ide-and-web-dev-tools
- phpstorm
---
As I've mentioned before, I've recently moved to [PHPStorm](http://www.jetbrains.com/phpstorm/).  I've done a little bit of configuration and I plan to start using it more now.  Here are a few things I really like:

**Integration of Command Line Tools**

It understands various command line tools in your framework.  I can choose to add my ZFtool from 1.x Zend Framework fame - and then it understands and autocompletes in their own console.

**Color options**

I like how you can very intricately choose different color options for all files individually.  

**External Tools**

Integrates external tools with the workspace - a lot like how Eclipse PDT does it too.

**Templates for new files**

You can configure templates for new files - what I really like is that it supports logical conditions in the code templates.  So, statements like "if" are allowed to determine how your template is executed.

**Automatic saving**

This was on by default.  I didn't realize this and kept hitting ctrl-s.  I like automatic saving - but it matters that I'm using VCS.

**Git hub integration**

Nice.

**Image viewer**

Like that the image viewer is semi-robust - and then offers the choice to set a default editor.

**intentions**

All I can say is wow!  There is a nice collection of user and plugin defined intentions.  These rules are used as suggestions when the code is inspected.  You can choose to apply the intention or not.  For example, if it detects an operational branch, you can swap the if() statements with a more logical method.

**live editing in chrome**

Changes to your code show up immediately in chrome without need to refresh the page.

**live templates**

You can create template text that can be autocompleted into a larger text (like macros) with the press of the tab key.

**menus and toolbars**

It appears you can even make changes to the menu system - I haven't tried this yet as I don't really use the menu that much.

**Plugins**

A lot of stock functionality comes in the form of plugins.  The plugin repository has a lot more to choose from too.

Now, with all of that, there are some things I don't like.  The largest complaint I have is not being able to have multiple projects open in the same editor window.  I work in a lot of projects throughout the day - and switching back and forth - or having two windows open - is annoying.  But besides that, it's pretty decent.
