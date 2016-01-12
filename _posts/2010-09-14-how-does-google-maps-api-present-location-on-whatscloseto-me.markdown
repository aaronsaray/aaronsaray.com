---
author: aaron
comments: true
date: 2010-09-14 20:26:40+00:00
layout: post
slug: how-does-google-maps-api-present-location-on-whatscloseto-me
title: How does Google Maps API present location on whatscloseto.me
wordpress_id: 699
categories:
- Misc Web Design
tags:
- Misc Web Design
---

I get a few questions here and there about the location detection on [whatscloseto.me](http://whatscloseto.me).  Sometimes it seems really near - other times it seems way off.

First off, check out [this section](http://code.google.com/apis/ajax/documentation/#ClientLocation) of the Google Maps AJAX API.  That's how I determine the location.  When no location can be found, I set the location to Milwaukee, WI - because that's where I am from.  Pretty simple.
