---
author: aaron
comments: true
date: 2010-08-03 14:56:14+00:00
layout: post
slug: hide-email-addresses-while-still-using-mailto-header-redirect
title: 'Hide Email Addresses while still using mailto: Header Redirect'
wordpress_id: 669
categories:
- PHP
tags:
- PHP
---

Everyone I've spoken to recently no longer puts mailto:// links in their code for fear that the owner of that address will get more spam.  However, there are still legitimate uses for a link like this.  In order to foil very simple email parsing bots, I've come up with the following script.

Let's say you have the website http://blahblah.com - and on that website, user joe would like to have his email address of joe@blahblah.com accessible via a mailto:// link.  He doesn't want people to use a contact form - but doesn't want spam either.  I would form his e-mail link in the following manner:


    
    
    And, if you would like to contact joe, you can <a href="email.php?user=joe">email joe</a> directly.
    



The content of the PHP file would be the following:

    
    
    $user = isset($_GET['user']) ? $_GET['user'] : '';
    
    if ($user) {
    	$email = $user . '@' . $_SERVER['SERVER_NAME'];
    	header("Location: mailto://{$email}");
    }
    else {
    	header('HTTP/1.0 404 Not Found');
    }
    



This simply forms the proper e-mail address from the user get parameter and sends back a different redirect.  The thought is simple email scrapers will not detect it as an email address and will leave the 'link' alone.

Final thought: if your site requires javascript, you could put an onclick handler on the link to send another parameter along with the script.  The script could then verify that the onclick has happened by checking the presence of the additional GET parameter.  If it is not present, it could be attributed to a bot (that doesn't handle javascript, hopefully) - and not provide the e-mail address.
