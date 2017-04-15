---
layout: post
title: How to Quickly Mask a Credit Card Number
tags:
- PHP
- programming
---
So, often I have to show a masked credit card on the screen.  However, I really want to go the extra mile and show the user a secure, fully masked credit card number that still reflects their original card.  For example, if their credit card number is only 15 numbers long, I shouldn't show a 16 character long string.  So, I've developed this code snippet:
    
```php?start_inline=1
$cc='1234123412341234';
$masked = str_pad(substr($cc, -4), strlen($cc), '*', STR_PAD_LEFT);
```

This simply takes the credit card, substr() the last 4 digit into the str_pad() method as the input.  Then, says the length of the output string should be strlen() of the actual input.  The pad character is a *.  Finally, pad everything on the left.  This way, no matter what, the output length will be the same as the input string, and it will be padded correctly.
