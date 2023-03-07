---
title: When writing unit tests, test against absolutes
date: 2012-02-14
tag:
- testing
---
So, while chatting with one of the developers on my team, we started talking about testing an XML document creation process he had been working on.  He wrote a unit test and said "see, here is my class which generates the XML, and then here I use `DomDocument` to add the nodes I know it will have and test against that."

<!--more-->

Poor guy.  Poor, poor guy. I gave him the look of death.

I asked him what he was using to generate the XML in his method he was testing.  It turns out he was running an algorithm to build an array, and then using `DomDocument` to create the XML output.  So I asked him, are you testing the logic of the array creation, or are you testing against the XML output.  His goal was to test the XML from creation to output.  Do you see where the problem is yet?

Basically, I told him that he can't necessarily know what the output of `DomDocument` is.  What if something changes?  That technically is an unknown.  So, if you know what the output XML should be, that's what the test should be.

So, in other words, here's what you should do:

```php
$xmlString = "<xml><root><nodes><to><test></test></to></nodes></root></xml>";
$service = new ClassToTest();
$this->assertEquals($xmlString, $service->generatedXmlFromClass());
```
