---
title: Sanity Check Values
date: 2016-05-05
tag:
- php
---
When I was growing up, having chocolate milk was a huge treat.  My mom would mix together some sugar and some dry cocoa powder into the glass and then slowly add milk.  After some more vigorous stirring, I had my small glass of chocolate milk.  It was quite the process, but it tasted great.  Imagine my surprise when I found out that chocolate milk also came from the store pre-mixed!

<!--more-->

### Episode 10: Sanity Check: Insane Value!

I was visiting a friend the first time I found out about this amazing invention.  My friend's dad was beginning to pour some chocolate milk for me and he said the phrase "Say when" implying I should say when to stop the flow of rich, delicious pre-mixed chocolate milk into my glass.  Well, let me tell you, I was so excited about this new discovery, I wanted to have as much as I possibly could.  I would not say 'when' ever!  I ended up having an extremely full glass of chocolate milk surrounded by a few drops spilled on the table.  I wasn't going to stop the flow of milk, no matter what!

#### Restricting the Flow

There are two ways we might receive a larger flow of data than we're expecting.  Both can cause a denial of service from exhausting resources.  The first is because a user is just extremely passionate or excited about our service and is over-using it.  The second is from malicious intent.  

#### The Friend

I'm sure you've been here before.  Some great feature was available on a website after you click a link and you want to use it quickly.  Perhaps you want to pre-load a lot of Vimeo videos?  Instead of clicking through each one individually, you open up each one in a new tab in your browser.  Now instead of one video ever few seconds, you're now loading 10 videos all at once.  You're super excited to see all of these videos; and you've 'hacked' the system to get your content sooner.

With a site like Vimeo, there are tremendous resources available.  It's probably pretty rare that requests like this are throttled, and if they are, it's after a considerable amount of usage.  Your site may not be on such a large infrastructure, however.  That's why it's important to monitor, control and restrict the flow of resources and user requests in your application.

I am going to refer to this type of checking as sanity checking.  (Please note, sanity checking involves a larger set of tests to determine if all the information makes sense in this context and is at acceptable limits.  I'm using the term generally here.)  It is important to properly limit and sanity-check the request being made by your user - especially if you are limited in your resources.  Remember, the user is just excited to use your application, they haven't thought through the ramifications of what their greed will have on other users of your site.

To do this type of checking, you might track via session, IP, user account or geo-location the resources being used by the current user.  If a user is already requesting two file downloads simultaneously, a third may be paused or throttled.  

As a Confident Coder, you're constantly building sanity checks and balances into your application.  You want to serve the most amount of users without degrading the user experience.  

#### The Foe

The second reason to sanity check information comes from purposeful directed denial of service attacks.  A malicious user may take time to figure out how your application works and then generate requests that use the most amount of resources possible in an effort to degrade performance or restrict access.  

For example, imagine a scenario where you accept 3 email addresses in a web form to send notification emails to.  Via AJAX, the email addresses are validated for format as well as whether they belong to the customer database in Salesforce.  Note this following example code:

```php
/**
 * @return true if valid email and customer
 */
function validateEmail($email)
{
  return filter_var($email, FILTER_VALIDATE_EMAIL) && SalesForce::isCustomer($email);
}

$responses = array();
$emails = $_GET['emails'];
foreach ($emails as $email) {
  $respones[$email] = validateEmail($email);
}
echo json_encode($responses);
```

This very simple script checks to make sure that the email address is valid, and if it is, uses our `SalesForce` class to determine if the email belongs to a customer.  `SalesForce` opens a SOAP request to our salesforce instance.

Now, the assumption is that the form on the web site will only send up to 3 email addresses so this script will only execute a salesforce connection up to three times.  However, if a malicious user has figured out this process, they could modify the form in their browser to send 100 email addresses.  (They could open up multiple tabs and do it many times!)  This could use up all of the resources allocated to this particular application with just one malicious user!  

So, if only up to three email addresses could be sent via the form, some sanity checking could be done with a loop like this:

```php 
<?php
for ($count = 1; $count <= 3; $count++) {
```

This allows one to three instances of the email to be validated.  Do remember that we'll then have to check that the array element exists because this loop is ran three times - even if there is only one email being sent.  (You could break out of the loop if you wanted to early, however.)

But, there is still a flaw with this.  We know that a legitimate request is 1 to 3 emails.  It could be zero based on a browser configuration issue or another code failure.  However, it should never be more than three.  With the first request, we're still executing the filtering on 3 email addresses of maybe 100 that a malicious user is sending in.  But, if a malicious user is running this script, wouldn't we want to run NO email addresses through?

Instead, a Confident Coder is confident of the legitimate bounds of his or her application.  Data out of bounds is not ran until a bounds is reached, it is simply discarded.  So, if we receive 100 email addresses, the proper response is not to run three and discard the rest.  The code should halt the execution immediately.  Note the following code suggestion:

```php 
<?php
// function validateEmail($email) ... function concludes here ...

if (count($_GET['emails')) > 3) {
  header('Invalid set of emails submitted.', true, 500);
  die();
}

// continue with loop here...
```

In this case, we've determined that if the amount of emails being submitted is more than three, the script should not execute any other command and will return an error condition.

#### End Notes

Sanity checking is a deep and in-depth concept to understand and implement.  But starting anywhere is a great first step.  When it comes to web applications, a Confident Coder knows that access to the application is paramount.  He or she does anything necessary to make sure that access can be guaranteed.  In this case, spending time validating that the incoming information falls within acceptable bounds and that the requests are not over-eager is important.  Stop insane values now!

> This entry is republished from the original columns included years ago in the [PHP Architect](http://phparch.com) magazine.  I really recommend purchasing the magazine to get timely articles, columns and PHP news.
