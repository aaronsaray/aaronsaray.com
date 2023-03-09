---
title: AJAX Security Research and Findings - Round 1
date: 2007-06-28
tag:
- ajax
- security
- php
---
("the triangle") wants to keep implementing more and more AJAX based systems - but no one ever took time to research into the security issues with this.  

<!--more-->

I did a proof of concept one time with a zip-code function when Big Boy was working there, and from there, they just thought it was amazing.  Most recently, some AJAX functionality was proposed for our LIVE public web servers... but I was very hesitant.  I don't know enough about the security and best practices for AJAX requests to be able to securely design and code something for the internet - especially when the end result is connecting to the iSeries and HIPAA data.  I requested a research project - and its finally been approved.  I've spent a few hours and come up with a few ideas and best practices so far.  Ok, I'll be honest, one best practice and 2 ideas - of which I'll prove/disprove here:

**If 1000 users are using an AJAX application, you can increase your load 10-fold.  Its time to cache your AJAX results and requests.**

This was a quote that was in a white paper I was reading.  The writer did have a good point, however.  If you tend to have 1000 users on your website, your server is successful at handling that load.  Load up  a multi-facet AJAX app, and you might be having each one of those visitors making 10 calls per page to retrieve information.  There are two _best practices_ to keep in mind when designing AJAX applications.

First, cache your requests.  Its important to think of the importance of each AJAX request.  Is every request equally important?  Do you need to receive each response within that small amount of time - or will the user allow for a few graces when it comes to load times?  An interesting design pattern comes from the creation of - at max - 2 `XMLHTTPRequest` objects per page.  The first is your general object, which processes the cache from start to end whenever it is invoked.  The other is your 'emergency response' `XMLHTTPRequest` - which should only be made when used.  This one is for specific responses that are needed as fast as possible and cannot be cached behind others.  The 'emergency' response is the pattern of most inexperienced developer's AJAX apps - so we'll skip that one right now.  Let's talk about the general object.

Create a global scope `ajaxCache` array in javascript.  Then, create each request you have as an object and assign it to the `ajaxCache` - push it onto the array.  Each action then calls an intermediate function that checks for a status saying that the general `XMLHTTPRequest` object is processing the cache.  If it IS, the function stops.  If not, it calls the function that starts processing the cache.  This function flips the flag to processing, processes each object in the array, and then flips the array off.  This way, each request is done one after another - and depending on your webserver configuration, this might even have lower overhead because of the speed of the requests (think keep alives?).  Only when necessary, call the emergency `XMLHTTPRequest` object.

**Can we restrict the AJAX request processing script to be called only after we load a specific page?**

I thought about this - can we reject all requests to a specific AJAX processing file, such as `ajaxresponse.php` until we've visited `http://ourdomain.com/ajax.php` - well let's see.  The first thought was an HTTP referrer - but we know this can be easily spoofed.  Whats the next most accurate and persistent tool at our disposal for PHP?  Sessions.  So, the final result would be to check if a session variable was set - any would do.  -- if set, do our processing -- if not, just exit.  I did not want to start the session myself - because if the script could start the session, it surely could be called remotely.  (As usual, after writing down my findings, I'm finding out this proof of concept is pretty far out there - and wrong - and not really worth anything - but let's move on).  Anyway, I knew I had to send the cookie with the PHP session ID in the request, because the `XMLHTTPRequest` object doesn't send it by default.  (edit: true, but it would be available in the `$_COOKIE` array to the ajax processing script anyway, oops!)  I also know that `session_id()` generates a blank string if no session is started, otherwise it prints the current session id.

Anyway, here is my code for this proof of concept:

{{< filename-header "ajaxresponse.php" >}}
```php
var_dump($_COOKIE);
echo session_id();
```

