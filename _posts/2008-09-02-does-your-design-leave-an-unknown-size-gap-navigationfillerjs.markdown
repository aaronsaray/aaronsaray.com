---
layout: post
title: Does your design leave an unknown size gap? navigationFiller.js!
tags:
- javascript
- Misc Web Design
---
If you've ever worked with a customer's CMS pages and heard the term "Oh but I want some images underneath the links" - you need this script.  Whether your using old style tables or the coolest CSS tricks, filling in space to the bottom of the page can be useful.

### Enter navigationFiller.js

[![](/uploads/2008/1-150x99.png)](/uploads/2008/1-150x99.png){: .thumbnail}

With this js file and some configuration in the HTML, you can solve the problem of having that blank space below the navigation bar.  For example, see our before screen...

Minus it being very very ugly and boring, you'll see the huge blank space below the list on the left - or the 'navigation' links - if they were a tags.  Now, lets imagine that the content on the right side may be variable lengths - this is where navigationFiller.js falls in.

navigationFiller.js will calculate the available space and fill with images from your pre-configured list.

[![](/uploads/2008/2-150x99.png)](/uploads/2008/2-150x99.png){: .thumbnail}

See the after picture - of our equally as AWESOME demo pics?

This is from a simple script include and then some configuration options.  The script has public methods for populating the images that you want to use.

Its easy - lets see how:

### How to Use

First thing's first, include the js file in the head of your document.

```html
<head>
<script src="navigationFiller.js" type="text/javascript"></script>
</head>
```

Next, configure your options.  First, you must make a new instance of the object.  Then, you can add images 1 by 1.  The order you add them is the order they may appear.  Check out this javascript:

```javascript
var oFiller = new navigationFiller();
oFiller.add('1.gif');
oFiller.add('2.gif');
oFiller.add('3.gif');

/** add using your normal onload() handler **/
window.onload = function() {oFiller.create('fillerDiv');}
```

As you can see, you finally run the oFiller.create() function with the ID of the div that you wish to populate with these images.

### So What Happens?

If you have a `div` with an ID passed to the `oFiller.create()` in the above example, the script will calculate the height of the current document, and the location of the `div`, and then load images in until there is no more room left.  It will not extend past the height of the existing document.

### Bugs or Limitations?

I have a huge todo list - so this is more of a proof of concept.  It should be noted that it only works with FireFox at this point.  Also, the code is sloppy and possibly buggy.  You can see the top of the js file for my expanded todo list.

### Download!

You can download it here: [Navigation Filler Zip (with Examples)](/uploads/2008/navigationfiller.zip)
