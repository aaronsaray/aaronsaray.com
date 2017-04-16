---
layout: post
title: 'Zend Framework 1 and jQuery Validate Plugin: how to create password/confirm easily in Zend_Form'
tags:
- jquery
- zend framework
---
Perhaps this trend is going away, but it used to be a "good thing" to make people validate their passwords.  I did all kinds of silly things in Zend Framework Form and jQuery Validate plugin at first - but then I finally settled on a good solution.  It's quite simple actually...

**Part of your Zend_Form class:**

```php?start_inline=1
$this->addElement('password', 'password', array(
  'label'      => 'New Password:',
  'required'   => true,
  'validators' => array(
    array(
      'StringLength', 
      false, 
      array(self::PASSWORD_MIN_LENGTH, self::PASSWORD_MAX_LENGTH)
    )
  ),
  'class'      => 'required password',
));
        
$this->addElement('password', 'confirm_password', array(
  'label'      => 'Confirm password:',
  'required'   => true,
  'validators' => array(
    array(
      'StringLength', 
      false, 
      array(self::PASSWORD_MIN_LENGTH, self::PASSWORD_MAX_LENGTH)
    ),
    array('identical', false, array('token'=>'password'))
  ),
  'class'      => 'required password',
  'equalTo'    => '#password', 
));
```

First thing, add the password field.  Use a validator to make sure that its of the proper length, and require it.  By default, jQuery Validate plugin will also do required on class of 'required' - so this helps out immensely. 

Second, create your confirm password.  Again, use the required and length validators.  Then, add the 'identical' validator.  As a parameter, pass the 'token' keyed array to the element name that it must be identical to.  Finally, pass the parameter 'equalTo' to the addElement() method list to put it in the HTML.  jQuery validator will use this attribute to determine what html ID to target for identical form values.
