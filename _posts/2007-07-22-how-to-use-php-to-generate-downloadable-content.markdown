---
author: aaron
comments: true
date: 2007-07-22 14:20:08+00:00
layout: post
slug: how-to-use-php-to-generate-downloadable-content
title: How to use PHP to generate downloadable content
wordpress_id: 61
categories:
- PHP
tags:
- PHP
---

I was looking at some code I had written about 3 years ago - how sad!  I was creating a PDF of my resume using PHP to grab my qualifications out of a database.  Unfortunately, I never researched into the [header](http://php.net/header) php command, so I made my job harder.  Instead of writing it with a php file, I made a php file, and renamed it as a .pdf file.  I modified my .htaccess file to process that one particular file as a php script.  This way, the file executed as php but was mime/typed as the pdf.

Instead, I should have done it the smart way - with the proper use of the header command.


    
    header('Content-type: application/pdf');
    header('Content-Disposition: attachment; filename="filename.pdf"');
    


Of course, check out and read the entire header manual page for more.
