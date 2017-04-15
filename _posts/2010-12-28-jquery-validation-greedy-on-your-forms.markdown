---
layout: post
title: jQuery Validation - greedy on your forms?
tags:
- javascript
- jquery
---

I was creating a page with two forms on it.  I ran into an issue where I would fill out one form, and it would fail validation.  Then, I tried to do the other form with passing fields, and it would keep invalidating the previous form on the same page.

I had been doing this:

```javascript
$('form').validate();
```
    



Instead, I found that I needed to loop through each form on the page and validate each single one in their own context. I replaced it with this code:


    
```javascript
$('form').each(function(){
     $(this).validate();
});
```
    
