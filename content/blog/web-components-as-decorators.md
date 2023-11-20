---
title: "Web Components as Decorators"
draft: true # change date!
date: 2023-11-20T16:34:03-06:00
tag:
- javascript
---
I love the idea of [web components](https://developer.mozilla.org/en-US/docs/Web/API/Web_components) for using more native and vanilla javascript instead of heavy client libraries.  But if you're not already on this train, it can be difficult to get started. But, I think I found a nice way to bridge the gap - using web components as decorators. Let me show you how.

<!--more-->

_First of all, I should say_ I'm not even sure if this is a 'good idea' - what a way to start out a blog entry! But, this is something _I think_ is ok - but I haven't tried it as of writing yet in a production app.

Now, let's get going.

## The Problem

We have an HTML form element that we want to stop duplicate submits on the client side.  This can be done very simply with Javascript. Let's see how we might do that.

First, this is the HTML for our form.

```html
<form action="action.php" method="post">
  <div>
    <label for="name">Name</label>
    <input type="text" required name="name" id="name">
  </div>
  <div>
    <label for="email">Email</label>
    <input type="email" required name="email" id="email">
  </div>
  <div>
    <label for="message">Message</label>
    <textarea required name="message" id="message"></textarea>
  </div>
<button type="submit">Submit!</button>
</form>
```

Next, let's add some javascript to the page.

```javascript
document.querySelector('form').addEventListener('submit', function (event) {
  if (event.target.hasAttribute('data-submitting')) {
    event.preventDefault();
    return;
  }
  event.target.setAttribute('data-submitting', true);
});
```

Arguably, it's considered bad UX to disable a button on the form when submitting.  Also, that doesn't stop the form from submitting again - someone could tab into the input boxes and hit enter.  I've [read here - which is actually the inspiration for this idea](https://gomakethings.com/dont-disable-buttons/) that it can also cause problems with screen readers.

So instead, we're going to grab all forms and watch for their submit function, and add a data attribute of `data-submitting` to them when they are submitted. If they already have that attribute, we'll prevent the default submit (because one is already happening) and return.

Pretty sweet setup - thanks for the ideas [Chris](https://gomakethings.com/about/).

There are some potential issues here, though. It only grabs the first form on the page, not all of them.  Also there's not any visibility that something 'magical' is happening to this form.

Sure, we could use `querySelectorAll` and loop over all forms, but what if we had a form that we didn't want to interfere with?  We could also add a class to the form to indicate the special behavior.  But, if you're a purist, that's a little sickening because classes tend to indicate CSS behavior.  I suppose you could use a data attribute as well...

But what about compositing a web component around any form you want to have this functionality with?

## Web Component as a Decorator Solution

I want to enclose any form with a web component that indicates that we'll be handling some special functionality with the interior form's behavior.

The updated HTML looks like this:

```html
<form-single-submit>
  <form action="action.php" method="post">
    <div>
      <label for="name">Name</label>
      <input type="text" required name="name" id="name">
    </div>
    <div>
      <label for="email">Email</label>
      <input type="email" required name="email" id="email">
    </div>
    <div>
      <label for="message">Message</label>
      <textarea required name="message" id="message"></textarea>
    </div>
    <button type="submit">Submit!</button>
  </form>
</form-single-submit>
```

You can see that there is a special tag around the form. That's it!

Let's take a look at the javascript. (I should warn you that this javascript is a little bit more complex than the last example - but that's fine. Plus, keeping these concerns a bit separate allows you to integrate junior developers into your project who don't have to know advanced javascript if they just have a web component dictionary unique to your project.)

```javascript
class FormSingleSubmit extends HTMLElement {
  submitting = false;

  connectedCallback() {
    this.querySelector('form').addEventListener('submit', function (event) {
      if (this.submitting) {
        event.preventDefault();
        return;
      }
      this.submitting = true;
    });
  }
}

customElements.define('form-single-submit', FormSingleSubmit);
```

Web components need to extend the `HTMLElement` as a class. At the end of this snippet, the class's pascal case name gets converted to a kebab case HTML element and defined.  Remember, you should always use at least two words for your web component name as browsers have promised not to introduce multi-word tags in the future - so you'll never clobber something new they introduce.

Then, we're creating a variable and defining it with false inside of our instance.  This will turn to true when it's being submitted.

Next, the `connectedCallback` method contains all instructions that will be ran when the element is added to the document. It's unique to the instance and runs individually for each time it's used in your HTML.

The context of the `querySelector` is based on the `this` variable - which indicates the interior content DOM.  So, we get any form (which should be just one) inside of our component and add the submit event handler.

The code should look familiar after that.  If our internal variable is submitting, prevent default - otherwise set submitting to true and continue.

## End Notes

I think this introduces a very simple web component idea as a decorator.  They have so much more functionality, though.  You should definitely check them out in case you don't need something heavier.  I would consider the order of front end javascript to be - in priority order 1) plain vanilla JS 2) web components 3) something simple and inline like AlpineJS 4) React/Vue/Angular.
