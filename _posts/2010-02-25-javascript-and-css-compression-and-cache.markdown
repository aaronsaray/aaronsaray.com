---
layout: post
title: Javascript and CSS Compression and Cache
tags:
- CSS
- javascript
- Misc Web Design
---
I've been researching caching and compression techniques for my external resources for some time.  My first design of [JEMDiary](http://jemdiary.com) was very greedy with HTTP connections.  Couple that with having a less-than-perfect host (Dreamhost bleh...), users could feel the burn.  I didn't like it because it would even take ME forever to use my own website.  I went on to discover many different key points I use when creating sites now - the Steps to Optimize Assets.

### Steps to Optimize Assets

There are a few steps I live by when I design my websites now.

  * **Use a subdomain for images, js and css.**  While I don't go overkill with this (see: not 5 page brochure website), I do try to separate assets over multiple subdomains.  The important thing is not to have too many - but none what so ever limit your user from loading your site as quick as possible.  I generally use one for my assets and one for user submitted assets.

  * **Use sprites.** Whenever possible, reduce the amount of HTTP requests by combining images.  It is faster to load an image that is 3x the size of the one you're displaying than to open 2 more HTTP connections after you download the first image.

  * **Cache non changing elements as long as possible.**  One of the biggest things I noticed on my dreamhost server was the misconfiguration of e-tags.  After disabling them, I went and looked further into caching techniques.  I found that most of my assets didn't change - so I cached them up to a year.

  * **Compress away white space.**  After you edit the source of your css, it doesn't need to be pretty.  In fact, things like comments and white space in css and javascript are just wasted bytes... bytes you could remove... but bytes you shouldn't remove from your source.  I deal with this by making a compressed copy on build.

These are my main rules.  This article, however, is going to focus on how I deal with Javascript and CSS.

**Disclaimer:** The methods I'm going to describe here can be labor intensive.  When you build your own system, you should strive to make some of these automated.

### Preparing CSS for deployment

The first thing I do is create that subdomain.  For my site `example.com`, users can visit `http://example.com` for the content.  I create a subdomain called `assets.example.com` which is where I expect to get my content from.  I generally create a server alias in the main config.  This technically means that duplicate content could be served at both `assets.example.com` and `example.com`.  I finish up by adding the following lines to the **`.htaccess`** file:
    
```apache
#make sure assets load properly
RewriteCond %{HTTP_HOST} ^assets.example.com
RewriteCond %{REQUEST_URI} !^/css
RewriteCond %{REQUEST_URI} !^/js
RewriteCond %{REQUEST_URI} !^/images
RewriteRule ^(.*)$ http://example.com/$1 [R=301,L]
```

This make sure that if the host is `assets.example.com` and the content is not coming form the `css`, `js` or `images` folder, to redirect with a 301 to the main domain.  This will stop duplicate content.

Enough about this, what about my CSS?

I actually hold my css in a different folder in my architecture - not some place that is world readable.  I usually call it the `public_source` folder - which is at the same level in the source tree as say the `www` or `html` folder.  In this example, I'm going to call my example file **`main.css`**.  So it is actually located at **`/var/www/public_source/main.css`**.

Next, I'll create a file called dev.php in the assets folder where I plan to test my css from.  So, this file is located at **`/var/www/html/css/dev.php`**.  It may contain this content:

    header ('Content-type: text/css');
    readfile('/var/www/public_source/main.css');

So, now when I load my website, I can do the following to load my source css:

```html
<link href="http://assets.example.com/css/dev.php" type="text/css" rel="stylesheet"></link>
```

Of course, when the website is built and deployed, we will be using a different URL.

Next, lets talk about compression of the CSS.  I use [CSS Tidy](http://csstidy.sourceforge.net/) to compress my code.  The code to invoke this is pretty simple.

```php?start_inline=1
require 'csstidy-1.3/class.csstidy.php';
$cssSource = file_get_contents('/var/www/public_source/main.css');

$css = new csstidy();
$css->load_template('highest_compression');
$css->set_cfg('remove_last_;',TRUE);
$css->set_cfg('sort_properties', TRUE);
$css->parse($cssSource);
$cssFinished = $css->print->plain();

file_put_contents('/var/www/html/css/main.1.css', $cssFinished);
```

You'll notice that I named the file **`main.1.css`**.  The number will be explained later (its used for caching).

So, the CSS is read, compressed and cleaned, and outputted to a location that the webserver can serve it from.  Now, instead of using dev.php as the source, we'll use **`main.1.css`**.  Congratulations - a smaller CSS file!

The final thing to do is adjust the caching of this script.  Whenever we change the CSS on the development platform, we're reading it in new using **`dev.php`**.  However, when this is built and deployed, it should be a built version (or compressed) of the file.  This means every code deploy requires this build system.  And with release numbers on main software, we're also going to increment our file name.  So our second deployment of the software package (if the CSS source has changed) will now be built using **`main.2.css`** - and the link statement will be pointed towards that.

The caching then can make the assumption that this file will never change.  The CSS may change but the file is a new name then.  And since we can't just load portions of a file whenever there is a change, even a small change in a non-cached file will make the entire file load.  So with this in mind, I cache my CSS files for one year.  I put the following in my config:
    
```apache
ExpiresActive On
#1 yr
ExpiresByType text/css A31536000
```

This means that the file will be cached one year from the first time it is accessed.
