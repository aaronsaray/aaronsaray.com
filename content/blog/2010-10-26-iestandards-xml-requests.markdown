---
title: IEStandards.xml requests
date: 2010-10-26
tags:
- misc-web
---
The other day, I saw some 404 errors for the file **`IEStandards.xml`** in my error logs.  After a little research, I found some links [here](http://blogs.msdn.com/b/ie/archive/2009/07/01/ie-compatibility-list-pruning.aspx) and [here](http://blogs.msdn.com/b/askie/archive/2009/03/23/understanding-compatibility-modes-in-internet-explorer-8.aspx) that lead me to believe that I had done something wrong.
Let me explain...

<!--more-->

The site I created uses an extensive amount of javascript.  For some reason, Internet Explorer was not allowing this site to function correctly - only on certain instances of IE8.  It was disallowing an AJAX submission and instead, redirecting the page with a popup warning information bar.  Grrr!

I did some research and found out that I needed to set IE8 to emulate IE8.  I did so by entering the following tag into the head of my document:

```html
<meta content="IE=EmulateIE8" http-equiv="X-UA-Compatible">
```

Problem solved. It worked for the user and we moved on.  However, it appears that IE was actually sending an additional request now... or at least I think that was happening.  I was seeing the 404's for the **`IEStandards.xml`** file.

I believe the solution is a two fold solution, now. It is necessary to use the meta tag AND have the resulting **`IEStandards.xml`** file in place.

**IEStandards.xml**

```xml
<ie8standardsmode></ie8standardsmode>
```

I think this is the complete solution - before I had just "patched" it.  The documents always made it seem like it was one or the other - not both. Anyone know if I'm correct?
