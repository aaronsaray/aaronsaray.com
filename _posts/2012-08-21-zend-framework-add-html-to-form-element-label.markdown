---
layout: post
title: 'Zend Framework: Add HTML to form element label'
tags:
- zend-framework
---
By default, the labels of form elements in Zend Form are escaped.  Sometimes, like in check mark boxes for Terms of Use, it makes sense to add some HTML to this.  You can turn off escaping - but just be careful!  

**Example:**

```php?start_inline=1 
$this->getElement('agreetos)->getDecorator('Label')->setOption('escape', false);
```
    

So, there you go - you can now add a link to that label.
