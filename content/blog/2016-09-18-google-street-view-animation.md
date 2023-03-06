---
title: Google Street View Animation
date: 2016-09-18
tags:
- javascript
- css
- google
---
Today, while trying to think of a clever way to create a "hire Aaron" page (yup, [resume](/resume) is right [here](/resume)), I came up with an idea to animate a Google Street View page.  My initial goal was to animate a rotation and some travel down a road, but I've been unable to find a more seamless way of doing the horizontal travel. It looks like there is just going to be jumps in their photography - which of course makes sense. I wasn't expecting a perfect seamless set of photography, but the current version of it jumps too much and is just too unsettling to see animated.

<!--more-->

**But** I was able to make a pretty cool rotation script for a Google Street View Panorama.  You can [see it here](http://codepen.io/aaronsaray/pen/wzWREY) if you want. (Please note that the codepen version differs slightly because of the way that they sandbox and run their code.)

My goals were simple: Create a full screen street view of the Hoan Bridge in Milwaukee and rotate the view to downtown.  I wanted the rotation to be smooth. In addition, I added on a new requirement towards the end (because of the user experience I noticed): it must fade in and not be a jolty type picture.

So, here is the code I created:

The HTML is pretty simple - just create a standard page with an element that you'll use.  Then, include the two javascript files: one is from Google and the other holds our code. (You'll notice that you may want to add your own API key to the javascript request to Google.  Also of interest, the callback GET parameter is the name of a global function that will be ran once Google finishes loading and initializing the scripts.  My [codepen]((http://codepen.io/aaronsaray/pen/wzWREY) shows a different way to do this.)

```html
<div id="view"></div>        
<script src="main.js"></script>
<script async defer src="https://maps.googleapis.com/maps/api/js?callback=initialize&key=YOUR-KEY"></script>
```

Next, the CSS.  The CSS really has two main parts.  The first is setting the view element and the body to 100% width/height.  I wanted a full-browser-window view.  The second part has to do with the fade in.  In order to have it fade in, the whole browser window is black.  Then, a class with a CSS animation and fade in effect is applied.  That makes the animation look better and not be so jumpy when it begins/the google maps is loading.

```css
html, body {
    height: 100%;
    margin: 0;
    padding: 0;
    background-color: #000000;
}
#view {
    width: 100%;
    height: 100%;
    opacity:0;
}
#view.fade-in {
    -webkit-animation: fadein 4s;
    -moz-animation: fadein 4s;
    animation: fadein 4s;
    opacity: 1;
}
@keyframes fadein {
    from { opacity: 0; }
    to   { opacity: 1; }
}
@-moz-keyframes fadein {
    from { opacity: 0; }
    to   { opacity: 1; }
}
@-webkit-keyframes fadein {
    from { opacity: 0; }
    to   { opacity: 1; }
}
```

Finally, lets take a look at the Javascript for this example.  I decided to write just plain vanilla javascript and not load in any libraries like jQuery.  I'm sure there are more efficient ways to create this javascript functionality - consider this more of a proof of concept.

The `initialize` method is what is called immediately by Google.  In there, a panorama is created for the Google Street View pane.  It is set to a specific position and heading on the bridge. Then a timeout is called before the `fade-in` CSS class is applied and the rotation kicks off.

(You might wonder why I didn't use an event for the panorama to finish loading.  As far as I can tell, I was not able to find one that issued when the view finished loading.  The closest event was something that validated that there was a panorama for that location.  At an rate, the 2 second delay with the fade in seems to handle most loading scenarios.)

The `rotate` method basically just decreases the current heading by a small amount and applies it to the panorama.  It does this in an interval.  Once the last heading is reached, it cancels the interval.

```javascript
var panorama, position, currentHeading, viewElement = document.getElementById('view');
            
/** kicked off from google maps **/
function initialize() {
    position = {lat: 43.0258778, lng: -87.8989059};
    currentHeading = 160;

    panorama = new google.maps.StreetViewPanorama(
            viewElement, {
                position: position,
                pov: {
                    heading: currentHeading,
                    pitch: -10
                },
                linksControl: false,
                panControl: false,
                enableCloseButton: false,
                zoomControl: false,
                fullscreenControl: false
            });
    /** wait a bit - then fade in and start rotate **/
    setTimeout(function() {
        viewElement.className = 'fade-in';
        rotate();
    }, 2000);
}

/** Turn the head from hoan to down town **/ 
function rotate()
{
    var endHeading = -15;
    
    var anim = setInterval(function() {
        currentHeading -= 0.2;
        if (currentHeading < endHeading) {
            clearInterval(anim);
            return;
        }

        panorama.setPov({
            heading: currentHeading,
            pitch: -10
        });
    }, 20);
}
```