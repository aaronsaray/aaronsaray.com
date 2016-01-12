---
author: aaron
comments: true
date: 2010-07-13 20:18:08+00:00
layout: post
slug: using-google-charts-to-make-qr-codes
title: Using Google Charts to make QR Codes
wordpress_id: 652
categories:
- javascript
- jquery
- Misc Web Design
tags:
- javascript
- jquery
- Misc Web Design
---

[caption id="" align="alignright" width="150" caption="QR Code for this page"]![QR Code for this page](http://chart.apis.google.com/chart?chs=150x150&cht=qr&chl=http://aaronsaray.com/blog/2010/07/13/using-google-charts-to-make-qr-codes/&choe=UTF-8)[/caption]Google Charts is my hero yet again.  This time, I happened to notice that they have a chart in their API for QR Codes.  Considering I was just searching google for a PHP class to do this, I was pretty ecstatic.

To implement, I made a quick line of jQuery to generate my QR Codes.  Of course, I did this after the page loaded :)  My goal was to generate a QR code for the page that the user is currently viewing.  Pretty simple:


    
    
    $("#qrImage").attr('src', 'http://chart.apis.google.com/chart?chs=150x150&cht;=qr&chl;=' + escape(window.location.href) + '&choe;=UTF-8');
    



You can find all of the details and other parameters here: [http://code.google.com/apis/chart/docs/gallery/qr_codes.html](http://code.google.com/apis/chart/docs/gallery/qr_codes.html)
