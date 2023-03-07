---
title: Theoretical Thoughts on Data Object Validation
date: 2013-01-29
tag:
- php
- programming
---
One of the things I struggle with is the validation of data objects.  I submit that there is such a thing as a dumb data object and a validation domain object.  The validation object could also be some sort of helper or a service I guess.  But, the point is, that the main data object doesn't have validation on it.  It has coupled objects that provide that validation.

<!--more-->

One caveat could be validation that restricts the values within known bounds.  A title can't be longer than 250 characters.  Price to produce can't be a negative amount.  Things like that.

So, let me put my thoughts into an example.  Say you have a hard drive in your warehouse you want to sell.  We'll call this `HarddriveObject`.  This object has a few values: `HarddriveObject:size`, `HarddriveObject:suggestedSalePrice`.

So the argument is this: If I set the suggestedSalePrice to $100 for a size of 1T, there should be validation on this object to make sure the sold version matches that.  The object should have validation to make sure the value is not say 500gb or 3T.  The object should validate that the sold price is the suggestedSalePrice.

This is where my argument comes in.  The object itself has a number of properties that are variables.  So, the object CAN'T validate that the variables are one value.  They could validate that the values are sane, but not one single value.  

Let me explain in a different way.  The `HarddriveObject` could validate that the size is not 0bytes.  But it can't validate that it is 1T.  Instead, a domain object that knows about your possible stock objects needs to validate that.  It says "we only have 1 terabyte drives, so when I populate this drive, I must validate that."  Because, remember, this particular object COULD - in someone's warehouse - be a 3T version of itself.  Just, you've ordered 1T for your stock.

The same thing with price.  We know that the suggested price is $100.  However, our domain logic - a different object - can validate that the sale price is at least suggested price or above.  Or, perhaps certain wholesalers get up to 20% off.  You don't want to build this into the hard drive.  It should never know about discounts you might apply.  That's a business rule, not a property of the hard drive.

So I submit that architecture should include dumb objects such as HarddriveObject and domain objects that are directly associated... such as `SaraySalesValidationHardriveObject` or something like that.
