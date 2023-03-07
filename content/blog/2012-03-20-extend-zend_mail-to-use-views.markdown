---
title: Extend Zend_Mail to use Views
date: 2012-03-20
tag:
- testing
- zend-framework
---
I love working in the Zend Framework view system.  One thing that bothers me, however, is that I must create a complex set of models when trying to send email.  I decided that I'd like to move all of this output for the mail class into my own view system as well.  

<!--more-->

Before we begin, it's important to know the goal. The goal is to create a version of `Zend_Mail` that can read in views for both HTML and Text emails. In addition, since I am such a Unit Testing Fool, I want to make sure my new changes are testable.  For once, you're going to see a fully documented class!  I'll post the code here and then review it afterward.

**`application/models/Mail.php`**
```php
<?php
/**
 * Zend_Mail override
 * 
 * Holds the class for the zend_mail override
 * @package AaronSaray
 */
 
/**
 * Overrides Zend_Mail to use views
 * 
 * This creates the setBody commands in such a way that the views can be 
 * used to populate the emails
 * @author Aaron Saray
 * @package AaronSaray
 */
class Application_Model_Mail extends Zend_Mail
{
  /**
   * @var string constant saying this a text type
   */
  const TYPE_TEXT = 'text';
	
  /**
   * @var string constant saying this is html type
   */
  const TYPE_HTML = 'html';
	
  /**
   * This is used to make all of my e-mails utf-8 instead
   * @param string $charset
   */
  public function __construct($charset = 'UTF-8')
  {
    parent::__construct($charset);
  }
    
  /**
   * Sets the type of body content
   * 
   * Sets the proper body content with the proper content, initializing view
   * 
   * @param string $type the type of stuff
   * @param string $scriptname the name of the email script
   * @param array $params stuff to replace
   */
  public function setBody($type, $scriptname, $params = array())
  {
    $layout = new Zend_Layout(array('layoutPath'=>$this->_getLayoutPath()));
    	        	
    switch ($type) {
      case self::TYPE_HTML:
      case self::TYPE_TEXT:
        $layout->setLayout('email' . $type);
        break;
      default:
        throw new Zend_Exception($type . ' type is not a valid body type');
    }
        
    $view = new Zend_View;
    $view->setScriptPath($this->_getViewPath());
    foreach ($params as $key=>$value) $view->$key = $value;
    $layout->content = $view->render($scriptname . $type . '.phtml');
        
    $html = $layout->render();
    $func = 'setBody' . ucwords($type);
    $this->$func($html);
        
    return $this;
  }

  /**
   * returns the layout path used in email formation
   * @return string path
   */
  protected function _getLayoutPath()
  {
    return APPLICATION_PATH . '/layouts/scripts';
  }

  /**
   * returns the view path used in email formation
   * @return string path
   */
  protected function _getViewPath()
  {
    return APPLICATION_PATH . '/views/scripts/email';
  }
}
```

Starting out the class, you'll see I created it as a single class in a single file.  The first two docblocks just define what this file does and what the class goal is.  Next, the model extends the `Zend_Mail` class.  For the most part, all of the features are perfect in the `Zend_Mail` class for our goal.  

The two constants defined next will be used when determining the type of email body we're currently working with.  The constant name makes it easy to determine what the constant is for.  The value is a normalized version of the `name` of our view or layout that we'll be using later on.  It is important to note that views used later will be suffixed by the content of these constants.  For example, the layout for text emails will be called `emailtext` because `text` is the constant value.

The constructor defines the default charset.  Since all of my views are UTF-8, I felt it necessary to define this by default.

I'm going to skip the `setBody()` method and talk about the other two methods real quick.  You'll notice that there are two methods called `_getLayoutPath()` and `_getViewPath()`.  The reason these are methods unto themselves is to make this class easier for testing.  Since you generally don't define a test suite inside of an application (view files aren't testable code generally), the user input for this would always be randomly or non existent.  For our test suite, we can mock these two methods to point to locations where we keep assets for our tests so that we know the content of those files specifically.  An additional reason to use this is if you introduce themes into your Zend Framework project.  You may need to extend this class again to define where the theme's view files are located (because they may not be in the default location).  

Finally, the `setBody()` call.  If you recall, the `Zend_Mail` class has both `setBodyText` and `setBodyHtml` methods.  Once again, we see the constant values defined earlier coming into more use.  This is more of a generic call because most of our code used to define the views is duplicate.  Let's dissect:

First, create a new `Zend_Layout` object (this is of course assuming your project is using Layouts.  Let's be honest, you more than likely are...).  Then, depending on the type that is passed into the `setBody()` command, it sets the layout as `emailtext` or `emailhtml`.  If neither type, it will throw an exception.

Next, create a new `Zend_View` instance.  This will retrieve the script from the `$scriptname` parameter combined with the view location defined in the `_getViewPath()` method.  Once this is created, each of the final parameter (the `$params` array) is applied to the view.  This is what is used to populate your view once rendered.  

Finally, the views and layouts are rendered and applied.  The `setBody` specific command is called then of the parent class with our rendered view-based content sent in as a parameter.

This is how you might use this:

```php
$mail = new Application_Model_Mail();
// ...
$mail->setBody(
  Application_Model_Mail::TYPE_HTML, 
  'forgotpassword', 
  array('user'=>$user)
)->setBody(
  Application_Model_Mail::TYPE_TEXT, 
  'forgotpassword', 
  array('user'=>$user)
);
$mail->send();
```

This would load the layout from **`APPLICATION_PATH/layouts/scripts/emailtext.phtml`** and **`APPLICATION_PATH/layouts/scripts/emailhtml.phtml`**.  Then, the views would be rendered from **`APPLICATION_PATH/views/scripts/email.forgotpasswordhtml.phtml`** and **`APPLICATION_PATH/views/scripts/email.forgotpasswordtext.phtml`**
