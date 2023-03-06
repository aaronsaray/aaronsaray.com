---
layout: post
title: Google Analytics Campaign Link Builder Bookmarklet
tags:
- javascript
---
I was thinking about how difficult it is to create custom links for our campaigns at "the big L" - so I decided to create my own function to build these.  To top it off, I'll make it a bookmarklet.  The best thing about it is that it will bring in the current page and put that inside of the bookmarklet in the case you want to build the link right from the page you're viewing.

So, here is the bookmarklet - feel free to drag it to your browser:
[GA Campaign Link](javascript:function r(q,e,d){d=typeof(d)!="undefined"?d:"";var x=prompt(q,d);if(x==""&&e)return r(q,e,d);if(x==null)throw new Error("Script exited");return x}var l=r("Full URL of destination page:","URL Required",window.location),p={"utm_source":r("Campaign source (referrer: google, citysearch, newsletter):","Source required"),"utm_medium":r("Campaign medium (cpc, banner, email):","Medium required"),"utm_term":r("Campaign term (identify the paid keyword):"),"utm_content":r("Campaign content (used to differentiate ads):"),"utm_campaign":r("Campaign name (product, promo code or slogan):","Campaign name required")},t=[];for(var d in p)t.push(encodeURIComponent(d)+"="+encodeURIComponent(p[d]));l+="?"+t.join("&");alert(l);)

For those of you who are more interested in the code, here is the uncompressed version:

```javascript
function r(q,e,d)
{
  d = typeof(d) != "undefined" ? d : "";
  var x=prompt(q,d);
  if (x=="" && e) return r(q,e,d);
  if (x == null) throw new Error("Script exited");
  return x;
}
var l = r("Full URL of destination page:","URL Required", window.location),
  p = {
    "utm_source": r("Campaign source (referrer: google, citysearch, newsletter):", "Source required"),
    "utm_medium": r("Campaign medium (cpc, banner, email):", "Medium required"),
    "utm_term": r("Campaign term (identify the paid keyword):"),
    "utm_content": r("Campaign content (used to differentiate ads):"),
    "utm_campaign": r("Campaign name (product, promo code or slogan):","Campaign name required")
  },
  t=[];
for (var d in p) t.push(encodeURIComponent(d) + "=" + encodeURIComponent(p[d]));
l += "?" + t.join("&");
alert(l);
```
