---
layout: post
title: How to handle AJAX errors with jQuery
tags:
- ajax
- jquery
---
Many times, the `error` property of the jQuery [AJAX](http://api.jquery.com/category/ajax/) call is ignored.  Most often, you'll see just references to the success portion.

The error attribute of the `$.ajax()` is a callback - and receives three parameters.  These are the `XMLHttpRequest` with the error, a type of error, and an error object, if one is thrown.  For the most part, the first two are the only parts.

Now, the error attribute should be used for actual errors, not logical errors.  For example, if you are making an AJAX call to log in the current user, and the user does not exist, this should return a success type message instead of some sort of error.  Errors are things like 404's for the AJAX call, or other HTTP issues.  In fact, there are 4 types of errors that will be returned: Error - which is an HTTP error, `parseerror` - which is an xml/json parsing issue, timeout - which is a script that didn't respond fast enough, and not modified.

I wrote a generic function to handle the errors.  This could be name spaced I suppose or added to your standard library.  In this case, it just alerts the error.  (On some other sites, I generate a new modal box.)

```javascript
function ajaxError(request, type, errorThrown)
{
  var message = "There was an error with the AJAX request.\n";
  switch (type) {
    case 'timeout':
      message += "The request timed out.";
      break;
    case 'notmodified':
      message += "The request was not modified but was not retrieved from the cache.";
      break;
    case 'parsererror':
      message += "XML/Json format is bad.";
      break;
    default:
      message += "HTTP Error (" + request.status + " " + request.statusText + ").";
    }
  message += "\n";
  alert(message);
}
```

In this function, an error message is generated based on the error type.  The only error that gets extra information is the default type - which is `error`.  It then retrieves the HTTP Status code and the Status Text.

Here is an example of this in use:

**`ajax.php`**
```php
<?php
header('HTTP/1.1 503 Service Unavailable');    
```
    
And, here is the test page.  When the user clicks the xx link, it will generate a request to `ajax.php`.  This will generate a 503 error and the error handler will take over.
    
```html
<html>
  <head>
    <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.4.2/jquery.min.js" type="text/javascript"></script>
  </head>
  <body>
    <a href="#" id="test">xx</a>
    <script type="text/javascript">
      $(function(){
        $("#test").click(function(){
          $.ajax({
            url: "ajax.php",
            success: function(){
              alert('retrieved');
            },
            error: ajaxError
          });

          return false;
        });
      });
    </script>
  </body>
</html>
```
