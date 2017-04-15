---
layout: post
title: Use your own short domain while waiting for BitLy Pro
tags:
- javascript
- Misc Web Design
---

If you've checked out [BitLy Pro](http://bitly.pro), you're probably pretty excited like I am.  I saw it and immediately registered **saray.me** for a short URL.  When I went to sign up, I found it was still in a queue system where you had to wait to get an invite.  In the mean time, I still want to start using my domain.

After reading some of the documentation, I found that once you sign up for a bit.ly pro account, your existing bit.ly links that were created when you were logged in will be accessible via your short URL.  With this in mind, I decided to just continue to create my bit.ly links but redirect my domain to bit.ly for the time being.

### Log In to Bit.Ly

[Goto bit.ly](http://bit.ly) and login. (or create an account if you want).  This is necessary so that you can now create and track your links.

### Modify your domain

I'm using GoDaddy.  I decided to forward my domain.

First, select your domain in the domain manager.  Then, choose the forward domain option at the top of the list.

[![](/uploads/2010/post1.png)](/uploads/2010/post1.png){: .thumbnail}

[![](/uploads/2010/post2.png)](/uploads/2010/post2.png){: .thumbnail}

On the popup, choose the advanced option link.  Make sure to choose temporarily forward the domain.  This is needed because at some point, we'll be redirecting this domain's nameservers to bit.ly again to natively do this URL forwarding.  Enter "http://bit.ly" in the box and click ok.

[![](/uploads/2010/post3.png)](/uploads/2010/post3.png){: .thumbnail}

### Try it out

Now, goto [bit.ly](http://bit.ly) and shorten an URL.  I'm shortening **http://aaronsaray.com/blog**.  This is now: **http://bit.ly/cZqq0e**.  When I enter [http://saray.me/cZqq0e](http://saray.me/cZqq0e) into the browser, it serves the short URL from bit.ly.

Yay!

#### Timesaving Feature

Since I do continue to get my bit.ly links with http://bit.ly instead of http://saray.me in the beginning, I decided to make a Firefox bookmarklet to replace this for me.  It's pretty simple.  All it does is take bit.ly and replace with saray.me.

```javascript
var x=prompt('Bit.ly URL');alert(x.replace('bit.ly','saray.me'));
```
    

Here, you can drag this to your toolbar if you want :)

[Saray.Me the Bit.Ly](javascript:var%20x=prompt('Bit.ly%20URL');alert(x.replace('bit.ly',%20'saray.me')))
