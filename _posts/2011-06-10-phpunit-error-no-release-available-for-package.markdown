---
layout: post
title: 'PHPUnit error: No release available for package'
tags:
- phpunit
---
One of the steps to install PHPUnit is to execute the following pear commands:
    
    pear channel-discover pear.phpunit.de
    pear install phpunit/PHPUnit

However, after doing that, I got the following error: no release available for package pear.phpunit.de/PHPUnit - and the install failed.  

I decided to execute a remote-list command - it was a thought that maybe I could see if maybe my phpunit declaration was wrong - I was just grasping at straws...
    
    pear remote-list -c phpunit

This finally gave me a worthwhile error! "The value of the config option cache_dir (/tmp/pear/cache) is not a directory and attempts to creat the directory have failed"

So, I finally was successful after the following two commands:
    
    mkdir /tmp/pear/cache
    pear install phpunit/PHPUnit

Moral of the story: check to make sure PEAR has a cache directory available if you can't install a PEAR package.
