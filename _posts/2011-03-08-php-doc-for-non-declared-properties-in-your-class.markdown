---
layout: post
title: PHP Doc for non declared properties in your class
tags:
- Misc Web Design
- PHP
---

You may find while working with projects like Zend Framework that you have a number of publicly available properties of your classes that are not defined and documented.  They might be part of a getter/setter magic method or just purely dynamic.  Well, using PHPDoc, there is a cool tag called [property](http://manual.phpdoc.org/HTMLSmartyConverter/PHP/phpDocumentor/tutorial_tags.property.pkg.html) that helps.  For example...

**Base class with getter/setters**

```php?start_inline=1
class base
{
    /**
     * @var data storage
     */
    protected $_data = array();
    
    /**
     * setter method - used to store data in self::$_data
     */
    public function __set($name, $value)
    { 
        $this->_data[$name] = $value;
    }
    
    /**
     * getter method - retrieves info from self::$_data
     */
    public function __get($name)
    {
        return isset($this->_data[$name]) ? $this->_data[$name] : null;
    }
}
```
    


Now, let's say we have an object of type Person which we know will have a first name and a last name.  However, its not defined in this class for some reason.

**Class with @property definition**

```php?start_inline=1
class person extends base
{
    @property string $first_name The user's first name
    @property string $last_name The user's last name
}
```


Now, when creating instance of this class, if your IDE supports PHPDoc, you will now have those previously undocumented and undefined properties available.
