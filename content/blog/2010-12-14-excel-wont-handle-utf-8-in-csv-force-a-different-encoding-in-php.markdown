---
layout: post
title: Excel won't handle UTF-8 in CSV?  Force a different encoding in PHP
tags:
- php
- programming
---
When generating a CSV file with PHP in the UTF-8 encoding, Microsoft Excel freaks out.  It just doesn't show the proper encoding.  Thank you Microsoft!  However, I did find a way to handle this encoding and make it compatible for Windows/Microsoft Excel.

Instead of outputing with encoding of UTF-8, change it on the fly to Windows-1251.  This can be accomplished with `mb_convert_encoding()`.  Check it out:

```php?start_inline=1
$csvOutput .= mb_convert_encoding(implode(',', $value), 'Windows-1251', 'UTF-8');
```
