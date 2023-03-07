---
title: 'Zend Framework: Add HTML to form element label'
date: 2012-08-21
tag:
- zend-framework
---
By default, the labels of form elements in Zend Form are escaped.  Sometimes, like in check mark boxes for Terms of Use, it makes sense to add some HTML to this.  You can turn off escaping - but just be careful!  

<!--more-->

**Example:**

```php 
$this->getElement('agreetos)->getDecorator('Label')->setOption('escape', false);
```
    

So, there you go - you can now add a link to that label.
