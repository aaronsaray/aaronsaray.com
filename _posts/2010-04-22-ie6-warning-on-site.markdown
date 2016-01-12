---
author: aaron
comments: true
date: 2010-04-22 16:03:41+00:00
layout: post
slug: ie6-warning-on-site
title: IE6 warning on site
wordpress_id: 590
categories:
- jquery
- Misc Web Design
tags:
- jquery
- Misc Web Design
---

So I got permission at the beginning of March to add an Internet Explorer 6 deprecation message to one of the sites I'm working on.

My goals are simple:




  * Do not pump the message out to search engines or anyone without IE6


  * Remind strongly but do not hinder the usage of the site



So, I felt the best way to do this was through a conditional comment.  In the head of the document, the first thing I inserted is this:


    
    
    
    



So, any browser that is Internet Explorer will understand this conditional comment.  If it is Less Than or Equal to IE 6, it will load that javascript.

The javascript contains the following content:

    
    
    $(function(){
    	var ieDiv = $("<div id="ie6warning"><img src="/images/ie6logo.gif" alt="ie"></img><div><h3>Did you know that your browser is out of date?</h3><p>To get the best possible experience using our website we recommend that you upgrade your browser to a newer version.<br></br>The current version is <a href="http://microsoft.com/ie">Internet Explorer 8</a>.  The upgrade is free.  <em>(If you're using a PC at work you should contact your IT administrator.)</em> You may also try some other popular Internet browsers like <a href="http://getfirefox.com">Firefox</a> or <a href="http://google.com/chrome">Google Chrome</a>.</div></div>");
    	$("#hd").prepend(ieDiv);
    });
    



As you can tell, I'm using jQuery.  However, the concept should translate to other javascript implementations as well.  Basically, a message is created with a warning image.  Then, the header element gets this box prepended to it.

Finally, we have a bit of css

    
    
    /** ie 6 warning **/
    #ie6warning {
    	background-color: #FFFFDD;
    	padding: 20px;
    }
    #ie6warning img {
    	float: left;
    	margin: 12px 0 12px 5px;
    }
    #ie6warning div {
    	margin-left: 140px;
    	padding-left: 27px;
    	border-left: 1px solid #aaa;
    }
    #ie6warning h3, #ie6warning p {
    	margin: 0;
    }
    



The finished product looks something like this:
[![](http://aaronsaray.com/blog/wp-content/uploads/2010/04/untitled-300x34.jpg)](http://aaronsaray.com/blog/wp-content/uploads/2010/04/untitled.jpg)
