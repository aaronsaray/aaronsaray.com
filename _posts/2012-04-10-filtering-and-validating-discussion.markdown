---
layout: post
title: Filtering and Validating Discussion
tags:
- Business
- programming
- security
---
I came up with a great topic to write this blog entry about: filters and validators.  Then, I got to thinking - maybe I can get more feedback from other programmers I know.  I decided to send a note out to a few of my buddies and see what they thought as well.  

**[Aaron Saray](http://aaronsaray.com)**

Today we are comparing Filters and Validators.  Generally, we filter data to remove unwanted parts.  Validators are used against data to validate that it meets certain requirements.  As you see, these have some overlap, and it all depends on how you might choose to implement them. You could validate that a string is only alpha-numeric (and subsequently reject it if it is not), or you could filter out non-alpha-numeric content and accept that as your data.

So the questions are related to the following thoughts.  Feel free to share your experience and best practice advice.  Should you filter your data before you store it?  Should you filter for harmful web content, harmful xml content, or business requirements?  How do you determine what is 'harmful?'  Would you say there is a difference between filtering input and filtering output?  What about when you validate based on business rules?  What if the rules change and you now have filtered or validated data this no longer valid?  Could you do a conversion if you kept all data and didn't filter it out permanently?

**[Joel Clermont](http://joelclermont.com)**

_Quote: ...Should you filter your data before you store it?  ..._
I'm a strong believer in the basic principle: filter input, escape output. Both are equally important. If you do this properly, you can probably avoid 3 or 4 of the top 10 exploits listed by OWASP.

_Quote: ... Should you filter for harmful web content, harmful xml content, or business requirements?  ..._
I guess it depends on the definition of the word "harmful". I tend to think of things that could either harm the system (SQL injection) or harm the system's users (XSS, malware links, etc). Some people might extend that to be harmful to the company's reputation (graphic images or language).

My main advice here is to not reinvent the wheel. There are some great libraries (HTML Purifier, for one) that handle this. Oh, and don't think that PHP's strip_tags or ZF's Zend_Filter_StripTags are up to the task. They're not.

_Quote: ... Would you say there is a difference between filtering input and filtering output? ..._
Filtering input is about protecting the system. Escaping output is about protecting the user. Both important, but they are implemented separately and solve different problems.

_Quote: ...Could you do a conversion if you kept all data and didn't filter it out permanently?..._
This is a tough one. Some filters, like stripping whitespace, would likely never change. They will always be in play. But maybe if you normalize data (state/country names, for example), there's no way to de-normalize that in the future and get raw customer input. I guess if I thought I would ever care about the raw data, I might store that somewhere else for posterity's sake. This seems like an edge case however.

**[James Rodenkirch](http://rodenkirch.com)**

Interesting topic, and actually very timely with projects I am dealing with on a daily basis :)

Currently we are building out an enterprise level data warehouse for education data and one for corrections data. As surprising as this may seem to some, both of these domains have HORRENDOUS data. We see instances of missing data fields, flat out wrong demographics, and data files that change from year to year.

Your question "Should you filter data before you store it?" - absolutely. You never want to store data that could come back and bite you in the ass. The concepts of data warehousing require that your data is stored in a pristine state, if it is not pristine, you hold it in limbo until it can be made pristine (usually requiring user intervention).

So, what if you are not running a data warehouse but are running a CMS? I would still strongly argue that it is important to cleanse/reject bad data before it gets stored. If you think about the read/write actions needed on the database you can quickly see that it is better to run filters/validators once on "write", than every time the data is requested on "read". Basic performance benefits lead us to doing as much of the filter/validation up front as possible.

Please note, this does not replace the need for escaping output on display - we always need to protect our applications and our users from dangerous data. 

**[Jeremy Dee](http://twitter.com/akadeej)**

Great points James. I'd like to add that while providers of web services (SOAP & REST) probably do a pretty good job of filtering & validating the requests they receive, I think that consumers tend to place too much faith in said services - probably giving them less filtering & validation than they should, especially with the easy deployment/proliferation of REST services. While many devs are quick to filter their form data, do they take the time to make sure that the current weather forecast they're getting doesn't have something nasty contained in it?  Exception/Error handling around any type of XML parsing to catch unannounced changes response format isn't a bad idea either.

In the case of critical web services, I often store a compressed copy of my request and their response alongside the data I've pulled out of the transaction for the flexibility it offers (maybe I'll use more of this transaction's data someday) and liability concerns.

Finally, a question I have for the group - what practices do you follow regarding “internal” filtering and validating on a big system. With high cohesion you get an explosion of objects, each with public methods potentially being called from anywhere. When do you check parameter types and/or values? Or do you just let it fail? Type hinting's fine for objects, but what about primitives? Personally, I know some of my “gateway” methods that start a cascade of actions, so I'll make sure that I've at least got my parameters straight before I proceed with them so I don't have to do a giant rollback way down the call stack, but I've often wondered if it's overkill. 

**[Aaron Saray](http://aaronsaray.com)**

I have two thoughts.  First, we always talk about escaping output when it comes to the user.  However, there always seems to be a bit of confusion when the actual escaping should happen.  Don't you indeed escape potentially unsafe data going to your database (see: `mysql_real_escape_string()`) but you also escape it going outwards (`htmlentities`, etc)... So the question is where do you draw the line with escaping?  Could one argue that you could do htmlentities before you store the data too?

Jeremy - in regards to your primitive checking.  I've never come across a good standard for doing that checking.  However, I've been known to write special methods per class... something like `_checkSanity()` with enough domain knowledge and type knowledge to filter out unwanted data.  I'm sure that's not the best way to do it, however.  I generally would trigger a failure than to filter the content.

**[Eric Lightbody](http://ericlightbody.com)**

I'd like to address the recent question that Aaron had in regards to where to draw the line with escaping. As a general rule I like to escape before it could be potentially harmful. If I'm going to store information in a database I need to make sure that the data going into it is safe. HTML entities are safe for a database, so I'll let it be stored there. However, those same entities can be harmful for a browser. So, before I "store" it in the browser, I need to make sure that it is safe to be there.   Business logic may change, and you may need access to the entities that were stored in the database.

As a side note, I would like to add that it is important that you make it easy on yourself for this type of work. Zend Framework, for example, provides a boatload of filters and validators. It also makes it easy to implement your own. If there isn't a good structure in place to use the proper filters and validators, it's easy to be lazy and let things slip through.

**[Jeremy Dee](http://twitter.com/akadeej)**

Wow - great way of putting it Eric - "storing in the browser" - that notion of safely storing your data whatever that may mean makes for a nice rule-of-thumb. 

### Final Thoughts

I thought I'd publish this conversation so that other's could see how a few professionals approach filtering and validating too.  Any thoughts?  Feel free to add comments below.
