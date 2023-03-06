---
title: Excel won't handle UTF-8 in CSV?  Force a different encoding in PHP
date: 2010-12-14
tags:
- php
- programming
---
When generating a CSV file with PHP in the UTF-8 encoding, Microsoft Excel freaks out.  It just doesn't show the proper encoding.  Thank you Microsoft!  However, I did find a way to handle this encoding and make it compatible for Windows/Microsoft Excel.

<!--more-->

Instead of outputing with encoding of UTF-8, change it on the fly to Windows-1251.  This can be accomplished with `mb_convert_encoding()`.  Check it out:

```php
$csvOutput .= mb_convert_encoding(implode(',', $value), 'Windows-1251', 'UTF-8');
```
