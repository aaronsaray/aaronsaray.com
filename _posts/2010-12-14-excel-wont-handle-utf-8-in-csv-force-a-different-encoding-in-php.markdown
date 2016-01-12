---
author: aaron
comments: true
date: 2010-12-14 15:43:09+00:00
layout: post
slug: excel-wont-handle-utf-8-in-csv-force-a-different-encoding-in-php
title: Excel won't handle UTF-8 in CSV?  Force a different encoding in PHP
wordpress_id: 755
categories:
- PHP
- programming
tags:
- PHP
- programming
---

When generating a CSV file with PHP in the UTF-8 encoding, Microsoft Excel freaks out.  It just doesn't show the proper encoding.  Thank you Microsoft!  However, I did find a way to handle this encoding and make it compatible for Windows/Microsoft Excel.

Instead of outputing with encoding of UTF-8, change it on the fly to Windows-1251.  This can be accomplished with mb_convert_encoding().  Check it out:


    
    
    $csvOutput .= mb_convert_encoding(implode(',', $value), 'Windows-1251', 'UTF-8');
    
