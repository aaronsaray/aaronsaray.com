---
title: Be Explicit with Your JS Function Parameters
date: 2018-08-04
tags:
- javascript
- react
- nodejs
---
During a code review, a coworker showed me a piece of code for a stateless React component that was similar to this:

<!--more-->

```javascript
const sizer = (props) => {
  {length, width, height} = props;
  
  //code here to create box with vars length, width and height
  return box;
}

const box = sizer(this.props);
```

There was something that was bothering me about this - especially the idea that we'd pass `props` directly in.  He picked up on it too and said he's seen some alternative function declarations that specified the props as an incoming object instead that would be destructured immediately.  You might see something like this:

```javascript
const sizer = ({length, width, height}) => {
   //code here to create box with vars length, width and height
  return box;
}

const box = sizer({
  length: this.props.length, 
  width: this.props.width, 
  height: this.props.height
});
```

I said I liked this a bit more because it was more explicit. But something was still bothering me.  We both agreed that this probably still wasn't the right way, so he went back to using the `props` parameter.  I mentioned I felt like this was something akin to global variables and you were passing in more context, but something was still bothering me.  We moved on.

### What Was Wrong With These?

I kept thinking that we weren't being explicit enough about this method.  We were requiring too much construction in one way, or in another way we were expecting specific object syntax.  Sure, with Typescript and/or React proptypes we could specify what we needed, but I think the issue is deeper.  With Typescript we require another layer of tooling (which I like, but I don't think is always required).  With proptypes, we pretty much are saying we can't solve this with properly constructed Javascript, it must be a React-based solution.  Again, that makes sense because we were working in React, but I feel like there's still something wrong here.

Then it hit me.  The method wasn't explicit enough, it wasn't reusable enough, and it required too much context inside or outside, depending on which solution we picked.  Instead, let's write the following method:

```javascript
const sizer = (length, width, height) => {
  //code here to create box with vars length, width and height
  return box;
}

const {length, width, height} = this.props;

const box = sizer(length, width, height);
```

The differences here are subtle, but they're important.  

First, the `sizer` function explicitly defines the three requirements it has for us, but they're not required to be passed in using an object.  That's important because we don't want to have to know what kind of 'special object' this method needs.  Instead, it just says here are my three parameters I need to do my job. (Then, later we could use Typescript or similar tooling to lock down the types if we really wanted to.  That's beyond the scope of this article.)  It's very clear we need these three values and then we're good to go.

Next, outside of when we call the `sizer` method, we're not passing in our global properties (I say "global" but it's really global to this and child components I suppose - more like a protected property in scope).  We can build useful named parameters as a sort of self-documentation in the code by destructuring only the properties from `this.props` that we actually need.  Then we can call the method with just the properties it needs. It's pretty clear we don't need to pass in context, plus its clear what it's expecting to receive.

Finally, this allows our `sizer` function to be more flexible as well.  This usage of it makes sense in that we're using it as maybe a single box creation, or in only this particular context.  But imagine we wanted to abstract this a little bit more and use this to create a palette.  We'd have to then have a component that had the properties of our palette's size (and maybe we will) but we shouldn't be required to do that.  Now, with our method, it's actually possible to do something like this:

```javascript
const sizer = (length, width, height) => {
  //code here to create box with vars length, width and height
  return box;
}

const palette = sizer(itemsDeep * 12, itemsWide * 4, itemsTall * 8);
```

This is kind of a sloppy implementation of that, but it's used to demonstrate that this method is now more flexible.  

### End Notes

Don't pass around more state and properties than you need to.  The reason we like componentized architecture so much is the fact that it can be very segregated and contained.  Components shouldn't have to understand how they're called or how they fit into something, especially if they're stateless.  Finally, be explicit with your method and function declarations when you can.  This makes it easier to read the code, but more importantly, is a way of self-documentation.