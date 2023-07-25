---
title: "Obsidian Always Show Markdown Header Level"
date: 2023-07-25T11:41:35-05:00
tag:
- css
- misc-web
---
I love [Obsidian](https://obsidian.md/) for note taking. But one thing bothers me with its live preview mode: I want to see my heading level, without seeing any other markdown directly. If you're not using a theme that does this, you can do it with CSS snippets. Let me show you how:

<!--more-->

First, the problem I'm trying to fix. I like everything else in the editor except for the treatment of headings.  When I type `#` or `##` it can be hard to remember what level those are (I like indenting and outlining content). You generally have to click on them to see what level they are.  I want to see those levels, without working directly in the Markdown view.

To do this, we can add a quick CSS snippet.  To add a [CSS Snippet in Obsidian](https://help.obsidian.md/Extending+Obsidian/CSS+snippets) you need to make a CSS file. I named mine `snippet.css`.

**OH** One thing - remember when you're in there to turn on the CSS snippets. I had went to the settings, opened the folder, created a snippet - but never saw it refreshing in Obsidian. Turns out I didn't turn on the feature.

Next, what should we put in there?  Well, we want to add the hash tags or pound signs before the headers. So, we can do that with CSS.

```css
:not(.cm-formatting).cm-header-1:before {
    content: '# ';
}

:not(.cm-formatting).cm-header-2:before {
    content: '## ';
}

:not(.cm-formatting).cm-header-3:before {
    content: '### ';
}

:not(.cm-formatting).cm-header-4:before {
    content: '#### ';
}

:not(.cm-formatting).cm-header-5:before {
    content: '##### ';
}

:not(.cm-formatting).cm-header-6:before {
    content: '###### ';
}

.cm-header:before {
    color: var(--text-faint);
}

.cm-active.cm-line .cm-header-1:before,
.cm-active.cm-line .cm-header-2:before,
.cm-active.cm-line .cm-header-3:before,
.cm-active.cm-line .cm-header-4:before,
.cm-active.cm-line .cm-header-5:before,
.cm-active.cm-line .cm-header-6:before {
    content: '';
}
```

Now, when you type a heading, you will see the `#` like you normally do when typing. Then, when it's no longer focused, you will still see the `#` - for example `# Chapter 4`.

**One small issue** I can put up with it - but you might want to fix it. When you click on the heading now - it may flash to no hashes or to double hashes for a split second. This likely has to do with some other line being added in temporarily or adjusted that I haven't captured. It's not very common that I click the heading if I know what level it is - so I'll leave it like that for now.
