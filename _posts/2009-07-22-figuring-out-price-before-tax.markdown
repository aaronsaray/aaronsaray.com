---
author: aaron
comments: true
date: 2009-07-22 05:12:26+00:00
layout: post
slug: figuring-out-price-before-tax
title: Figuring out Price Before Tax
wordpress_id: 364
categories:
- javascript
tags:
- javascript
---

A lot of the time I give quotes including taxes.  Every once in a while, someone is curious about what the tax is on a service.

I was messing around the other day and came up with this Javascript function.  It takes in the total amount, the tax in percent, and returns the cost before tax.


    
    
    	function figureBeforeTax(amount, tax)
    	{
    		return Math.round((amount)*(100 / (100 + ((tax/100)*100)))*100)/100;
    	}
    
