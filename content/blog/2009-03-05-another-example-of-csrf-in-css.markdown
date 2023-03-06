---
title: Another example of CSRF - in CSS
date: 2009-03-05
tags:
- css
- javascript
- security
---
Just saw this really cool example get submitted on one of my websites testing for CSRF:

<!--more-->

```css
#logo{background:url(deletepost.process.php?id=12345&userID;=12345);
```
    
Just another great example of why you should

1) not use GET for irreversible changes

2) filter filter filter! (I edited that posting, it was a filtered by my script already...)
