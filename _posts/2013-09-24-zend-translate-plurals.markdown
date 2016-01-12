---
author: aaron
comments: true
date: 2013-09-24 21:31:15+00:00
layout: post
slug: zend-translate-plurals
title: Zend Translate Plurals
wordpress_id: 1613
categories:
- zend framework
tags:
- zend framework
---

I know it should be pretty common sense to RTFM - but sometimes you miss things.

This one buggered me for a while...

How to do Zend Translate Plurals in ZF 1.x...  [Very simply, the manual](http://framework.zend.com/manual/1.12/en/zend.translate.plurals.html) tells us how.

But for those too lazy to click through...


    
    
    $translate = new Zend_Translate($options);
    echo $translate->translate(array('chicken', 'chickens', $numberOfChickens));
    



Yup.  Very simple.  

