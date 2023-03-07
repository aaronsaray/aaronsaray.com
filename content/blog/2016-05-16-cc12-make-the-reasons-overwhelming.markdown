---
title: Make the Reasons Overwhelming
date: 2016-05-16
tag:
- php
- business
---
From a very young age, we're told to brush our teeth regularly.  We know we should, but it can be a struggle.  The reasons to invest our important play-time aren't always compelling.  (If they were, why would some parents have to check to make sure the children had brushed their teeth before bed?)  

<!--more-->

### Episode 12: Make The Reasons Overwhelming

So, perhaps the dentist will start to present various different reasons for this silly demand.  If you brush your teeth, your gums will be healthier.  That doesn't necessarily seem important to kids, but it's a legitimate reason.  Your breath will smell better.  Still a good reason, but it's not critical to the kids yet.

For me, the real reason I feel connected to the necessity of brushing my teeth came from the third thing my dentist did.  He showed me a picture of some rotting, decaying teeth and described the pain that would be involved with removing them.  From then on, I was a convert.  Teeth-brushing for all!

How did the dentist get me to wholeheartedly convert?  He kept giving me different reasons until he found a reason that connected.  He overwhelmingly presented reasons until I had no choice but to agree.

#### Make the Reasons Overwhelming

I know you know how to code better than you did on your last project.  But, there are deadlines, the client or boss needs it now, and you just don't have enough time.  The priority is the project and we must accomplish the task immediately.  You should unit test, but you have too many other projects going on.  You know it's important, but you're willing to risk the potential bugs to get the project in the client's hands sooner.  You know you should be using dependency injection, but you don't have the time to refactor all of your code.  Or even more humbling (or humiliating), you know about dependency injection, but you haven't had the time to learn about it yet.  So, it won't make its way into this release.

I work in the real world. I have a boss and I know things must get done.  And behind these tasks, there are legitimate reasons.  My boss or the business has an overwhelming desire or reason to accomplish this particular task, so I'm assigned to it.  

Understanding this key point is important to comprehending how we make decisions both in business and programming.  When the reasons are overwhelming, we must comply.  Or in other words, if you haven't been able to or been allowed to do something you know deep down must be done, your reasons haven't been overwhelming or compelling enough.  As a Confident Coder, you are responsible for making the decisions and best-practices so compelling, your client, boss or team cannot help but go along with your suggestion.  

Put yourself on the opposite side.  When someone asked you to do something that you didn't agree with and wouldn't do, why didn't you satisfy this person?  Their reasons weren't compelling and overwhelming.  You weren't convinced, and even though their request was legitimate and valid, you decided not to proceed.

#### Applying Overwhelming Reasons in the Real World

So, I want to pick a real-life example of one of the methodologies I believe in.  I am going to investigate the process of choosing to move to a model of dependency injection.  In order to invest time, I have to answer this question: What are the reasons that it is a good idea?

First, dependency injection is an architecture that encourages decoupling in the project allowing for a cleaner code base.  That's a good reason, right?  But does that directly translate into profit right at this moment?  Future planning helps, but it might slow me down in the short term.  Evil boss man says: "not good enough."

Second, dependency injection helps unit tests execute more efficiently and effectively.  Well, I'm only doing some unit tests right now.  I know I should be doing more, but when choosing between unit tests or hitting the deadline, I'm creating the code not the tests.  Needy client says: "Unit testing?  Just give me the product.  Not good enough!"

Third, using a dependency injection data connection allows me to switch between data sources at will.  This is useful for writing conversion code.  And with legacy applications, I have to do a lot of conversion.  

Woah!  Let me see if I understand this.  If I create my services or models using an injected data source, I can reduce the amount of code I have to write for conversions?  Let's demonstrate this before and after situation with some very simple code.

```php
class Service\User
{
  private $db;

  public function __construct() {
    $this->db = new Adapter\MSSql();
  }

  // more code here
```

In the original code, no dependency injection is being used.  I like to use the user service whenever I can because I trust it, understand it, and it makes my life easier.  However, to write a conversion from MSSql to MySql, I'm going to have to initialize a different adapter and create a new service as well.  

Let's compare this to our new code:

```php
class Service\User
{
  private $db;

  public function __construct($adapter) {
    $this->db = $adapter;
  }

  // more code here
```

Sure, this is a level of uncoupled code that is good.  And, this is going to be great for testing.  But, let's demonstrate through some very simple use-case code where this concept really shines when dealing with conversions.

```php
$oldService = new Service\User(new Adapter\MSSql());
$newService = new Service\User(new Adapter\MySql());

foreach ($oldService->fetchAll() as $userModel) {
  $newService->save($userModel);
}
```

This code demonstrates how we can continue to use the same service code for different data sources in a familiar way.  If I know how to use the user service with MSSql, I know how to use it with MySql.

Now we've found it.  This particular reason is not only compelling, but strengthened even further by its proximity to the overwhelmingly large collection of reasons.  I now have no choice but to start doing dependency injection immediately.

#### End Notes

This particular dialog illustrated a good exercise in self reflection.  I think if we're honest with ourselves, we all have had internal conversations like this.  But, as a Confident Coder, you now have the power of overwhelming reason in your arsenal for making the process, code and product better.

When you're trying to create a better product, get consent, or keep hitting dead ends, the key is a compelling, overwhelming reason.  A Confident Coder understands and accepts responsibility for presenting these reasons.

> This entry is republished from the original columns included years ago in the [PHP Architect](http://phparch.com) magazine.  I really recommend purchasing the magazine to get timely articles, columns and PHP news.
