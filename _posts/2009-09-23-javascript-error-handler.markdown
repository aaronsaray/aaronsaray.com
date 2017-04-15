---
layout: post
title: Javascript error handler
tags:
- javascript
- PHP
---
A while ago, I saw a website that provided a javascript error reporting service.  You implemented some code and then they would send you reports on javascript errors on your site.  I thought, this can't be that hard.  So I went to work to create my own.  (It's now used on this website as well as some political website I've worked on recently.)

### Javascript's Error Handler

Javascript has an error handler called onerror.  It belongs to the window element.  This function accepts three parameters:

  * Error Message: This is the error message that the browser would normally show to the user

  * URL: This is the URL of the page with the offending javascript OR the URL of the Javascript file itself (if it is external)

  * Line Number: This is the line number of the previous file mentioned in URL that the browser believes is in error.

### Sending a Request Like AJAX - um. Before AJAX

Before the XMLHTTPRequest object became mainstream and understood, I was still creating asynchronous calls using iframes.  Another option I toyed with was the Javascript Image object.  When creating an Image object, the src attribute can be specified as a complete URI.  With this in mind, I choose to use the Image object request style over the XMLHTTPRequest object - just for simplicity. (Remember, I've already had one error - so I might as well do everything as simple as possible from now on...)

### The Javascript Code

The first code snippet in my head is this javascript.  (I keep it inline...)

```javascript
window.onerror = function (message, url, line) {
    var i = new Image();
    i.src = '/jserror.php?url=' + escape(url) + '&message;=' + escape(message) + '&line;=' + line;
}
```

I simply assign my function to the onerror method of the window object.  It creates a new image and then sets the source to a php file.  The parameters are added on to the end of the call.  This way my PHP file now has access to all of the error information that this javascript function had.  When the src attribute is defined, the request goes out to the server right away.

One interesting thing to note is the onerror() method's ability to suppress errors.  This is done by returning 'true' from the anonymous function.  I tend to not like this idea for two reasons:

  * 1) I may make a mistake and not log the error properly, so I don't want to suppress any reference to it.

  * 2) Sometimes when troubleshooting an error with a user, it is important for them to be able to relay the errors to you.

### Tell me about the PHP

The php file is pretty simple:

**`jserror.php`**
```php?start_inline=1    
$message = "Javascript Error: {$_GET['message']} ||";
$message .= " URL: {$_GET['URL']} ({$_SERVER['HTTP_REFERER']}) || ";
$message .= " Line: {$_GET['line']} ||";
$message .= " User Agent: {$_SERVER['HTTP_USER_AGENT']}";

error_log($message);
```

In addition to the three parameters that the Javascript Image request sent, I am also tracking the HTTP_REFERER and the HTTP_USER_AGENT.  The referrer is useful because sometimes the URL is actually the javascript file itself.  Then, I can tell what page was loading that javascript file that caused an error.  The user agent was also useful to determine which browsers my javascript is erroring in.

Finally, I send this to the error log defined by PHP.  This way, when reviewing my logs, I can now see my javascript errors along with my PHP errors.
