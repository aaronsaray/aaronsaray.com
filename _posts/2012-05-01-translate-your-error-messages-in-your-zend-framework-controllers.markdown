---
layout: post
title: Translate Your Error Messages in Your Zend Framework Controllers
tags:
- Misc Web Design
- zend framework
---

I've been making a push to have more of my projects multi-lingual.  However, one thing I kept forgetting about was those super-rare error messages that have to come from the Controller.  For the most part, all of your errors should be handled by your validators in your forms.  However, from time to time, there needs to be an error handled in your controller.  

Enter Zend_Translate!  Here is what I suggest:

Create a Zend Translate instance for your entire project.  Store this in the Zend_Registry (I tend to do this in the bootstrap because every item, whether it be CLI or web, needs the ability to translate output).  Then, create your situation where you might have to add an error message.  Finally, translate the message before it is added to the persistent storage.

Side note: There is some argument as to whether the translation should be handled in the controller or when you are trying to show the view.  In this example I will just be showing / suggesting in the controller.  However, that is a good discussion to have... perhaps this should only happen in the views... :)

Let's check out some code in an action

```php?start_inline=1
public function dosomethingAction()
{
  if (!Zend_Auth::getInstance()->hasIdentity()) {
    //ruh roh - need some identity
    $translate = Zend_Registry::get('translate'); // our main object we created
    $message = $translate->_('Please log in.');
    $this->_helper->flashMessenger->addMessage($message);
    return $this->_redirect('/');
  }
  // life is ok here!
}
```

It may be easy to forget that we want to translate all of our output.  Don't forget the error messages in the controller!
