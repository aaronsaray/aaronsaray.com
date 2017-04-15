---
layout: post
title: Removing WWW - just not for SEO
tags:
- apache
---

I used to think that I had to remove the WWW from my URL's to stop having duplicate content.  For example, if my website The Better Bachelor were to respond at both [www.thebetterbachelor.com](http://www.thebetterbachelor.com) and [thebetterbachelor.com](http://thebetterbachelor.com), it used to be thought that this duplicate content would lower your search result quality.  This would result in duplicate content.

Wrong.

(Remember, there used to be an issue with this with the trailing slash too - ie http://thebetterbachelor.com/10dish and http://thebetterbachelor.com/10dish/ would be duplicates)

It seems now - especially with the changes in the Google Webmaster Panel (where you can choose the WWW or the non-www to be the primary index), and by articles such as [this one](http://www.practicalecommerce.com/articles/444-SEO-The-Duplicate-Content-Penalty), the www's no longer need apply.

However, I'm still lazy.  I hate saying "double you double you double you dot the better bachelor dot com" Get rid of that other stuff...

So here's the real meat of the article, however.  I used to do this in my .htaccess file for each domain:

**the old way**

    RewriteCond %{HTTP_HOST} ^www.thebetterbachelor.com$ [NC]
    RewriteRule ^(.*)$ http://thebetterbachelor.com/$1 [R=301,L]

This would make sure that the domain redirected with a 301 and was not processed anywhere else.  However, after doing some more research, and running into the non www website at [no-www.org](no-www.org/faq.php?q=class_b), there is a better solution.  Let's do it this way from now on:
    
    RewriteCond %{HTTP_HOST} ^www\.(.+)$ [NC]
    RewriteRule ^(.*)$ http://%1/$1 [R=301,L]
    