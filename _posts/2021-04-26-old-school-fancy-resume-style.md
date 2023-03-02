---
layout: post
title: Old School Fancy Resume
tags:
- html
- css
---
Remember when the biggest way to show off your quality as an applicant was to have a fancy resume? You'd have a heavy paper weight, fancy fonts and in some cases embossing.  I decided it might be fun to duplicate that as an HTML/CSS resume.

I have a history of creating my resumes using HTML and CSS instead of desktop publishing projects.  You can find examples of my past [resumes in Github](https://github.com/aaronsaray/resume) if you're curious.

This time, I wanted to create a background that was textured and a gold flake ribbon type of effect.

For the background, I decided to use a cream color. Then, I generated some noise and converted that to a data url.  Here's what that ended up like:

```css
background-color: #fffce9;
background-image: url(data:image/png;base64,iVBORw0KGgd/9+u<SNIP>CYII=);
```

That ends up giving us a nice paper-like background.

Then, I had to make a ribbon that had a gradient.  Doing a border gradient maybe is possible with some imagery, but I decided to do it differently. Instead, I created a whole background with a CSS gradient, then nested an element inside of it with the same background design, slightly inset. This made a nice ribbon.

To create the gradient, I used a couple gold-ish colors with a couple stops:

```css
background: linear-gradient(153deg, #ae9e69 0%, #ffd64e 20%, #ae9e69 25%, #ffd64e 30%, #ae9e69 32%, #ae9e69 100%);
```

With the angle of 153 degrees and a few rapid stops/changes in the gradient, there will be a nice reflective style in the ribbon.

In the end, here's how it ended up looking:

[![Old School Resume](/uploads/2021/resume-guy-smiley.thumb.png)](/uploads/2021/resume-guy-smiley.png){: .thumbnail}

You can download the [PDF here](/uploads/2021/resume-guy-smiley.pdf) or see the [demo on codepen](https://codepen.io/aaronsaray/pen/jOydvKx) to see how it was done.