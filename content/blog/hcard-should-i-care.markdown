---
title: hCard - Should I Care?
date: 2010-01-23
tag:
- misc-web
---
So lately, I've been looking into the semantic tools available on the web.  I want to make sure that my online identity is easily searchable and undeniably accurate.  Using semantic tools such as XFN, FOAF and hCard may help me.

<!--more-->

I can't help but seeing some of these and thinking 'flash in the pan' though.  What I really want to see is a big - or a giant - company come through and make use of these.  For example, LiveJournal is exporting FOAF information - but who cares?  Where can I actually find value out of that information that was previously consumed?  If I search 'Aaron Saray' on Google, will my friends show up along the sidebar?

At any rate, I did implement a very basic FOAF RDF file on my home page.  I am reluctant to do anything further, however.  Like I said, I'm not seeing much value as of yet.  However, I did want to look at another alternative, hCard.

## What is hCard

[hCard](http://microformats.org/wiki/hcard) is just an expansion on the vCard standard.  The website says it has a 1:1 representation of the vCard properties.  Plus, it goes further by allowing itself to be embedded into web properties.  So basically, its a vCard that I show on my website, right?  Isn't this already what my contact page does?  (Yes - but the argument is this is a standardized form so that it can be machine readable - I get it I get it).

## Who is using hCard

More and more libraries are using hCard.  The number one thing that caught my eye was the possible implementation by drupal (see [http://groups.drupal.org/node/1898](http://groups.drupal.org/node/1898).  Yet, I'm seeing many people put out the information to be consumed, but I'm not seeing many groups actually doing the consuming.

## How can I use it?

Well besides looking at the specs, you can use the following two libraries in PHP:

[phpMicroformats](http://enarion.net/phpmicroformats/)

[Microformats Parser](http://www.phpclasses.org/browse/package/3597.html)

## So what did you do?

Ok so after all this complaining, I have to admit - I'm still guilty... I implemented it on my contact page :)
