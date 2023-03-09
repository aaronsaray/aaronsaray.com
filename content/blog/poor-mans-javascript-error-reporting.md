---
title: Poor Man's Javascript Error Reporter
date: 2021-08-13
tag:
- javascript
---
If you want to track errors in your production Javascript (which you should), you should use a fully-baked service like [BugSnag](https://www.bugsnag.com/).  If you can't, there's at least one other thing you could try: a poor man's javascript error reporter.

<!--more-->

## Use BugSnag

Use Bugsnag or something like it if you can. There are many other Javascript and entire-app error monitoring, reporting and alerting systems. Please use these.

## An Alternative

If you're looking for a [poor man's](https://www.merriam-webster.com/dictionary/poor%20man%27s) javascript error reporting, you can make use of the [`onerror`](https://developer.mozilla.org/en-US/docs/Web/API/GlobalEventHandlers/onerror) handler like a blunt hammer.

**I DO NOT RECOMMEND DOING THIS** but I've had to do it at a point or two in my career.

Here's the Javascript code you should put at the very top of your document:

```javascript
function errorReporter(message, source, line_number, column_number, error_object) {
  const params = new URLSearchParams({
    message,
    source,
    line_number,
    column_number,
    user_agent: navigator.userAgent
});

  const i = new Image();
  i.src = '/error-reporting?' + params.toString();
}

window.onerror = errorReporter;
```

When you directly assign the `onerror` handler to a function, you're basically wiping out any other error handling functionality. In addition, you're not following best practices like using event listeners instead of defining handlers. It's better to add an event listener in most Javascript cases. However, in this particular one we want to override the entire handler.

The `message` is a programmer-readable version of the error message.  The `source` indicates what file the error is in.  The `line_number` and `column_number` indicate where the last functioning instruction exists that caused this error.  Remember, if you're compiling your Javascript with any build tools, this information won't be as useful.  The `error_object` is the Javascript `Error` object that was thrown.

Then, we take those values and build an `URLSearchParams` object (you'll have to do this the [hard way](https://stackoverflow.com/questions/111529/how-to-create-query-parameters-in-javascript) if you're supporting Internet Explorer, though) to create parameters for a query.  Then, make a new Image object.  Finally, assign the `src` attribute to the end point of yours that can accept a `GET` request with error details.  Javascript will automatically start to load the source for the `Image` if you assign the `src` attribute.  You don't need to place the image anywhere for this to happen.  Now, your end point will receive something like this:

```
http://my-app.test/error-reporting?message=Uncaught+ReferenceError%3A+params+is+not+defined&source=http%3A%2F%2Fmy-app.test%2Ftest.html&line_number=33&column_number=25&user_agent=Mozilla%2F5.0+%28Macintosh%3B+Intel+Mac+OS+X+10_15_7%29+AppleWebKit...
```

Now, you can parse this in your backend and report on the errors yourself.

If, for some reason, you want to stop the error from appearing in the console, you could end your error handler with `return true`.

Finally **DO NOT DO THIS** AND INSTEAD **USE BUGSNAG** or a tool like it.