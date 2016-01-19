---
layout: post
title: Protect Your Image from Download
tags:
- CSS
- html
- Misc Web Design
---

I came across a great idea dealing with protecting image downloads from the site.  Now, this is not fool-proof.  There are lots of other ways to download the image, but this may stop the casual downloader.  Nope, its not disabling the right click or using java.  It requires one single transparent gif.  Let's see how.

#### What is going to happen

First of all, the user will see the image correctly.  If they choose to 'view image' or right click and download, they will receive the transparent gif instead.

#### The Image to Display

This simple duck.  He is 300px wide and 206px tall.  This is important to know for this feature.
[![duck](/uploads/2009//duck.jpg)](/uploads/2009//duck.jpg){: .thumbnail}

#### The Decoy Image

The decoy image is a transparent gif that is 1px by 1px.  If you'd like to download it, click here: [transparent.gif](/uploads/2009/transparent.gif)

#### The code

Here is the example code to make this work (I'll explain it right after)

{% highlight HTML %}
<html>
    <head>
        <style type="text/css">
            #img {
                background-image: url('duck.jpg');
                width: 300px;
                height: 206px;
            }
        </style>
    </head>
    <body>
        <h1>Like my Image?</h1>
        <img src="transparent.gif" id="img"></img>
    </body>
</html>
{% endhighlight %}



First off, I insert my image element with an ID for quick reference later.  Next, the src attribute of the image is the transparent gif.  This will make the item 1px by 1px with a transparent content.  Then, the CSS sets the duck as the background image.  This will be show initially as a 1px portion from the top left of the duck image.  But then, the css resizes the image element to the size of the duck picture, the background image.  This stretches the transparent gif to that size as well.  Now, the full background image can peek through the stretched transparent gif.  Simple as that!
