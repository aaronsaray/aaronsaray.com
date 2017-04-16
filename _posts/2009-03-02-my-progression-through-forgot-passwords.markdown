---
layout: post
title: My Progression through Forgot Passwords
tags:
- PHP
- programming
- security
---
I thought I'd take some time to look at the 3 main ways that I've handled forgotten passwords on my websites, why I did them that way, and if there was anything wrong.

_Disclaimer: there is a lot of bad code in here - and that's on purpose!  This is a historical piece... :)_

### The n00b Times: send the password back to them

The very first 'forgot password' attempt I made was a long time ago on a website about computer security.  This was really quite funny because this was the least secure way to do it.  Users would request their password, and I'd send them their password, in clear text, to their email.  Not very secure!  Side note: this means I had to be able to decrypt their passwords to send it back to them - and newbie me actually skipped that step - just a plain varchar of their password.  OOPS.

#### The non-scalable times: hash the time away

The next step in my programming mutation was at least more secure: send the hash through email and let them reset their password.  This way, I never send their password through the email - and never actually stored it in a decrypt-able (is that a word?) state.  Of course, I did it wrong again:

**Um, don't do this:**

```php?start_inline=1
mysql_query(
  "Insert into resets (userID, key) values($userID, '" . md5(time()) . "'
);
mail(
  $to, 
  'Password reset', 
  "Please click this link to reset your pass: http://website.com/resetpass.php?key="
    . md5(time())
);
```

You DO see all the problems, right?

The biggest one is that if two users were creating a forgot-password request at the same time, they both would get the same ID - and you could end up resetting someone else's password and gaining access to their account.

Of course, the next issue was that it was pretty easy to guess a password reset key for someone if you saw when they did it.

Then, I didn't store the key - so theoretically, the first line could be a different time than the url that was sent to the user - especially if there was a high sql load!

#### Better Hash - not based out of Amsterdam

The next thing I realized was that I had to make this hash a bit more unique, so I ended up adding the userID to the time as a prefix... (should also point out that one time I also went with generating a hash based off of their userID and then sending a timestamp as a separate parameter... its relatively the same thing as this example)

**still not good enough!**

```php?start_inline=1
$time = time();
$key = md5("{$userID}{$time}");
mysql_query("Insert into resets (userID, key) values($userID, '$key');
mail(
  $to, 
  'Password reset', 
  "Please click this link to reset your pass: "
    . "http://website.com/resetpass.php?key=$key"
);
```

At least I fixed the key - um - sorta.  However, if you knew the user id - you could at least make a better educated guess at this hash - especially if you knew the time was.  Point being, it was a step up, but not my final resting place.

**Break: Some of you might wonder why I didn't just use a `uniqid()` and `md5` that... well... yah... but we all make mistakes when we first start out right? ;)  Just trying to help out any new programmers not to make the same mistakes**

#### What are you doing now?

Ok - so for something that's pretty secure like that, I wanted to have a very long, extremely random string.  I thought of sending `mt_rand()`'s next to each other and hexadecimalling them - or md5ing them.  But I settled on something hopefully with even more of a chance not to be guessed: base64 encoding.

What?

Well, let me show you.

```php?start_inline=1
$forEncode = '';
for ($i=0; $i<300; $i++) {
  $forEncode .= chr(rand(1,255));
}
$key = strtr(base64_encode($forEncode), '+/=', '-_.');
```

Granted, I left out the mailing and mysql storage, but you get the idea.  Real quick, a run-down:

First, start out with my blank string.  I plan to generate 300 random characters - so I create that for loop.  Then, I choose a random number between 1 and 255, corresponding to the ASCII table, and generate the `chr()` value of it.  Then that is added to my string.  I now have a string that has 300 characters of any character from 1 to 255 on the ascii chart.  Finally, I base64 encode it - and then replace the items in it that are not good to have in an URL.

How do YOU do it?
