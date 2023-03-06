---
title: Making the most of the toString method in Javascript
date: 2016-02-06
tags:
- javascript
---
Javascript objects have a built-in function called `toString()` which pretty much does what you think it does - it renders a string representation of that object.

<!--more-->

For the most part, this is left unused by a lot of javascript libraries I've seen.  You might notice if you're using old school `alert()` instead of `console.log()` that you see output similar to `[object Object]` a lot.  And, that's [by design](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/toString).  But, like many other functions in javascript, you can use the prototype property to override the default method.

Take, for example, this code:

```javascript
function Person(name, gender) {
  this.name = name;
  this.gender = gender;
}
Person.prototype.toString = function personToString() {
  return this.name;
}

var p = new Person("Aaron", "M");
alert(p);
```

When executed, this will alert a string of "Aaron" - as that is what the `toString` overridden method is doing.

**So let's make it more useful**

Let's add some logic in this function.  We're going to make a person function that has a first + last name, and a gender.  When we use it, we want to have the full name plus a prefix of Mr or Ms.

```javascript
function Person(firstName, lastName, gender) {
  this.firstName = firstName;
  this.lastName = lastName;
  this.gender = gender;
}

Person.prototype.toString = function personToString() {
  var fullName = "";
  switch (this.gender) {
    case "M":
      fullName += "Mr ";
      break;
    case "F":
      fullName += "Ms. ";
  }
  fullName += this.firstName + " " + this.lastName;
  
  return fullName;
}

var hero = new Person("Wonder", "Woman", "F");
document.querySelector('#name').innerHTML = hero;
```

In this case, we're capturing the information and then creating a logic-injected `toString()` method.  When this particular code is ran, an element with the ID of `name` gets populated with `Ms. Wonder Woman` - hooray!

**Take it easy there...**

I'll admit it - I actually had an urge to take this further.  What if I used an underscore template inside of the `toString` method?  I could create templates on my objects and then just pass them directly to the HTML.  Everything would be glorious!

But, on further reflection, I would advise against this.  I think the method is great for doing some simple data manipulation and combination (or filtering), but it should not be used to inject any HTML into the dom via a string rendering of itself. 