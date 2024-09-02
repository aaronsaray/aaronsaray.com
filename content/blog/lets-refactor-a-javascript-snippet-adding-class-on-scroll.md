---
title: "Let's Refactor a Javascript Snippet for Adding Class on Scroll"
date: 2024-09-02T11:07:04-05:00
tag:
- javascript
---
There's a common design pattern on a lot of websites to alter the header when the user scrolls down. A lot of times this is simply some sort of handler that adds a class (or removes it). (There are other complex, arguably 'better' solutions with IntersectionObserver - but that's not the point of this article.) Let's take a look at a very simple version of a script that watches for scroll and adds/removes a class on the body. Then, let's make it better - and learn while we do it.

<!--more-->

Here is our initial version.

```javascript
function scrollHandler() {
  if (document.scrollingElement.scrollTop > 0) {
    document.body.classList.add("scrolled");
  } else {
    document.body.classList.remove("scrolled");
  }
}

document.addEventListener("scroll", scrollHandler);
scrollHandler();
```

This adds an event handler to the `document` for when the user does a `scroll`.  The `scrollHandler()` function checks to see if the user has scrolled away from the top - and if so, adds a class. Otherwise, it's removed. Finally, the handler method is called immediately because we want to apply the class on page load as well if the browser is already scrolled.

### Refactoring

Now, accepting this code as it is, let's do some refactoring.  The first thing I want to do is handle the scroll checking a little bit different. **UX is important** and so I want to pay attention to what my experience needs are compared to the real world.

I believe that a lot of users might accidentally scroll the page a few pixels when swapping around. According to our code, that'll cause this to jitter classes back and forth.  What I want instead is to give it about 10 pixels before it happens.  That way, if the user is scrolling little bits (or has mobility issues) nothing flashes or changes. Otherwise, when the user begins their scrolling journey on purpose, we know they're likely to scroll a bigger block than 10px anyway - and that bigger block would likely require an update to this header.

So, let's change the `scrollTop` check to `10`.

**Code reusability is key** and I think we can make our method a little bit more reusable.  Let's pass in a class name with a default value.

```javascript
function scrollHandler(className = "scrolled") {
```
Now, you will be able to pass in a class name (we're adding the `className` variable to the calls of `add()` and `remove()`.  This just requires one quick change now to our event listener.

```javascript
document.addEventListener("scroll", () => scrollHandler());
```

**Duplicate code sucks** so I want to look at that if statement. Looks like the only real difference is one method name.  Now, Javascript can access object properties/methods via array access. So, this means we can make dynamic properties to access these methods.  So we might try something like this:

```javascript
function scrollHandler(className = "scrolled") {
  document.body.classList[document.scrollingElement.scrollTop > 10 ? 'add' : 'remove'](className);
}
```

Look at how much more simple that method is!  Except, I don't really like it.  Maybe I could refactor out that array access into it's own variable... butt here has to be a better way.  Turns out there is! The [toggle()](https://developer.mozilla.org/en-US/docs/Web/API/DOMTokenList/toggle) method!  It accepts a secondary parameter which determines if it adds or removes the class.

```javascript
function scrollHandler(className = "scrolled") {
  document.body.classList.toggle(className, document.scrollingElement.scrollTop > 10);
}
```

Now, let's take it to the next level. I don't like having to call the method after adding the event listener. There's gotta be some way to call the method first, while defining it, and then register it.

```javascript
let scrollHandler;
(scrollHandler = (className = "scrolled") =>
  document.body.classList.toggle(
    className,
    document.scrollingElement.scrollTop > 10,
  ))();
```

Ok - I'm all for using the most recent functionality in Javascript, but this feels a little excessive. You can get lost in the brackets and parens, not to mention you now have to modify the way you call the handler with either some binding or that anonymous method.  I'm not going to continue down this line.

**Sometimes refactoring can go too far** and you aren't able to follow your work. Or if you can, and you feel its 'clever', then it's probably not something other programmers are going to easily consume. 

Let's see my final product.

```javascript
function scrollHandler(className = "scrolled") {
  document.body.classList.toggle(
    className,
    document.scrollingElement.scrollTop > 10,
  );
}

document.addEventListener("scroll", () => scrollHandler());
scrollHandler();
```

So, I was able to make the code a bit more readable I think, used a new method that I learned about, and made it customizable. I did some more refactoring but found that that was going to make it just confusing to follow. So, this is the final result. Not all refactoring has to drastically change code.