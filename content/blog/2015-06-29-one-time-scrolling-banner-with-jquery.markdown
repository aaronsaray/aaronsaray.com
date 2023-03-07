---
title: One-time Scrolling Banner with jQuery
date: 2015-06-29
tag:
- jquery
---
I'm not gonna lie - I was really trying to figure out how to put more keywords onto the home page of my company, 201 Creative, besides just the trademark: "Let's make software simple."  So, I messed around with making a rotating banner on the home page that alternated through words that described the concept.  However, I found it annoying and eventually gave up on the idea.  I didn't want to just delete it, though, because it was really light-weight and did something I didn't really see anywhere else.

<!--more-->

So, I don't have a need for it for this particular site - but maybe you do?  Check out the [Scroll and stop demo in jquery](https://codepen.io/aaronsaray/pen/OJomPNr).

### The Code

The mark-up is very simple.  Just a div, and a UL of terms:

```html
<div id="hero">
  Let's make software 
  <ul id="scroller">
    <li>stream-lined.</li>
    <li>effective.</li>
    <li>simple.</li>
  </ul>
</div>
```

Next, let's look at the very small amount of CSS required:
    
```css
#hero {
  font-size: 5rem;
}
#hero ul {
  vertical-align: top;
  margin: 0;
  padding: 0;
  list-style-type: none;
  display: block;
  height: 6rem;
  overflow: hidden;
}
```

First, set the size of the font so we know what size the scrolling box will need to be.  Then, position our UL aligned vertically, with no padding or margin, and cut it off after the first word with the height/overflow styles.

Finally, we need to have some javascript to rotate these.  I used jQuery to save some time - but this could be done without it as well.

```javascript
var $scrollingUL = $('#scroller');

function scroller(element)
{
  var $nextSibling = $(element).next();
  if ($nextSibling.length) {
    setTimeout(function() {
      $scrollingUL.animate({
        scrollTop: $scrollingUL.scrollTop() + $nextSibling.height()
      }, 400, function() {
        scroller($nextSibling);
      })
    }, 5000);
  }
}

scroller($('#hero ul li:first-child'));
```

Let's look over the pieces here first.  (Just a reminder - if you're making a bigger project, you might want to encapsulate this functionality into a module.)  First, get a reference to the scroller UL.  Since the function is ran multiple times, I don't want to search for that item each time.  Next, call the scroller() function with an element: the first element in the scroller ul.  The function gets the next sibling, and if it exists, sets a time-out to animate it to the next position - afterwards it calls itself. (Yay recursion). 
