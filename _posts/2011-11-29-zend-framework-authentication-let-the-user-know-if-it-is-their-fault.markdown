---
layout: post
title: 'Zend Framework Authentication: Let the user know if it is their fault'
tags:
- zend framework
---
One of the things that is irritating is logging into a website with credentials that you know are right, only to have it fail.  Then, later, you find that the site was malfunctioning.  By then, maybe you requested a new password, or had to at least waste time looking up your old password.  With `Zend_Auth`, however, we can prevent user's from having that issue.

Side note: some schools of thought want to go the extra mile for security and never give the visitor any extra information than what is required.  I believe this to some extent.  I will say the username or password is wrong (I won't say that the username exists, but the password is wrong.)  However, I don't think it's out of line to alert the user if your system is having authentication issues. 

So, with `Zend_Auth`, the `authenticate()` method returns a `Zend_Auth_Result`.  This, of course, has the `isValid()` method which everyone is familiar with.  However, there are a number of reasons why this could return false.  Whatever reason generated the invalid response will be returned by the `getCode()` method.  These include:
    
```php?start_inline=1
const FAILURE                        =  0;
const FAILURE_IDENTITY_NOT_FOUND     = -1;
const FAILURE_IDENTITY_AMBIGUOUS     = -2;
const FAILURE_CREDENTIAL_INVALID     = -3;
const FAILURE_UNCATEGORIZED          = -4;
```

The user is really only concerned with the `FAILURE_IDENTITY_NOT_FOUND` and `FAILURE_CREDENTIAL_INVALID` conditions.  The rest are more-than-likely our own failures.  (For example, your data has become corrupted? `FAILURE_IDENTITY_AMBIGUOUS`).  

When I generate error messages for the user, I tend to make a method called `isFailureUserBased()` which will determine the type of error I return.  If it is user based, I'll return a string saying incorrect username or password.  If it is not user based, the message will be to contact support or wait it out (I might even send an automated note to the support staff at this time).

This is usually a very simple method:

```php?start_inline=1
/**
 * Used to determine if this is a user failure or an internal failure on our part
 * 
 * @return boolean if its a user failure
 */
public function isFailureUserBased()
{
  //stored internal Zend_Auth_Result instance
  $result = $this->_authResult->getCode(); 
    
  switch ($result) {
    case Zend_Auth_Result::FAILURE_IDENTITY_NOT_FOUND:
    case Zend_Auth_Result::FAILURE_CREDENTIAL_INVALID:
      return true;
  }
    
  return false;
}
```
    