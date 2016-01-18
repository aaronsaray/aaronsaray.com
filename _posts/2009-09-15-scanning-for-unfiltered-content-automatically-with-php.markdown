---
layout: post
title: Scanning for Unfiltered Content Automatically with PHP
tags:
- PHP
- security
---

A friend of mine posed a question: Do you know of any good PHP based vulnerability scanners?  I told him I did not (add any in the comments, if you know! :) ) - but it wouldn't be that hard to build one.  He asked me to give him a code example, so here goes:

#### The Goals

I have only 2 goals to accomplish with this quick script:


  * Should handle multiple forms on a web page


  * Should be able to submit a payload and automatically review if it is shown unfiltered.



Since this is just a quick script, we do know a few things however:


  * It will not handle javascript based forms that set the action to something different.


  * It doesn't specifically help identify which form field is the vulnerable one.


But with that, its not that bad.

#### The example website we're reviewing

I have two really simple pages for our test site, the form itself and the 'login' page.

**testform.html**

{% highlight HTML %}
<html>
    <head>
        <title>Test Login Form, yo</title>
    </head>
    <body>
        <h1>Oh HAI!</h1>
        <p>Login or no?</p>
        <form action="http://localhost/testsubmit.php" method="post" name="login">
            Username: <input type="text" name="username"></input><br></br>
            Password: <input type="password" name="password"></input><br></br>
            <input type="submit"></input>
        </form>
    </body>
</html>
{% endhighlight %}
    

**testsubmit.php**

{% highlight PHP %}
<?php
if ($_POST['username'] == 'MYUSER' && $_POST['password'] == 'MYPASS') {
    print 'you have logged in';
}
else {
    print "{$_POST['username']} did not authenticate correctly.";
}
{% endhighlight %}


As you can see, if the login credentials are not correct, it prints the unfiltered username onto the screen.  Obviously, this is a very simple example.


#### The PHP Script


The comments should help the interpretation of this script, so I won't ramble...

{% highlight PHP %}
<?php
/** set target, payload **/
$target = 'http://localhost/testform.html';
$payload = '<script>alert("word!");</script>';

/** get content, create dom document with it **/
$targetContent = file_get_contents($target);
$doc = new DomDocument();
$doc->loadHTML($targetContent);

/** get all the forms, iterate through each **/
$forms = $doc->getElementsByTagName('form');

foreach ($forms as $form) {
    $submitInputs = array();
    $submitTo = $form->getAttribute('action') ? $form->getAttribute('action') : $target;
    $submitMethod = $form->getAttribute('method') ? $form->getAttribute('method') : 'GET';

    /** get all inputs so we can set the values **/
    $tagsToParse = array('input', 'textarea');
    foreach ($tagsToParse as $tag) {
        $retrieved = $form->getElementsByTagName($tag);
        foreach ($retrieved as $item) {
            /** get the value - we want to retain whats in there just in case... **/
            $value = $item->getAttribute('value') ? $item->getAttribute('value') : '';
            $value .= $payload;
            $submitInputs[$item->getAttribute('name')] = $value;
        }
    }

    print '<h2>Submitting payload to form: ' . $form->getAttribute('name') . '</h2>';

    /** got our content, prepare for submission, get submitted content **/
    $opts = array('http'=>array('method'=>strtoupper($submitMethod),
                                'header'=>'Content-Type: application/x-www-form-urlencoded',
                                'content'=>http_build_query($submitInputs)));
    $context = stream_context_create($opts);
    $submittedFormContents = file_get_contents($submitTo, false, $context);

    /** find the payload ? **/
    $count = substr_count($submittedFormContents, $payload);
    print "Times payload found: {$count}<br></br>";
}
{% endhighlight %}

As you can see, still very simple, but it lays the groundwork.  Combine this with my [link checking code](/blog/2008/03/19/link-checking-module-1st-attempt/) and you could make a pretty decent start on a PHP vulnerability scanner.
