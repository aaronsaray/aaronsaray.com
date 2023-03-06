---
title: How I test email recipients when I develop
date: 2010-08-31
tags:
- misc-web
- php
---
When developing an application, there are usually various different environments that you run the code in.  First is the development environment.  Next, you have the QA or test environment, staging, and then live or production.  It stands to reason that if you are using outgoing e-mail in your application, and your application is in production, it should send to the proper recipients.  However, what do you do in testing and development?

<!--more-->

### The Old Way: One Email to Rule Them All

The old way of testing was simple:  If live, send to proper email address.  If not live, send to my developer test address.  So, if I ran a process, I might see something like 8 emails in my developer test box.  The problem with this, however, is the only inkling I have that each e-mail is different is by any custom information inside of the email.  Hopefully it says "Dear John Smith, " or "Dear Suzie Q".  You also have no way of verifying if the e-mail address you retrieved for this particular message was in fact the right one - mainly because you overwrote it with a test one.

### The New Way: Combining Test and Production Emails

Real quick, take a look at this [RFC](http://tools.ietf.org/html/rfc2822)... Just kidding.  But, after understanding the various formats of an e-mail address, I got a great idea.  I should be able to use the + sign with the original email address and my developer test address.  I may just need to replace the @ sign with _AT_.  Why?  Whenever you create an e-mail address, you can add the + sign after your user part of the email address to add additional tag information to it.  So, if my e-mail address was `thedude@guy.com`, I will also receive e-mail if it is addressed to `thedude+spammysite@guy.com`.

So, for my code, if not in production, I'm going to replace the outgoing e-mail address with a specially formatted version of the email that contains the destination address but gets directed to my test email.  So, in this case, my testing email address is `test@aaronsaray.com`.  The outgoing address is `newuserguy@hotmail.com`.  The resulting outgoing email address will be `test+newuserguy_AT_hotmail.com@aaronsaray.com`.  It will enter my test e-mail box but I can still verify that the recipient would have been right.

Here is a bit of code I use to accomplish this:

```php
$to = 'outgoing@email.com';
if (ENVIRONMENT != 'LIVE') {
  $parts = explode('@', 'test@aaronsaray.com');
  $to = str_replace('@', '_AT_', $to);
  $to = $parts[0] . '+' . $to . '@' . $parts[1];
}
```
