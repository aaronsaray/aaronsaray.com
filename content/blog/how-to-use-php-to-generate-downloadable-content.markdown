---
title: How to use PHP to generate downloadable content
date: 2007-07-22
tag:
- php
---
I was looking at some code I had written about 3 years ago - how sad!  I was creating a PDF of my resume using PHP to grab my qualifications out of a database.  Unfortunately, I never researched into the [`header`](http://php.net/header) php command, so I made my job harder.  Instead of writing it with a php file, I made a php file, and renamed it as a `.pdf` file.  I modified my `.htaccess` file to process that one particular file as a php script.  This way, the file executed as php but was mime/typed as the pdf.

<!--more-->

Instead, I should have done it the smart way - with the proper use of the header command.

```php
header('Content-type: application/pdf');
header('Content-Disposition: attachment; filename="filename.pdf"');
```

Of course, check out and read the entire header manual page for more.
