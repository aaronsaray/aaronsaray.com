---
layout: post
title: PHP.ini creator
tags:
- open source
- PHP
---
While listening to someone complain through twitter about their MySQL conf file, I came up with a cool idea: what if I created a PHP.ini creator that would suggest changes to your php.ini file as well as generate an updated version?

### Enter PHPIniCreator

As with most of my software, this is just a rough version to get the idea down on paper.  I plan to update this as well as give a working example sometime in the future.

**Features**

  * Parses a pasted php.ini file and generates a comparison table

  * Allows you to change values on specific elements

  * Generates a php.ini file to replace your existing one

As always, my todo list is great on this project:

  * Add the entire php.ini database.  Right now, there are only like 5 verified entries.

  * Test for the input type of free form fields - don't allow strings if they're integer types, etc,

  * Add client side JS to make the choosing of fields easier as well as accepting defaults

  * Support different versions of PHP and their defaults

  * Allow you to change values of php ini content that doesn't exist in your version (currently, if you don't have an entry for it, I force you to take mine)

  * Documentation!

Yeh - its like that...

So without further ramblings, here is the file:
[phpinicreator.zip](/blog/wp-content/uploads/2009/01/phpinicreator.zip)
