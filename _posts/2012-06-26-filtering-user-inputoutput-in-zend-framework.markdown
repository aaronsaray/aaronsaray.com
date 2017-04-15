---
layout: post
title: Filtering User Input/Output in Zend Framework
tags:
- security
- zend framework
---

There are two areas where user input should be filtered: on display and on storage.  Luckily, Zend Framework provides tools for this...


### Filtering User Input in the View


In any view, the Zend View Helper 'escape' is available.  Whenever displaying user input, use it to escape and filter the output:

```php?start_inline=1
echo '<p>Hello ' . $this->escape($user->getName()) . '!</p>';
```
    



### Filtering User Input before Persistence 


The Zend Filter Zend_Filter_Input exists to filter this content.  You can also add validators to it.  In this case, I am posting a numeric ID called 'key' and a string field called 'name'.


```php?start_inline=1
$filters = array(
    '*'   => 'StringTrim',
    'key' => 'Digits'
);
$validators = array(
    'key' => 'Digits',
    'name'=> 'Alpha'
);
$filteredInput = new Zend_Filter_Input($filters, $validators, $_POST);
```




The $filteredInput variable now contains user input that has been filtered.  First, the filter of StringTrim is applied to all items in the input array (see the *).  The Digits filter is applied only to the key element.  Then, the validators are initiated.  The key item is validated as a Digit and the name item is validated as an Alpha type field.

When not using Zend_Form, be absolutely certain to filter your input in this method.
