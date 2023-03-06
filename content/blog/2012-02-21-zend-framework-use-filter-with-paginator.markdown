---
layout: post
title: Zend Framework Use Filter with Paginator
tags:
- zend-framework
---
By default, when using the Zend Paginator, the result set will come back as an array.  If you are using a paginator associated with a database result set, and that db has a class defined for its row, it will come back as that class.  However, if this is not the case, or you are not using information from a database, you may still want a different result than just a plain array.

**Enter the Filter**

The `Zend_Paginator` class has a function called `setFilter()` that will accept a `Zend_Filter_Interface`'d object and apply it to each result set.

So, for example, check out this code:

```php?start_inline=1
class MyObject
{
  public function __construct(array $items = array())
  {
    foreach ($items as $key=>$value) {
      $this->$key = $value;
    }
  }
}

class MyObjectPopulator implements Zend_Filter_Interface
{
  public function filter($item)
  {
    return new MyObject($item);
  }
}

// ...
$paginator = new Zend_Paginator($adapter);
$paginator->setFilter(new MyObjectPopulator());
``` 

First, the `MyObject` class is constructed in such a way to add an array of elements to itself as properties if passed to the constructor.  Next, a filter called `MyObjectPopulator` is created.  The `filter()` method of this class will take the item passed in (which originates from the `Zend_Paginator` query of the `Zend_Paginator_Adapter`), and return a new instance of the object (created from that array item).  Finally, when the paginator is created (from an adapter of your choice), adda  new instance of the filter using the `setFilter()` call.  Now, all results of that paginator will be instances of `MyObject` instead of arrays.
