---
layout: post
title: Removing the extra elements on Zend_Form for Submit Button
tags:
- zend framework
---
Have you ever used Zend Form, created a submit button, and had a few extra tags that were just throwing you off?  I know you have...  You probably did it like me:
   
```php?start_inline=1
$this->addElement('submit', 'submitbutton', array(
    'ignore'=>true,
    'label'=>'Submit This',
));
```

But, you'll notice you have both a DT and a DD from the standard view helpers of HtmlTag.  But, the DT usually contains the label attribute.  In this case, the label element is part of the input now.  It stead of being silly and using CSS to hide that empty DT, let's just get rid of it... add the following to your code:

```php?start_inline=1
$element = $this->getElement('submitbutton');
$element->setDecorators(array('ViewHelper', array('HtmlTag', array('tag'=>'dd', 'id'=>$element->getName() . '-element'))));
```

Simply, get the submit button you just added (you could technically add this in your definition of your initial element too...).  Then, reset the decorators to be the ViewHelper and the HtmlTag.  However, only define the DD tag instead of the full DD/DT suite.  Finally, set the id to the element's name plus '-element' like the standard view does.

Good to go!
