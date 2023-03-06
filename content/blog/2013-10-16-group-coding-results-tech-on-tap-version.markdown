---
layout: post
slug: group-coding-results-tech-on-tap-version
title: 'Group Coding Results: Tech on Tap Version'
tags:
- php
---
I actually very much enjoy spreading “the word” on PHP. I go to a lot of conferences, and present a lot. One of the most interesting concepts I've developed lately, however, is not a presentation but more of a group coding session. This is how it goes...

I put my IDE up on the projector and present a challenge to the group of PHP coders. We solve the problem presented on the screen using the most basics of HTML, CSS, and javascript. Who cares if it looks nice? We're not doing client side validation here. But here's the kicker: solve the problem using plain, vanilla PHP. No frameworks, no libraries, only plain PHP and probably php.net searches. So, I present the problem, and then the group chimes in. Inevitably, it starts out slow, but momentum builds. Before you know it, its a spirited discussion of pro's and con's of doing things in various ways. Once the problem is solved, I run a number of pre-arranged tests against the code, making sure it functions as specified, meets the criteria, and is secure.

Recently, I was invited up to [Tech on Tap](http://www.techontap.org/) in Appleton to do this group coding challenge. We did the tasks, and had reasonable success. However, not that my way is ‘the best' per se, but I promised that I'd send them my version of solving this problem in plain vanilla PHP. Nothing too over the top – just something I could knock out in 30 minutes max.

So, without further delay, here is the challenge:

    Challenge: Send a plain text email to a website owner.
     
    The following fields are required:
    - Sender's Name
    - Sender's Email
    - Message
     
    Special Challenge Instructions:
    Should never generate the Webpage Expired message.
    
Now, I'm not going to post what the group came up with. That's not a good reflection of a final product (it was a new and exciting experience, plus I did not allow time to refactor – so it was what it was.)

However, here is my quick and dirty version of doing this in plain PHP. I made sure to do this in under 30 minutes, play the TV and music loudly (to mimic distractions like that are in a group setting) and even had an IM conversation. There are a number of refactors I'd do now that I look at this after I did it but I wanted to be fair and show you exactly what I would have made. :)

**Please note: those who randomly troll for code – this is not the best code example – it was a ‘challenge'**

**`index.php`**
```php
<?php
session_start();
 
// helpful constant for my session
const SESSION_NAMESPACE = 'CONTACT_MESSAGE_ERRORS';
 
// retrieves the error for me
function getErrorForField($fieldName)
{
  return isset($_SESSION[SESSION_NAMESPACE][$fieldName]) 
         ? $_SESSION[SESSION_NAMESPACE][$fieldName] 
         : '';
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <style>
    label {
      display: block;
      margin-bottom: 1em;
    }
    textarea {
      vertical-align: middle;
    }
  </style>
</head>
<body>
  <h1>Contact Us</h1>
  <form action="process.php" method="post">
    <label>
      Your name: <input name="name" required type="text">
      <?php 
        $error = getErrorForField('name'); 
        if ($error) echo '<span class="error">' . $error . '</span>'; 
      ?>
    </label>
    <label>
      Your email: <input name="email" required type="email">
      <?php 
        $error = getErrorForField('email'); 
        if ($error) echo '<span class="error">' . $error . '</span>'; 
      ?>
    </label>
    <label>
      Tell us this:<textarea name="message" required></textarea>
      <?php 
        $error = getErrorForField('message'); 
        if ($error) echo '<span class="error">' . $error . '</span>'; 
      ?>
    </label>
    <label>
      Now, click send: <input type="submit" value="Send Message">
	</label>
  </form>
</body>
</html>
```

and then the processing page

**`process.php`**
```php
<?php
// sanity constants
const NAME_MAX_LENGTH = 100;
const MESSAGE_MAX_LENGTH = 65000;
 
// helpful constant for my session
const SESSION_NAMESPACE = 'CONTACT_MESSAGE_ERRORS';
 
// the person we're sending to
const WEBSITE_OWNER_TO_ADDRESS = 'aaron@aaronsaray.com';
 
// start session and clear out any old information
session_start();
$_SESSION[SESSION_NAMESPACE] = array();
 
// method will store any errors in the session 
// and then take back to the processing page
function storeErrorsAndRedirect(array $errors = array())
{
  $_SESSION[SESSION_NAMESPACE] = $errors;
  die(header('Location: index.php'));
}
 
// not a post
if (!isset($_SERVER['REQUEST_METHOD']) || $_SERVER['REQUEST_METHOD'] !== 'POST') {
  storeErrorsAndRedirect();
}
 
// initialize my error storage
$errors = array();
$clean = array();
 
// name must be set and not too long
if (empty($_POST['name'])) {
  $errors['name'] = 'A name is required.';
}
else if (strlen($_POST['name']) > NAME_MAX_LENGTH) {
  $errors['name'] = 'This name is a bit too long - is that your real name?';
}
else {
  $clean['name'] = filter_var(
                              $_POST['name'], 
                              FILTER_SANITIZE_STRING, 
                              FILTER_FLAG_STRIP_LOW
                              );
}
 
// must be set and then be a valid email
if (empty($_POST['email'])) {
  $errors['email'] = 'An email is required.';
}
else if (!filter_var($_POST['email'], FILTER_VALIDATE_EMAIL)) {
  $errors['email'] = 'Please enter a valid email.';
}
else {
  $clean['email'] = filter_var($_POST['email'], FILTER_SANITIZE_EMAIL);
}
 
// must be not empty and not too long
if (empty($_POST['message'])) {
  $errors['message'] = 'Please enter a valid message.';
}
else if (strlen($_POST['message']) > MESSAGE_MAX_LENGTH) {
  $errors['message'] = 'Can you shorten the message just a little bit? '
                     . 'Perhaps a phone call would work?';
}
else {
  $clean['message'] = filter_var($_POST['message'], FILTER_SANITIZE_STRING);
}
 
// if errors, store and get outttah here
if (!empty($errors)) {
  storeErrorsAndRedirect($errors);
}
 
// now we have good, clean data, generate the message
$from = sprintf('%s <%s>', $clean['name'], $clean['email']);
$subject = "Contact form from {$clean['name']}";
$message = "You received a contact form from the website!  Yay!\n\n";
$message .= "Sender: {$from}\n";
$message .= "Message:\n";
$message .= $clean['message'];
 
mail(WEBSITE_OWNER_TO_ADDRESS, $subject, $message, "From: {$from}");
 
die(header('Location: success.php'));
```

Note: I did not create a success page.

### The break down

I believe this handled all of the issues. Looking back, I'd have liked to make it more usable – put the user data back in the form when there was an error, etc. But the main goals are achieved:

- This code will not generate an expired message
- Never work with unsanitized data
- Use the built in PHP tools that you have
- Give context to errors
- Don't allow insane values – who has a name that is 6 billion chars long?
- Like I said, I'd refactor and do this again. In fact, maybe some day that would be a good presentation – start out with a piece of code and refactor it until its relatively perfect?

Feel free to comment/ask questions. Thanks!
