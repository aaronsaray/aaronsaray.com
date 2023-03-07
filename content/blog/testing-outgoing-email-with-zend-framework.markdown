---
title: Testing Outgoing Email with Zend Framework
date: 2011-07-27
tag:
- testing
- zend-framework
---
I was creating a new application with Zend Framework at work the other day and I started using my technique that I described [here]({{< ref "/blog/how-i-test-email-recipients-when-i-develop" >}}) by adding the original email in my email address using the + sign.  However, the current organization I'm at has a mailserver (Exchange?) that is either configured not to allow this or just doesn't have this functionality built in.  So, this won't work.  I solved this with a new implementation of the mail class.  

<!--more-->

### Goals/Objectives

  * Using Zend Framework's `Zend_Mail` to send mail

  * Must send to me in non production but I should be able to verify who the original recipient would have been

  * Must require no changes between production and development code - should be automatic

### The Solution: A new class Application_Model_Mail

I decided to make a new model called Mail which will extend the `Zend_Mail` class.  Everything will work the same except for the to addresses.  See this code:

**`application/models/Mail.php`**
```php
<?php
class Application_Model_Mail extends Zend_Mail
{
  public function addTo($email, $name='')
  {
    if (!is_array($email)) {
      $email = array($name => $email);
    }

    if (APPLICATION_ENV !== 'production') {
      array_walk($email, array($this, '_convertToTestEmails'), $this);
    }
        
    return parent::addTo($email);
  }
    
  protected static function _convertToTestEmails(&$email, $key, $mail)
  {
    $testEmail = 'test@developer.com';
    $mail->addHeader('X-Test-Original-Email', $email, TRUE);
    $email = $testEmail;
  }
}
```

First, the `addTo()` method is overwritten.  A bit of the code is copied in order to determine if the email address is an array with the `name => email` key or just an email.  The end result is $email as an array with a key of the display name (possibly blank) and a value of the original email address.  Next, check the application environment.  If it is not production, `array_walk` the email array using our protected `_converttoTestEmails` method.  Finally, call the parent `addTo()` method using the new $email value that has been processed.

The protected function `_convertToTestEmails()` gets the destination developer email address.  Then, it adds a header of the original email address.  Checking this header is how I can verify, if necessary, that the original email address would have been right.  Then, it replaces the original email address with the test developer address.  Notice, it keeps the key the same.  This means that during the testing process, the developer could get multiple emails sent to them with different 'to' names but always the developer's email address.  To fully verify, the `X-Test-Original-Email` needs to be verified.

Do you have any ways that you use besides my original method and this to test emails?
