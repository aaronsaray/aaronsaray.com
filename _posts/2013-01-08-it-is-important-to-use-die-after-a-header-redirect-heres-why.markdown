---
layout: post
title: It is important to use die() after a header redirect - here's why
tags:
- PHP
- security
---

I was doing some code challenge review for an open web developer position I have for my team, and I came across one piece of code that made me smile.

```php?start_inline=1
if (!$auth) {
  header('Location: /login.php');
}
```


Of course, there was much more, but this is the part that made me smile.  Here's why.

**Always, always use a die() statement after a header redirect.**

Remember, just because the browser is smart enough not to show the content, doesn't mean that this isn't dangerous.  So, it's a little less dangerous say if this page is just showing a user search option or some information.  It is much more dangerous if this is a page that executes an action.  This is because the entire PHP page will execute if you don't put a die() statement.

For display pages, this just means that it will create output to the output buffer, ready to be sent to the browser.  The browser will see the redirect header and not display any of the information.

However, on action pages, such as a record delete, the page will process the entire request, including the record delete, then reach the browser.  The browser will then redirect to the login page.

**Now here's the real fun part.**

I thought to myself: what if my browser started ignoring the redirect headers.  Would I be able to see the content of the page?  **Theoretically, yes.**  So I wrote the following code for a Google Chrome extension:


```javascript
chrome.webRequest.onHeadersReceived.addListener(
    function(details) {
        for (var i = 0, j = details.responseHeaders.length; i < j; i++) {
            if (details.responseHeaders[i].name.toLowerCase() == 'location') {
                details.responseHeaders.[i].splice(i,1);
            }
        }
        return {
            responseHeaders: details.responseHeaders
        };
    },
    {
        urls: ["<all_urls>"]
    },
    ['responseHeaders', 'blocking']
);
```




Unfortunately, what I found out is that there is an open bug to actually allow this functionality to work.  It currently doesn't allow you to edit the responseHeaders yet.  (I even disabled all other extensions, just in case, as Google documentation suggests that only one extension can modify responseHeaders.)  

Further research says that the API of declarativeWebRequest should allow for this - but this is currently in dev/beta release channels only, so I didn't pursue.  But the important part is to note that its probably rather easily attainable from the browser.

So I thought about this a bit more and said - well, the browser isn't the only way to consume webpages.  I have things like wget and stream contexts in PHP.  So I went over to PHP.net and grabbed a bit of sample code.  

First, my "secure" page:

```php?start_inline=1
header('Location: /login.php');
echo 'Secure Stuff Here';
```
    



And now, my consumer:

```php?start_inline=1
$url = "http://localhost/redirectTest.php";
$opts = array('http' =>
    array(
        'method' => 'GET',
        'max_redirects' => '0',
        'ignore_errors' => '1'
    )
);

$context = stream_context_create($opts);
$stream = fopen($url, 'r', false, $context);
var_dump(stream_get_contents($stream));
```
    



Sure enough, the output of my var_dump() was "Secure Stuff Here" as a string.

So as you can see, its very easy to consume this data potentially in the browser - or at least via PHP.  Of course, the lesson is:

**Always use die() after a header() of "Location".**
