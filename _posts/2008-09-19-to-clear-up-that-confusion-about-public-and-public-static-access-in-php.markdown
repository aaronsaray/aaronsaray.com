---
author: aaron
comments: true
date: 2008-09-19 15:08:37+00:00
layout: post
slug: to-clear-up-that-confusion-about-public-and-public-static-access-in-php
title: To clear up that confusion about public and public static access in PHP
wordpress_id: 163
categories:
- PHP
tags:
- PHP
---

Apparently, a few programmers I know have been getting confused about access of public, public static variables in PHP classes.  I've written this example code with the following comments to explain what will work - and what won't.


    
    
    pubvar);
    
            /** this also works **/
            var_dump(self::$pubvarstatic);
    
            /** this would not - no error **/
            var_dump($this->pubvarstatic);
        }
    
        public static function statictest()
        {
            /** this works - static accessing a static **/
            var_dump(self::$pubvarstatic);
    
            /**
             * this does not work - static has no business accessing a non static class var
             * generates error:
             * Fatal error:  Access to undeclared static property:  TEST::$pubvar
             */
            var_dump(self::$pubvar);
        }
    }
    print "
    
    ";
    
    /** for testing __construct() **/
    new TEST;
    
    /** this works - public static access **/
    var_dump(TEST::$pubvarstatic);
    
    /** for testing static method statictest() **/
    TEST::statictest();
    
    
