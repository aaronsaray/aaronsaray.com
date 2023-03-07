---
title: How to Add PHPUnit to your Include Path (for autocompletion) in Eclipse PDT
date: 2012-02-07
tag:
- eclipse-pdt
- phpunit
---
By default, PHPUnit is not part of the default installation of Eclipse PDT.  (Zend Studio is another beast, however...)

<!--more-->

It's easy to add the PHPUnit install to your include path however. 

  1. Make sure that the PHPUnit install is the same version you are using to test your code with.  This is probably the case.  Make sure you know where the location of the PHP files are.

  2. In your project, right click on the second to last item called 'PHP Include Path', choose 'Include Path' and click 'Configure Include Path'

  3. Click the Libraries tab on top.

  4. Click Add Library... and choose User Library and click next

  5. If the PHPUnit library is not there (ie, you haven't already done these steps), click the Configure... button. Then click 'New' and choose the base folder for this library. Name it accordingly.

  6. Put a check mark next to the item and choose next/finish.

Now, after you build your workspace again, you should have the autocompletion for the PHP Unit source code without having to have the library in your code base.  Yay!
