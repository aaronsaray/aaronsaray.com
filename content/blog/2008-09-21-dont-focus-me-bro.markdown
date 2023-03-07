---
title: Don't focus me, bro!
date: 2008-09-21
tag:
- javascript
- misc-web
---
I hate filling out login forms to discover that half of my password is in the username box.  Lets talk about why - and then a solution.

<!--more-->

### Why?

#### Slow Loading Pages

Slow loading pages, or sites with a lot of content on the login page (see: a no-no for login pages), take a while to finish loading the content.  The `onload` handler is usually the whole on-load and not just the domloaded event.  Tons of extra content delay the onload handler.

#### Dialup

Yes, people still have this.  Even with the smallest amount of extra content, dialup users will experience some delay.

#### So what is happening?

People who jump the gun - like me (and 93% of everyone else) are clicking in the username box, filling it in, and then tabbing to the password box.  While typing in the password, the page finally finishes loading, and focuses the username.  We don't notice, so we keep typing.

### What is the solution

#### Quickly: activeElement

Firefox 3, and IE4+ support `activeElement`.  (there are other ways around this for other browsers - see the end of this article).  Check to see if the body is the active element - before focusing the username.  If it is, means that they haven't started typing anywhere.

#### Give me an example?

Ok!  You should use a better `onload` handler - but I'm being lazy just for this example.

```javascript
function loginFormInit()
{
  if (document.activeElement == document.body) {
    document.getElementById('username').focus();
  }
}
```

```javascript
<body onload="loginFormInit()">
  <h1>Login</h1>
  <form>
    username: <input type="text" id="username" name="username"></input><br></br>
    password: <input type="password" id="password" name="password"></input><br></br>
    <input type="submit"></input>
  </form>
</body>
```

#### Oh Noes! I need to support more than IE4 and FF3

No worries, citizen!  If you need to support something else, besides those two lovely browsers, you could write a function to `getElementsByTagName('input')` and add an `onfocus` element.  That element could set a global variable to `true`.  Finally, your `onload` function could check to make sure that that variable is not true - and then do the focus.
