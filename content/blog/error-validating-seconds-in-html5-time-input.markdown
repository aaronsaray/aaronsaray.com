---
title: Error Validating Seconds in HTML5 Time Input?
date: 2015-05-02
tag:
- html
---
Turns out, it's just another issue of RTFM - but maybe this will save you some headache!

<!--more-->

I was using a simple HTML5 input of time...

```html
<input type="time" name="the-time">
```

At first, the user would enter something like "4:00 PM" - which I'd convert to 15:59:59 on the backend.  When I reloaded the page, it now reflected "3:59:59 PM" in the input field.

Then, the user would go to edit the time to say... "3:30:00 PM" and they'd get the following error in Chrome:

{{< image src="/uploads/2015/Screenshot-2015-05-02-10.23.50-300x101.png" alt="Screenshot" >}}

"Please enter a valid value.  The two nearest valid values are..." - that didn't make any sense to me.

Well, turns out that every number field in html5 spec is using `step=1` on the input fields - however, time is using `step=60` - as in 60 seconds.  (I guess the authors preferred minutes over seconds).  [The spec](https://html.spec.whatwg.org/multipage/forms.html#time-state-(type=time)) clearly defines this - but I guess I just missed that part.

Hopefully it saves you some time too - in the end, this is what I changed my input field to - and it worked!

```html
<input step="1" type="time" name="the-time">
```
