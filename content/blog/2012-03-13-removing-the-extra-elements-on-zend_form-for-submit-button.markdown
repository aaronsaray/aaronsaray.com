---
title: Removing the extra elements on Zend_Form for Submit Button
date: 2012-03-13
tag:
- zend-framework
---
Have you ever used Zend Form, created a submit button, and had a few extra tags that were just throwing you off?  I know you have...  You probably did it like me:

<!--more-->

```php
$this->addElement('submit', 'submitbutton', array(
  'ignore'=>true,
  'label'=>'Submit This',
));
```

But, you'll notice you have both a `dt` and a `dd` from the standard view helpers of `HtmlTag`.  But, the `dt` usually contains the label attribute.  In this case, the label element is part of the input now.  It stead of being silly and using CSS to hide that empty `dt`, let's just get rid of it... add the following to your code:

```php
$element = $this->getElement('submitbutton');
$element->setDecorators(
  array(
    'ViewHelper', 
    array('HtmlTag', array('tag'=>'dd', 'id'=>$element->getName() . '-element'))
  )
);
```

Simply, get the submit button you just added (you could technically add this in your definition of your initial element too...).  Then, reset the decorators to be the `ViewHelper` and the `HtmlTag`.  However, only define the `dd` tag instead of the full `dd`/`dt` suite.  Finally, set the id to the element's name plus `-element` like the standard view does.

Good to go!
