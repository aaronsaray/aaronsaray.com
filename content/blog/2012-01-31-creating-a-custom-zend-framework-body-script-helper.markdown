---
layout: post
title: Creating a custom Zend Framework Body Script helper
tags:
- javascript
- zend-framework
---
It drives me nuts that the best practices with javascript that is not required for the initial rendering of your application is to be placed at the bottom of the document, yet frameworks (like Zend Framework) do not support that out of the box.  (I recently found out that Joomla also shares this problem.) 

By default, in Zend Framework, the Zend View Helper of `HeadScript` allows additions to the header of the document (now, technically you could just call the `headScript()` output in the body of your layout, and this would fix it, but that's not very semantic, is it?).

I've created my own solution.  Now, I put `headScript()` items only in the head when necessary, and I add everything else to my new custom `bodyScript()` handler.  This is simply extending the `headScript()` handler for a different position.

```php?start_inline=1
class Application_View_Helper_BodyScript extends Zend_View_Helper_HeadScript
{
  /**
   * @var string The key to store this in the registry
   */
  protected $_regKey = 'Application_View_Helper_BodyScript';
        
  /**
   * Proxy for the different named head script
   */
  public function bodyScript()
  {
    $args = func_get_args();
    return call_user_func_array(array($this, 'headScript'), $args);
  }
}
```

You'll notice it simply is simply extending the `headScript` item and calling it the `bodyScript`.  The only other thing to note is that the `regKey` variable is different from the `headScript()` version.  This is to keep them separate when building the registered entities for this helper.

And of course, this is simply called just like `HeadScript`
    
```html
  <?php echo $this->bodyScript(); ?>
</body>
```
