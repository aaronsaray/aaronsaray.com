---
title: "Showing UTC in the Users Timezone Easily"
date: 2025-06-18T15:44:21-05:00
tag:
- html
- javascript
---
In most of my applications, time is reflected in the UTC timezone. This is great for logic and math, but not so great when showing the date to the regular user.

Now, it's pretty easy to show the UTC dates in the user's timezone, without even asking them what it is.

Let's see how to do this with a little bit of HTML and Javascript.

<!--more-->

> Before we continue, let's just clarify: this is only for showing dates. This approach is not reflecting any logical calculations, scheduling, etc. The topic of timezones is pretty in depth and way larger than this article.

So, let's take a look at what we normally have.  In this example, I'm going to use the PHP library Carbon - but it works with any string date value.

Let's imagine we have a date and we want to display it in something like Laravel blade. (Again, this can happen in regular HTML - I'm just using blade so we don't have to worry about `_toString()` methods and the like.)

So, let's start out with our date object for this entire entry:

```php
$carbon = \Carbon\Carbon::parse('2025-06-18 10:00:00');
```

Now, how might we output it?

```html
Time from Carbon in UTC: {{ $carbon }}
```

This will output something like: **Time from Carbon in UTC: 2025-06-18 10:00:00**

Excellent. That's great. That's the exact time in UTC. But, not in the user's timezone. (Also it's a very stringent format. We'll deal with that later.)

Well, let's make use of some of the built-in Carbon functionality, first, just to confirm there isn't any 'magic' I can be using here.

```html
Date time string: {{ $carbon->toDateTimeString() }}<br>
Date time local string: {{ $carbon->toDateTimeLocalString() }}
```

This outputs the values of **2025-06-18 10:00:00** and **2025-06-18T10:00:00**.

This just gets us the default output (which we had seen earlier) and a local format similar to the ISO standards. Useful, but not what I need yet.

When doing research, I found out about the `time` element in HTML5. Sometimes HTML5 tags have their own sort of 'magic' in them - so I thought I'd give it a try. 

```html
<time datetime="{{ $carbon->toDateTimeString() }}">{{ $carbon->toDateTimeString() }}</time>
```

Ok - fine. This just shows me the **2025-06-18 10:00:00** again. I know it's a time, though. 

Now, it's time to move on to actually making this work.

We know that we can get the user's timezone from the browser. I know that I can modify HTML elements.

Now, let's imagine one very specific element:

```html
<time 
  id="modify-this-time" 
  datetime="{{ $carbon->toDateTimeString() }}"
>{{ $carbon->toDateTimeString() }}</time>
```

I've added an ID just to make the following code easier to read.

Let's look at some javascript then:

```javascript
const timeTag = document.querySelector('#modify-this-time');
const time = timeTag.getAttribute('datetime');
const date = new Date(time);
const browserTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
timeTag.innerText = date.toLocaleString('en-US', {timeZone: browserTimezone});
```

Now, when the browser renders the page, the Javascript kicks in, and we see **6/18/2025, 5:00:00 AM**

Awesome! In one fell swoop, we get the proper timezone AND the proper locale display. (Although I did force in `en-US` you can likely get this from the browser or the request, too).

This is great! Now, let's imagine we're using AlpineJS (or Vue or something else). We can even make this componentized.  Here's one quick example in Alpine:

```html
<time
  x-data
  x-init="
    const date = new Date($el.getAttribute('datetime'));
    $el.innerText = date.toLocaleString('en-US', {
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
    });
  "
  datetime="{{ $carbon->toIso8601String() }}"
>{{ $carbon->toDateTimeString() }}</time>
```

This is basically the same thing, but with AlpineJS and some of the code tightened up. You could even abstract this further into it's own shared AlpineJS directive code or a Vue component.
