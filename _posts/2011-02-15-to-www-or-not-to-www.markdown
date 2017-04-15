---
layout: post
title: To WWW or not to WWW
tags:
- apache
- Misc Web Design
- performance
- programming
---
I run into this question a lot.  Should my website have www in the domain name.  Should I be going to aaronsaray.com or www.aaronsaray.com??  That is to say, which should be the default home page domain?  Let's discuss...

### Take care of both

Regardless of how you choose, people will always find a way to visit both the www and the non-www versions of your site.  It is imperative that you handle both cases.  There is nothing less professional than someone going to www.aaronsaray.com and not finding anything - but aaronsaray.com would work flawlessly.

### In support of WWW

So far, I've come up with two arguments for having the WWW on your domain.  

First, when printing it out, less internet-fluent will recognize it as a web address.  Think about the .me domain extension.  Imagine seeing a business card that says 
    
    Aaron Saray
    Saray.me

Someone who wasn't familiar with that TLD may not understand that that is a web address.  Instead, if it had the WWW, they may be more apt to determine that at a glance:
    
    Aaron Saray
    www.Saray.me

Second, when using subdomains for your application, it can be more efficient to not send main 'application cookies' with the request.  If your main application is at aaronsaray.com, the session cookie would be of the domain aaronsaray.com - which would be sent to files.aaronsaray.com, images.aaronsaray.com, etc.  If I wanted to eek every last bit of performance out of having assets on a different subdomain, I wouldn't want the browser to recognize these subdomains and send the cookie.  If I had www.aaronsaray.com, and set the cookie to belong to that domain, requests to images.aaronsaray.com would not receive that cookie.

Finally, auto completion, both user and tool, factor in.  In my browser address bar, I typed in kjkjerjrr and hit enter.  My browser politely informed me that no record was found for http://www.kjkjerjrr.com/.  Then, tell my mom to go to aaronsaray.com.  I will give you a million dollars if you can get that lady not to type WWW in front of every URL she ever hears.  Although it will resolve fine, it does require another redirect to get to the proper content.  On her dialup, that is noticeable!

### In support of no-www

The first statement I can think of is to undo the first argument for the WWW section - using the www shows it is a web address.  I would suggest an alternative that alleviates this problem:
    
    Aaron Saray
    http://Saray.me

This way, even automated scanners in web page content may identify it as a link and auto-hyperlink it.

Another reason is the communication of this domain orally.  Some would argue that saying the full www based domain would be harder and more confusing.
    
    double you double you double you dot aaron saray dot com

vs
    
    aaron saray dot com
    
### Pick one -and enforce it

Once you pick your www or not-www domain name, stick with it.  Always provide links with that exact domain match.  Visit tools like the Google Webmaster Tools to identify the primary domain.  Finally, add the redirect in your Apache configuration (or use .htaccess)

    RewriteEngine On
    RewriteBase /
    
    #require WWW
    RewriteCond %{HTTP_HOST} !^www\.(.+)$ [NC]
    RewriteRule ^(.*)$ http://www.%1/$1 [R=301,L] 
    
    #OR
    
    #do not require www
    RewriteCond %{HTTP_HOST} ^www\.(.+)$ [NC]
    RewriteRule ^(.*)$ http://%1/$1 [R=301,L] 

### What do I choose?

Well, there are two strong camps here.  The [yes-www.org](http://web.archive.org/web/20080107105728/www.yes-www.org/www-is-not-deprecated/) and the [no-www.org](http://no-www.org/) both have compelling reasons.  But, after looking at some of my web high performance heroes like facebook and yahoo, I've decided:

**From now on, my new websites will have the WWW based domain as their primary address.**

What do you think?
