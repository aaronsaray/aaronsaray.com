---
title: Using custom view scripts for Zend_Form in ZF1
date: 2012-12-25
tag:
- zend-framework
---
To start out, I realize that a lot has changed in Zend Framework 2 regarding Zend_Form.  I think there have been a number of interesting changes, but perhaps those changes weren't explained that clearly either.  But I digress.  This piece is about Zend Framework 1.12.x Zend Form - and using view scripts for elements/the form.

<!--more-->

### The Purpose of Zend Form

I think it's important to start out with the purpose of the Zend Form component.  Often, I run into developers who look at Zend Form as a giant helper class.  They don't distance the concept of the logic and the view.  In fact, Zend Form is really a complete HTML form generation package, complete with separate logic and views.

The purpose of the logical part of Zend Form is to process input.  If you really dissect the methods, you'll notice that most (if not all) do not rely on the actual submission of a form.  Simply, they accept an input and "run" the form based on that.  Notice I said "run" and not render.  For example, when you call `isValid()` you are executing the form logic.  Generally, people will send in `Zend_Http_Request::getPost()` or something like that.  However, you could easily parse an array from an incoming REST submission, an array representation of another object, or any number of sources.  

The purpose of the view component of the Zend Form is to develop a quick way of rendering the output of a created/processed form object.  These views come with the form, but are not required.  We can set our own views if we really want to.  But more on that later...

### The Process

When a Zend Form is created, the programmer defines various containers for data.  These have additional logic applied to them via validators (Remember, validators can be instantiated by themselves, so they are not restricted to the Zend Form only).  Additionally, elements have filters applied.  These are used to filter the data.  Finally, elements hold a set of decorators to apply various changes to the final values of the containers, when rendered (this is different from filters - this is only executed when the form is rendered using views).  

Because 95% of Zend Form instances will be used in the standard HTML Form manner, there are obviously a number of built in methods that make this easier.  (For example `setAction()`.  If the form wanted to be more generic, we could use `setAttrib()` to set the action.)  And, because most of the forms will be outputted to the screen in a very similar fashion, there are a number of decorators applied to each element (and the form), including decorators to call stock view helpers for each element.  This is the reason why when you print `$form`, you see HTML output.  If you want to see slightly different output, you can stack on decorators to modify the content.

**But, you are not required to use the built in helpers!**

Perhaps you have some very unique situations where you have to render an element/form in a very specific way.  You might want to add additional label elements, send HTML values to decorators that normally filter out HTML, or add additional HTML elements that are not required by the logic of the form.  That is when you need to use the ViewScript decorator - and your own view.

(Aside: a fellow programmer once made a custom element that would accept and display straight HTML wherever it was placed in the hierarchy of form.  Unfortunately, this was not a prudent way to use Zend Form.  That element was not ever used by the form to do any of it's logic, and was only a display.  The programmer was muddling the display of the form with the logic.  Instead, I suggested he use the process I'm going to describe next.)

### Show me some code

Let's start with a simple example rendering an element of the form using a custom view script.  In this example, the form element needs to have a link to the right of it which will generate a new window with some help text.

First, the Zend Form.

```php
class Application_Form_Test extends Zend_Form
{
  public function init()
  {
    $this->addElement('text', 'name', array(
      'label' => 'What is your name?',
      'required' => true,
      'decorators' => array(
        array('ViewScript', array(
          'viewScript'=>'_nameElement.phtml'
        ))
      )
    ));

    $this->addElement('submit', 'submitbutton', array(
      'ignore'=>true,
      'label'=>'Ok!'
    ));
  }
}
```

And now, the view script.

```php
echo $this->formLabel($this->element->getName(), $this->element->getLabel());

echo $this->{$this->element->helper}(
  $this->element->getName(),
  $this->element->getValue(),
  $this->element->getAttribs()
);

echo '<a href="/help.html" target="_blank">Need help?</a>';

$errors = $this->element->getMessages();
if (!empty($errors)) echo $this->formErrors($this->element->getMessages());
```

This generates the following output when printing the form.

[![](/uploads/2012/Screenshot.png)](/uploads/2012/Screenshot.png){: .thumbnail}

**There is something important to note here:**  The link was not a required element of the form, it was only needed for display.  (Side note: there is always more than one way to solve each problem.  It is quite possible that I could have prepended a decorator onto this element to potentially accomplish this task too.)

This handles just a simple element.  However, since both elements of the Zend Form and the form itself accept decorators, the ViewScript decorator can be applied directly to the form as well.  This gives you the most control of any form.

### Final thoughts

It is important to know that the Zend Form package in Zend Framework 1 is a conglomeration of logic and views, but they are not required to be tightly coupled.  Think of it as the standard car you can get when you start to purchase your new vehicle.  You can change colors, options, and even trims.  The view changes all around it - but it always starts out the same.  And, of course, keep your core form very logic oriented only.  There should never be content in the form that is used purely for display only.

For more, don't forget to check out the Zend Framework manual for the [Zend Form ViewScript decorator](http://framework.zend.com/manual/1.12/en/zend.form.standardDecorators.html#zend.form.standardDecorators.viewScript).
