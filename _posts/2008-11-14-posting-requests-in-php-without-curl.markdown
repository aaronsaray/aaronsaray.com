---
layout: post
title: Posting Requests in PHP without CURL
tags:
- PHP
---

Can it be done? YES!  Luckily, functions like file_get_contents() support stream contexts.

In this example, I want to post to my form my login credentials of username "aaron" and password "chicken".  This will be posting to the URL of http://test.com/login.do.php.  I'll show the code first, and then lets talk about what it does.

```php?start_inline=1
$args = array ('username'=>'aaron', 'password'=>'chicken');
$uri = 'http://test.com/login.do.php';

$opts = array('http'=>array('method'=>'POST', 'header'=>'Content-Type: application/x-www-form-urlencoded', 'content'=>http_build_query($args)));

$context = stream_context_create($opts);

$result = file_get_contents($uri, false, $context);

print $result;
```

Lets dissect line by line:

The first line dealing with $args is setting up our post parameters.  The next line is our uri target.  If this was an HTML form, it might look like this:

```html
<form action="http://test.com/login.do.php" method="POST">
Username: <input name="username"></input><br></br>
Password: <input name="password"></input><br></br>
<input type="submit"></input>
</form>
```

The next line is the $opts array.  This will be the options that we send to the stream context.  The array is keyed by the type of stream we're creating here - in this case 'http'.  This points to an array of options.  First, the method of the request, in this case "POST".  Next, the header that must be sent in order to submit the request.  For the most part, your browser handles sending this - but we have to specify it here.  It simply is keying the request to let it know that its a form submission.  The final key is the content key - which is what is submitted in a typical request below the headers.  Here we're using PHP's http_build_query() to save ourselves some time.

Moving on, we create a new context using stream_context_create(), assign that to $context using $opts as our parameter.  Think of $context not as a value, but as a handle - similar to an fopen or other resource handle.

Finally, we retrieve the contents of our request using file_get_contents().  Do note: you must have fopen_url = true in your php.ini.  This allows us to retrieve content via an external URL.  We pass the location of our post request, false because we don't want send any additional flags, and a pointer to our stream context.

After this is complete, we should have the output in the $result variable.
