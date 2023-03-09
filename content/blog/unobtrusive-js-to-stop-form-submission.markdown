---
title: Unobtrusive JS to stop form submission
date: 2007-07-05
tag:
- javascript
---
On one of the sites at ("the triangle"), one of the programmers on my team had this strange attachment to the Yahoo User Interface libraries - but I guess that was a good thing as it taught him a good lesson - use unobtrusive javascript.  

<!--more-->

Recently, I had to go through and clean up some of the code (and do a security audit), and I discovered his usage of the YUI library functions.  I was particularly impressed with his usage of the onclick handler for some radio buttons we had and how he was able to send an array of their IDs to the function.  Pretty sweet stuff.  However, there was one area where he wasn't following the unobtrusive paradigm.  I took a quick glance at it - and fell for the same shortcoming.  We were using a return function on our form submissions.

Such good progress on separation of logic and markup, until now.  Well, I wasn't going to let this one sit.  While I can't make the changes to this code now (the site is in QA/integration), I can detail out how I would fix it... here's how:

To handle our form validation, we've previously been doing something like this:

```html
<script type="text/javascript">
function validate(formObject)
{
  /** logic - and our form failed**/
  return false;
}
</script>
    
<form action="login.php" onsubmit="return validate(this)" id="login" method="post">
```

We were doing pretty good with this example, except for that last onsubmit.  I want to take that action out of the markup.  After surfing around on google for a while and checking you the YUI library more, I found the `stopEvent()` method in the event class.  This will be particularly useful because we're already using the YUI on this project.  This is how I put this into play:

```javascript
function validate(e)
{
  /** logic that fails **/
  YAHOO.util.Event.stopEvent(e);
}
YAHOO.util.Event.addListener('someform','submit',validate);
```

Yay - success!  We were able to stop the event with this built in call from YUI.  Any future programming on that site will use that logic.

(ps: sad note - I have the same issues on my own sites, so it's not one specifically related to my work at ("the triangle").)
