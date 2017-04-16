---
layout: post
title: Javascript Snow Fall with buildup
tags:
- javascript
---
Mr. Skowron ([his business](http://markskowrondesign.com)) was working on a flash animation for a client that had a snow fall.  What really irked me about the end result, was two things.

a) it was in flash

b) the snow didn't build up

The client was happy.  So that's all good.  But, I like a challenge... So I decided to make my own version.

### The Snowfall Script

I didn't want to reinvent the wheel - so I grabbed a pre-made script (by [Scott Schiller](http://schillmania.co)).  It simply adds the snowfall to the body.

### Creating a snow line

The next thing I wanted to do was make a snow line that would slowly creep up.  My first thought was just to have a standard white swoosh move up.  This wouldn't work because I wanted to have it scale the entire size of the monitor. Plus it wouldn't look that natural.

I decided to make three images with various swoosh type marks about 500px wide.  Then, I used photoshop to offset them by half.  (Filter -> Other ->offset -> set horizontal to 1/2 the width of the image).  This made the image tile-able. (It may be necessary to smooth out the new overlap you just created).  All three were created, 500px wide and 50px tall.

### Creating the HTML

The HTML would be pretty simple.  I had to have three snow lines - oh and I wanted a tree.  Let's take a look:

```html
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <title>Snow!</title>
  </head>
  <body>
    <div id="tree"></div>
    <div id="snow1" class="snowblock"><div></div></div>
    <div id="snow2" class="snowblock"><div></div></div>
    <div id="snow3" class="snowblock"><div></div></div>
  </body>
</html>
```

We'll be referring to these elements a little bit later.

### Use CSS to Position Everything

The next thing to do was to give my `div`'s some dimension and some background images.  I thought I'd start out each snow line `50px` from the bottom and tile the image.  Since they have transparent edges, you should be able to see varying lines of 'horizon' on the snow.  I also placed the tree image near the right edge to give it that look I was looking for.

```css
body {
  height: 100%;
  padding: 0px;
  margin: 0px;
  background: #000;
}
#tree {
  background: url('treeback.jpg') no-repeat;
  position: absolute;
  bottom: 10px;
  right: 20px;
  height: 396px;
  width: 530px;
}
.snowblock {
  position: absolute;
  bottom: 0px;
  width: 100%;
  background-repeat: repeat-x;
  height: 40px;
}
.snowblock div {
  background-color: #fff;
  margin-top: 40px;
  height: 0px;
}
#snow1 {
  background-image: url('snow1.png');
}
#snow2 {
  background-image: url('snow2.png');
}
#snow3 {
  background-image: url('snow3.png');
}
```

First, give the body some background color, get rid of paddings and set a height of `100%`.  The next section is the tree placement.  This is pretty simple.

For each class of snowblock, they are absolutely positioned at the bottom with `100%` width.  I gave them each `40px` height.  Each image is `50px` tall, but I wanted an acceptable gutter just in case.

As each image moves up, they will start to reveal the background color again.  To solve this, the interior divs are given a background color of white.  Their top margin is `40px` - to offset them enough from the image (so as to not bleed their own background color upwards into the transparent snowline).  They start out with no height.

Finally, each image div is given a background image of snow.

### The magical javascript

First off, I put the following javascript include tags in the HTML

```html
<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.3.2/jquery.min.js" type="text/javascript"></script>
<script src="snowstorm.js" type="text/javascript"></script>
```
    
After loading jquery and the pre-made script, the following javascript is executed:

```javascript
function upSnow()
{
  var id = 'snow' + (Math.floor(Math.random()*3) + 1);
  var snow = $("#"+id);
  var filler = $("#" + id + " div");
  snow.height(snow.height() + 1);
  filler.height(filler.height() + 1);
}

$(function(){
  snowStorm.flakesMax = 250;
  snowStorm.flakesMaxActive = 100;
  snowStorm.animationInterval = 33;
  snowStorm.snowStick = false;
  setTimeout(function(){setInterval('upSnow()', 2000)}, 5000);
});
```

First, the `upSnow()` function is generated.  This will randomly pick an ID between `snow1` and `snow3` and inch it up `1px`.  The child `div`'s height is also increased by 1 pixel.

When the javascript fires, a few options are set for the **`snowStorm.js`** library.

Finally, a timeout and an interval are set.  The first timeout is used to set the interval.  I don't want the interval to start until the first flakes start hitting the ground.  this takes approximately 5 seconds, so that delay is set.

After 5 seconds, the anonymous function fires off the setInterval request to run the `upSnow()` function every two seconds.

### See it in Action

Seems to me, people like to SEE this stuff in action.  Weird.  Anyway, here ya go:
[/demo/snow/](/demo/snow/)
