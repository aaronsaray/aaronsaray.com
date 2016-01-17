---
layout: post
title: Zend Framework 1 Form Captcha Idea
tags:
- zend framework
---

One of the worst things with CAPTCHAs are actually having to solve them.  One of the things my team and I use for our projects is the hidden field CAPTCHA.  This is a technique that adds a field to a form, but uses CSS to hide it.  If that form value is filled in, we can guess that the submitter was a bot reading the HTML - and not an actual user.  

In a Zend_Form, we might do this:

{% highlight PHP %}
$captcha = new Application_Validate_CaptchaHiddenField();
$this->addElement('captcha', 'userdetect', array('captcha'=>$captcha));
{% endhighlight %}    

To create this empty captcha field, our validator looks like this:

{% highlight PHP %}
<?php
class Application_Validate_CaptchaHiddenField extends Zend_Captcha_Word
{
    /**
     * Render the captcha - we want it to be blank
     *
     * @param  Zend_View_Interface $view
     * @param  mixed $element
     * @return string
     */
    public function render(Zend_View_Interface $view = null, $element = null)
    {
        return '';
    }

    /**
     * Overwrite Generate new random word to be blank so only blank is accepted
     *
     * @return string
     */
    protected function _generateWord()
    {
        return '';
    }
}
{% endhighlight %}    


Basically, what this does is generate a blank word - and not put any rendered design around the form field.  So, as captchas go, if the entered item does not match the generated word, it fails.  In this case, the entered item (anything) doesn't match "" (nothing), so it would fail.

Mind you, smarter bots can process CSS... so this isn't perfect.  Also, we've seen spam that actually seems to originate from humans, so this is only the first line of defense.
