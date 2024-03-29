---
title: How to Take Full Page Screenshots in Chrome
date: 2020-04-29
tag:
- misc-web
---
It can be hard to take a full-height screenshot of a website.  Luckily, Chrome gives us a tool to do this - no more stitching images together. Let's see how...

<!--more-->

## Why?

Some websites are designed to make use of the full screen when they're loaded.  For example, my site [More Better Faster](https://morebetterfaster.io) is designed to fill your full screen with a splash image. It then encourages you to scroll down.

Other sites are just long for non-aesthetic reasons.  When you want to capture all of the content, it can be a real bore to try to stitch these all together. Or worse yet, you have to send three, four, five extra images along.

## Show Me The Problem

I'll use my site as an example to show you how frustrating taking a full height screenshot could be.

When you load up the site, you'll see this screen below.

{{< image src="/uploads/2020/fullsize-chrome-1.png" thumb="/uploads/2020/fullsize-chrome-1.thumb.png" alt="Screenshot - full" >}}

No matter what you resize your browser to, you have to scroll to see additional content.  You end up doing something like this: yuck

{{< image src="/uploads/2020/fullsize-chrome-2.png" thumb="/uploads/2020/fullsize-chrome-2.thumb.png" alt="Screenshot - scrolled" >}}

## Solve It For Me!

Cool. Let's do it.

First, you'll want to bring up your developer tools. To do this:

* Right-click anywhere on the website.
* Left-click Inspect

(If you're unable to do this, you may have to click the three dots or some menu, depending on your version of OS, go to More Tools and then click Developer Tools).

Next, you'll see something like this.

{{< image src="/uploads/2020/fullsize-chrome-3.png" thumb="/uploads/2020/fullsize-chrome-3.thumb.png" alt="Screenshot - finding the emulator" >}}

Click the icon that has a phone and tablet in it: it looks like two rectangles.

You should see a border towards the top of your window now.  It should say "Responsive" in the left top area. If it does not, click that and choose Responsive from the list.

{{< image src="/uploads/2020/fullsize-chrome-4.png" thumb="/uploads/2020/fullsize-chrome-4.thumb.png" alt="Screenshot - responsive link" >}}

Next, find the three dots that is in this same bar on the right and click it.

{{< image src="/uploads/2020/fullsize-chrome-5.png" thumb="/uploads/2020/fullsize-chrome-5.thumb.png" alt="Screenshot - choose full screen" >}}

Choose Capture full size screenshot

There you go. Now you'll see something like this:

{{< image src="/uploads/2020/fullsize-chrome-6.png" thumb="/uploads/2020/fullsize-chrome-6.thumb.png" alt="Screenshot - full length" >}}

*One small caveat:* It's possible that this method won't work if a programmer didn't account for limiting the height, but this is probably rare.
For the nerds: if you used 100vh, the chrome view port will still be 100vh when it launches to take the screenshot, so the element will likely stretch that entire height as well.