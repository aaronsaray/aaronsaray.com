---
author: aaron
comments: true
date: 2010-09-07 14:29:34+00:00
layout: post
slug: modifying-clickheat-to-use-your-authentication
title: Modifying Clickheat to use your authentication
wordpress_id: 673
categories:
- PHP
- web tools
tags:
- PHP
- web tools
---

A nice free open source alternative to Crazy Egg is [ClickHeat](http://www.labsmedia.com/clickheat/index.html).  One of my clients wanted this implemented but didn't want to have to log in again using different criteria.  I looked at the code and saw it was surprisingly easy to edit to allow a different authentication method.  Let's check it out:

First, open up **index.php** in your editor.  Find the statement where it checks to see if the CLICKHEAT_CONFIG file exists.  This should be around line 81.  On the opposite side of this IF statement, it then starts to do the authentication.  It includes the CLICKHEAT_CONFIG file.  Then, it checks to see if isset($_COOKIE).

Above the isset() call and below the clickheat config include, put your custom code.  The important line is to define CLICKHEAD_ADMIN.
For example, you could do this:


    
    
    include CLICKHEAT_CONFIG;
    
    if ($_SESSION['userIsAdmin']) {
      define('CLICKHEAT_ADMIN', true);
    }
    else {
     die(header('/normalLoginPage.php'));
    }
    



Then, you can remove - or comment - the code block that starts with

    
    
    if (isset($_COOKIE['clickheat']))
    



all the way down to the end of that IF statement... it ends at these lines:

    
    
    	}
    	$__action = 'login';
    }
    



This should now allow the script to use your authentication system and not its own.
