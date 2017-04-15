---
layout: post
title: Name CSS Classes More Descriptive
tags:
- CSS
- Misc Web Design
---
One thing I remember being pounded into my head is to not create CSS classes after their physical attributes.  So, for example, if your error text is red, do not call the class red.  Instead, be more descriptive of the content.

**BAD!**

```css
.red { color: red }
```

```html
<span class="red">There was an error!</span>
```

Instead, I was always encouraged to give the class something more descriptive, such as 'error'.

**GOOD!**

```css
.error { color: red; }
```

```html
<span class="error">There was an error!</span>
```

Well, that seems pretty cut-n-dry for a simple example like that.  However, in my most recent design, I've come across some more complex situations.  For example, when you're visiting the webpage, the background of an element might be a really dark grey.  When you're an authenticated user, however, I need it to be a medium grey (hey don't ask - just wait for [WhereIsTheBand.com](http://www.whereistheband.com) to be done!).

Of course, during design, I went to the dark side right away:

**BAD!**

```css
.darkGrey { color: #101011 }
.mediumGrey { color: #212122 }
```

Now, I know I should come up with some descriptive name, perhaps something like "userLoggedIn" or something, but I plan on using these classes in different areas as well.  They might not be dependent on the user being logged in - just might look better that way.  I didn't want to make a lot of duplicate CSS code either.

The compromise: be semi descriptive.

**COMPROMISE!**

```css
.lowContrastBackground { color: #101011 }
.mediumContractBackground { color: #212122 }
```

Not perfect, but seems like a better alternative.
