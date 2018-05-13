---
layout: post
title: Cross Domain AJAX - A quick anatomy of a mashup
tags:
- ajax
- apache
- javascript
- security
---
So after searching the Internet for some cross domain AJAX stuff, I noticed two interesting articles.  The first was the specifics of writing these queries (located [here](http://fettig.net/weblog/2005/11/30/xmlhttprequest-subdomain-update/)).  Then, the next gave a breakdown of how this might be useful in a mash-up collaborative sense ([here](http://www.alexpooley.com/2007/08/07/how-to-cross-domain-javascript/)).

The one missing point was how the collaboration should occur.  There is talk about same parent domain but I think everyone's forgetting about the DNS/webserver changes that need to happen.

In order to prove my concept on my windows box, I set up the examples.  In that previous example, domain D had a subdomain of D_s which pointed to E.

I determined what the IP address of E was and entered that into my hosts file (I don't have access to a DNS server at the moment) followed by the subdomain D_s.

Next, using apache, I found the virtual host for E, and put in 'ServerAlias D_s'.  This will make sure that the incoming connection to that IP will also respond to that sub domain.

I just wanted to jot this down to help fill in the hole I noticed. :)