{{< filename-header "ajax.php" >}}
```php
/**
 * start the session right away
 */
session_start();

/**
 * print out the rest of the page
 */
?>
<script type="text/javascript">
  function testAjax()
  {
    xmlHttp=new XMLHttpRequest();
    xmlHttp.onreadystatechange=function() {
      if(xmlHttp.readyState==4) {
        alert(xmlHttp.responseText);
      }
    }
    xmlHttp.open("GET","ajaxresponse.php",true);
    xmlHttp.setRequestHeader("Cookie", "PHPSESSID=<?php print session_id(); ?>");
    xmlHttp.send(null);
  }
</script>
<button onclick="testAjax()">Test Ajax</button>
```

Loading this page shows an button to launch our ajax testing function as well as our current session id.  When clicked, we see the server response - our `var_dump` of our cookies and then the session ID.  When I run this script, I notice that, even though I've sent my session cookie properly, the session ID doesn't exist (I guess I kind of knew this because I didn't force PHP to start the session).

_Well, can I make this useful?_

Well, I modified our code.  The `ajax.php` file just removed the cookie sending header.  I changed my `ajaxresponse.php` file to this:

```php
session_start();
if (isset($_SESSION['ajax'])) print 'ajax';
```

If our session value of `ajax` is set, we'll print `ajax` (or process our request).  Otherwise, we'll do nothing.  Running it the first time, I get a blank alert.  Yay!

I then modified `ajax.php` to begin like this...

```php
/**
 * start the session right away
 */
session_start();

$_SESSION['ajax'] = true;

/**
 * print out the rest of the page
 */
```

I reloaded the `ajax.php` page, clicked the button and yep - it sure alerted `ajax`.

This is important because I now know that I can control an ajax request's behavior based on what I know is in the session.  While this doesn't restrict remote access to this script (the attacker could load a session correctly once on your site, then take the session cookie and run an automated attack against it), it does add another level of difficulty to it.  To additionally further strengthen your defense, you could implement a counter in the session.  Once the counter - incremented every ajax request - reached a level that was normally out of the norm for normal site application, you could stop processing requests for this script for the rest of the session.  This would force the user to visit the site again fresh - without session cookie - to obtain a new session instance.  Once again, not fully mitigating the risk, but making it more difficult for the casual attacker to succeed.  (_Bonus - this means that the session data is available to ajax requests, reducing the amount of private information you'd need to transfer to a script to retrieve customized data!_)

**How about - let's secure our AJAX like we secure our forms!**

To protect against CSRF, I've been implementing a token system.  You store a set of tokens in the session, and then put them into a set of hidden form fields in the form.  When the form is submitted, the first thing to check is to make sure the hidden form fields' tokens match the ones in the session.  Well, why can't we do this with AJAX?

The first thing I started thinking about - because I jumped ahead of myself - is on every new request, how am I going to get a new token?  I knew the AJAX script would have to send it back - but if the script sends it BACK, how is it secure?  Then, I started thinking about the initial token: I KNOW I can make that secure.  I can create it in the session and pass it with the request - why would I need to ever generate a new token?  If the first one works, I know I'm on the page.

Well, this is like the last topic.  I could visit the site, generate a session, grab the hidden form values, and then leave and send my hidden form field each time with my session cookie.  This only secures the fact that they've visited the site once.  So, what if I did regenerate the token each time?  It would be easy to capture on response, it would just make the attacker's job harder: instead, they'd have to visit the site to get the session once, then send the cookie and hidden values, grab the response values, and send them for the next response.   Harder, but still not impossible.

**Is there any solution?**

So far, we haven't solved any of the security issues yet - we've just talked about how to reduce the chances that your scripts will be taken advantage of accidentally or maliciously.  I'm doing more research coming up tomorrow and the next day, and we'll see what we come up with.

(_Random thoughts:  AJAX security sometimes is a convoluted - what is the real security? Is it restricting the access to the scripts outside of your app, is it restricting the amount of times they've been called, or is it the data they send and receive?   So far, I've been talking about the first two - let's not forget about the third thing, however.  Stay tuned!_)
