---
layout: post
title: Easy Flash Messenger Messages in Zend Framework
tags:
- zend framework
---

Through reading a few blog posts over the last year and my own trial and error, I've developed a way of using the flashMessenger Helper in ZF that works out really well for me.  (Note: if anyone knows the original blog post that I got some of the view helper from, please comment!).

### Objective

  * Use FlashMessenger to store both success and failure messages and denote them as such.

### Using FlashMessenger in the Controller

Now, we're going to change the way we assign messages in the controller.  Make an array of the message with a key of the type, and a value of the message.  You may want to use 'success' and 'failure':

**in some controller...**
    
```php?start_inline=1
$this->_helper->flashMessenger->addMessage(array('success'=>'The update was successful'));
```

### Next, create a View Helper

Create the following view helper. I placed mine here: 

**`application/views/helpers/FlashMessages.php`**
```php
<?php
class Zend_View_Helper_FlashMessages extends Zend_View_Helper_Abstract
{
    public function flashMessages()
    {
        $messages = Zend_Controller_Action_HelperBroker::getStaticHelper('FlashMessenger')->getMessages();
        $output = '';
        
        if (!empty($messages)) {
            $output .= '<ul id="messages">';
            foreach ($messages as $message) {
                $output .= '<li class="' . key($message) . '">' . current($message) . '</li>';
            }
            $output .= '</ul>';
        }
        
        return $output;
    }
}
```

The output is initially blank.  This is because we will always 'blindly' call this in our layout later.  Then, the messages are retrieved from the flash messenger using the getStaticHelper method to retrieve the FlashMessenger helper (and call its getMessages() method).  If it has content, output is appended with a UL with an ID of messages (this is for css styling later).  Then, each message is looped through and added to an LI element.  The 'type' is the class of that element, and the message is the content.  (Note: since this is an array of single arrays where neither the key nor the value is known, that is the reason to use key() and current()).  Finally, output is updated with the closing UL tag.

### Use this in Your View

I technically put this call in my layout towards the top of my content:

```php?start_inline=1
echo $this->flashMessages();
```

I also modify my CSS to have styling of green for the #messages li.success and red for #messages li.failure.
