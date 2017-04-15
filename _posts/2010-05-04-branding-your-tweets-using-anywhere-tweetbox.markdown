---
layout: post
title: Branding your Tweets using @anywhere tweetbox
tags:
- javascript
- twitter
---

With Twitter's new @anywhere features, it's now possible to brand your tweets from your own web page.  While I still like using Tweetdeck or Seesmic for my actual interaction on twitter, I have started tweeting a bit from my own web page as well.

@anywhere features an interactive tweetbox that you can embed on your website.  The javascript call allows you to add your own content to the box - just waiting for the user to hit TWEET. (Of course, they have to connect to your website.)  In order to leverage this for my own website, and brand my tweets from AaronSaray.com, I decided that I could use this box in my browser sidebar.  Here are the steps - in case you want to do it yourself!

### Get Your "App" an API Key

This is pretty simple.  First, log into the web interface for twitter.  Then, visit the apps page at [http://twitter.com/apps](http://twitter.com/apps). Click on register a new application if you need to.

On this page, you can enter all the details of your application.  For the application name, I entered AaronSaray.com to provide proper branding.  Last, make sure that you check Read/Write access.  Your application needs to be able to post!

After this is complete, you may want to view your page's settings.  (You can do this by clicking on the name of the application on the apps page.)  The important thing to do here is to access the 'Consumer Key' and copy this down.

### Create your webpage

Next, I created a web page on my domain.  It has the following code:

```html
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <title>Twitter</title>
        <style type="text/css">
            body {
                background-color: #f3f3f3;
            }
        </style>
        <script src="http://platform.twitter.com/anywhere.js?id=CONSUMER_KEY&v=1" type="text/javascript"></script>
    </head>
    <body>
        <div id="custom-tweetbox"></div>
        <script type="text/javascript">
        twttr.anywhere(onAnywhereLoad);
        function onAnywhereLoad(twitter) {
            twitter("#custom-tweetbox").tweetBox({
                label: "<span style='color: #aaa'>Tweet this:</span>",
                height: 90,
                width: 200
            });
        };
    </script>
    </body>
</html>
```
    
First off, make sure to change CONSUMER_KEY to the actual key from your applications settings page. Next, you can change the CSS in this page to match your theme if you want.  Since I'm loading this in the side bar, this is the simple layout I chose.

Finally, include the javascript and configure the tweetbox.  I chose not to prepopulate my tweetbox with content.  However, you could if you wish...

### Add Book Mark


Add the bookmark to your browser.  I added mine to my firefox bookmark toolbar.  Then, I right clicked and chose properties.  I checked the 'load this in the sidebar' option.

### Use It!


The first time you use the tweet box, it will prompt you to connect to your website. After this is done, you can use this easily.  My branded tweets show that its from AaronSaray.com nicely.  See?

[![](/uploads/2010/tweet.jpg)](/uploads/2010/tweet.jpg){: .thumbnail}
