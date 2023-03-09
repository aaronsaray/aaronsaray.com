---
title: Send e-mail from outlook using PHP
date: 2007-07-06
tag:
- php
- windows
---
While working on some code at ("the triangle"), I run into some issues with the `mail()` function.  On our linux qa and production servers, we can use the `mail()` function no problem - but on my development platform, windowsxp, I cannot with our current configuration.  

<!--more-->

Normally, you can put in the smtp server in the `php.ini` file, but our setup doesn't allow this.  We have an exchange server who's relaying settings restrict it to a few IPs within our organization.  Our development boxes are on the same subnet as everyone else's, therefore using the same DHCP pool.  Because of security issues, networking doesn't want to open up the relay to that subnet block, which is smart.  However, they didn't want to give me a static IP on a different subnet or they didn't want to do my suggestion of reserving a pool for our dev boxes (why not? grrrr...).  At any rate, we do use outlook with our exchange - so why not use PHP to send it out through outlook?  Let's see how:

First off, every single example I found seemed to be in visual basic scripting.  I finally found a few examples in PHP - but they were really confusing.  So I put together my own script that I plan to implement into our local dev version of our mailing class.

The one thing to note is that Outlook interface is restricted via built in security controls (at least on Outlook 2003, the version I am testing on) (I didn't actually look into these settings though...).  Because of this, when you first access Outlook, you get a popup asking for permission to access Outlook.  You can choose how long you want to allow access to Outlook.  Then, when you go and send it, you get prompted again.  (I don't actually need to send the messages in my test environment, but I'd like to see what they look like.  I am most likely going to comment out the `send()` call).

Here is what the code looks like:

```php    
if (!defined('olMailItem')) define("olMailItem",0);

$objApp = new COM("Outlook.Application");

$myItem = $objApp->CreateItem(olMailItem);

$myItem->To='recip@ient.com';

$myItem->SentOnBehalfOfName = 'from@address.com';

$myItem->Subject="This is a test";

$myItem->Body="This is a Body Section now.....!";

$myItem->attachments->Add("filename.txt");

$myItem->Display();

$myItem->Send();
```

First off, we define a constant that is used to point to a new mail message (new contacts, new tasks, etc, all have their own number).

Next, we make a new instance of our COM element using outlook - and then create a message item.

We can define the To address next.  You can use comma separated values here.  This is the same way you'd add cc and bcc.  Finally, it seems that the from item is restricted or doesn't exist.  So, you have to set the behalf of name (which is the proper way to do it anyways, according to the RFC).

Subject and body are also set with a very similar way to the 'to, cc and bcc' ways.

Additionally, you can add an attachment by putting the full path in the attachment -> Add method.

Next, we can display the message by using the `Display()` method.  Its cool to note that we don't need to display it on the screen - but it fits my purpose perfectly.

The final call is the `Send()` command - which sends the message.  I will most likely comment this out - so therefore I can just close the message after testing.

You can get more information about these calls from the MSDN website.
