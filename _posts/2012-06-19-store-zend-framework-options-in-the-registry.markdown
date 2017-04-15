---
layout: post
title: Store Zend Framework Options in the Registry
tags:
- zend framework
---

So, since I want to save some keystrokes, I rarely will go back to the Front Controller and Bootstrap to get resources.  I also like to store them in the registry in a fashion that I see fit.  

So, when you create a default Zend Application, the bootstrapper will read in your config.ini file that you specify and handle that in the bootstrap parent class.  You can get these options by calling the $this->getOptions() method. I prefer to work with these as a Zend_Config object as well (by default, they are just a plain array.) Since I want to always have this available in the Registry, I've made the following method part of my Bootstrap class in all my applications:

```php?start_inline=1
class Bootstrap extends Zend_Application_Bootstrap_Bootstrap
{
  protected function _initOptionsRegistry()
  {
    Zend_Registry::set('options', new Zend_Config($this->getOptions());
    return Zend_Registry::get('options');
  }
  
  // ...
```

First, the method is named that way on purpose.  This way, later on in the bootstrap, if I really wanted to get the output of the registry version of the options, I could call $this->getOptionsRegistry().  It's much more clear that I'm getting that version than just the array version from $this->getOptions().  This is the reason why there is a return statement at the end as well.  That return statement tests my input as well.  If it doesn't return the right result, I know there was a problem storing it in the registry.

Next, a new Zend_Config item is made using the multidimentional array gained from the boostrap, and then it's set in the 'options' key of the Registry.
