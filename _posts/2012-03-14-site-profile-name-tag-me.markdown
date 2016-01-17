---
layout: post
title: 'Site Profile: name-tag.me'
tags:
- business
- Misc Web Design
- site profile
---

**Note: I have shut down name-tag.me.  These notes were taken before I pulled the plug.**


The goal was to make a "hello my name is" style name tag without the use of images but with a handwritten font.  

Trouble I ran into:

nametag.me was already taken.  I had to use the dashed version because I couldn't think of a different name.  hellomynameis.com was also taken.  This became a problem because repeat visitors and word-of-mouth tend to forget about the dash.  Plus, it is a lot harder to say: "name dash tag dot me."  I also found out that the .me name, although popular, was still hard for people to remember.  A lot of .com visitors I'm sure.

Technical specifications:

Open Graph integration.

This is the first time that I used an apple-touch icon and an open graph image.  Since the only images on the site were my signature portion (and link to my main website) and share icons, that was the preview that showed up when you shared it on Facebook.  I added the meta property of og:image which pointed to the image.

{% highlight HTML %}
<meta content="http://name-tag.me/apple-touch-icon.png" property="og:image">
{% endhighlight %}    

Mod_expires / mod_deflate

I also used mod_expires and mod_deflate to compress and cache images/css/javascript out for a year.  I also turned off ETags as I find that pretty annoying.  Here are entries from the apache config:


    
    
    SetOutputFilter DEFLATE
    
    ExpiresActive On
    
    ExpiresByType image/png A31536000
    ExpiresByType image/x-icon A31536000
    ExpiresByType application/x-icon A31536000
    ExpiresByType application/javascript A31536000
    ExpiresByType application/x-javascript A31536000
    ExpiresByType text/css A31536000
    
    #turn off etags
    FileETag none
    



Because of this too, I decided to 'version' my css and javascript files.  At the time of writing, I had version 3 of css and version 2 of javascript.  Some people will add parameters at the end of the URLs but other caches/proxies can't handle that properly.  So, I decided to actually just change the name of the file itself.  3.css and 2.js, say hello to the world!

Browser sniffing body tag.  

Because there were specific layout elements in place here (and they had to work exactly), I had to sniff browsers.  I did that with this famous line:


{% highlight HTML %}
<!--[if lt IE 7 ]> <body class="ie6"> <![endif]-->
<!--[if IE 7 ]>    <body class="ie7"> <![endif]-->
<!--[if IE 8 ]>    <body class="ie8"> <![endif]-->
<!--[if IE 9 ]>    <body class="ie9"> <![endif]-->
<!--[if (gt IE 9)|!(IE)]><!--> <body> <!--<![endif]-->
{% endhighlight %}    



This was important because some browsers made the name tag misshapen so I had to change their CSS.

Whitespace

What I didn't do here was remove whitespace from my HTML and CSS.  I have done that on other projects, but I just didn't do that on this one.  It was only 1.21k (2.02k deflated).

Clipboard Integration

I ended up using a script called ZeroClipboard.  This was a javascript that worked cross browser using technologies like the built in clipboard access to flash objects to send the URL to the clipboard.

jQuery

Yup, used the google CDN.

Rounded corners

In order to get rounded corners, but with all browsers covered, I used jQuery Corners plugin.  I really wanted to use CSS border-radius but I also wanted this to work in IE... oh well.


TTF Font

I defined the font I wanted to use using a utility called FontSquirrel:

{% highlight CSS %}
@font-face {
    font-family: 'DesyrelRegular';
    src: url('desyrel-webfont.eot');
    src: local('☺'), url('desyrel-webfont.woff') format('woff'), url('desyrel-webfont.ttf') format('truetype'), url('desyrel-webfont.svg#webfontOicIDNk6') format('svg');
    font-weight: normal;
    font-style: normal;
}
{% endhighlight %}    
    



Then later, defiend it in the font-family declaration:

{% highlight CSS %}
font-family: DesyrelRegular, tahoma, verdana, arial, sans-serif;
{% endhighlight %}    
    



Image Download

I was able to use the same ttf font in my image downloading.  I used imagettftext to position the items.  I then sent the following headers:

{% highlight PHP %}
<?php
header("Cache-Control: public");
header("Content-Description: File Transfer");
header('Content-Disposition: attachment; filename="Hello My Name Is.png"');
header("Content-Type: application/octet-stream");
header("Content-Transfer-Encoding: binary");
{% endhighlight %}    


Lessons Learned

- Branding is important with the URL.  I think a lot of people didn't get the dash in the name.
- Offering too much help, like click to copy to clipboard, is not worth it (Google analytics says that hardly anyone clicked that).
- Average time on site was under 5 seconds.  It's unclear if people could use the functionality that quickly or if they just didn't understand it and bounced.  I should have made action funnels on actually filling in the box.
- Check your userbase.  Turns out, I didn't need to use jquery corners (of course I wouldn't know that till now).  1% of my visitors were Internet Explorer over the lifetime of the site.

RIP Name-Tag.me!

_Screenshots / Downloads_

[![](http://aaronsaray.com/wp-content/uploads/2012/03/Screenshot-at-2012-03-14-150408-150x150.png)](http://aaronsaray.com/wp-content/uploads/2012/03/Screenshot-at-2012-03-14-150408.png)
[![](http://aaronsaray.com/wp-content/uploads/2012/03/Screenshot-at-2012-03-14-150425-150x150.png)](http://aaronsaray.com/wp-content/uploads/2012/03/Screenshot-at-2012-03-14-150425.png)
[![](http://aaronsaray.com/wp-content/uploads/2012/03/Screenshot-at-2012-03-14-150450-150x150.png)](http://aaronsaray.com/wp-content/uploads/2012/03/Screenshot-at-2012-03-14-150450.png)
[![](http://aaronsaray.com/wp-content/uploads/2012/03/Hello-My-Name-Is-Aaron-150x150.png)](http://aaronsaray.com/wp-content/uploads/2012/03/Hello-My-Name-Is-Aaron.png)
