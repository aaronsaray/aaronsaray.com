---
title: 'Update your URL filtering: possible XSS from "Data" URL scheme - Firefox'
date: 2008-03-18
tag:
- html
- javascript
- security
---
In regards to the Data in URL scheme ([RFC here](http://www.ietf.org/rfc/rfc2397.txt)), I've found an interesting issue with the way firefox handles it which could lead to some XSS I think.

<!--more-->

First of all, if you're not aware of the feature, let me explain.  Browsers are built to decode information in the URL (for the purpose of this blog, I'm JUST focusing on base64) with a specific URL handler: `data:text/html;base64,`

With this, you can add specific payloads to the URLs (think a very very small `.com` or `.exe` file) or specify the actual image data for an image tag (think single PHP scripts with no image directory - neeto!)

Well, because Firefox supports this action, you can now create javascript payloads in the URL too.  Please check your HTML/URL filtering routines to make sure you filter against this malicious link type.

Let's see an example:

First off, this is just an example - so it's pretty simple.  But I could make a request to a remote server through an image.src or an ajax call.  Here, I'm just alerting the cookie to the screen (note, if this wasn't an alert, the average user would not notice.)

```html
<script>
  alert("cookie steal: "+document.cookie);
  window.location.href='http://www.google.com';
</script>
```

Which, when base64 encoded is
   
```txt 
PHNjcmlwdD5hbGVydCgiY29va2llIHN0ZWFsOiAiK2RvY3VtZW50LmNvb2tpZSk7d2luZG93LmxvY2F0aW9uLmhyZWY9J2h0dHA6Ly93d3cuZ29vZ2xlLmNvbSc7PC9zY3JpcHQ+
```

Put it all together:

```html
<a href="data:text/html;base64,PHNjcmlwdD5hbGVydCgiY29va2llIHN0ZWFsOiAiK2RvY3VtZW50LmNvb2tpZSk7d2luZG93LmxvY2F0aW9uLmhyZWY9J2h0dHA6Ly93d3cuZ29vZ2xlLmNvbSc7PC9zY3JpcHQ+">Google.com</a>
```

Now, I've tested this example in Firefox 2 which supports this scheme - and it alerts the cookie.  With IE 7, no such luck.

*Disclaimer* It should be noted, I think this is NOT an issue with Firefox's handling of the specification.  See #6:
    
> 6. Security
>
> Interpretation of the data within a "data" URL has the same security
> considerations as any implementation of the given media type.  An
> application should not interpret the contents of a data URL which is
> marked with a media type that has been disallowed for processing by
> the application's configuration.
