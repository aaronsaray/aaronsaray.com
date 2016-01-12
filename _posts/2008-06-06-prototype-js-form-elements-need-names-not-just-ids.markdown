---
author: aaron
comments: true
date: 2008-06-06 22:35:44+00:00
layout: post
slug: prototype-js-form-elements-need-names-not-just-ids
title: Prototype JS - form elements need names, not just IDs
wordpress_id: 137
categories:
- javascript
tags:
- javascript
---

So, I got stuck on this bug for an hour - so I thought I'd write it down.

I was using prototype js's serialize command on a form.  I was also using a strict xhtml doctype.  My form elements had IDs only - and did not have names.  Well, serialize kept coming back empty.  Turns out that prototype requires there to be names on each of the elements.

**UPDATE:** Der - according to W3C, the 'name' attribute of the 'form' tag is deprecated, not the name attribute of the form elements...
*hits head with hand*
