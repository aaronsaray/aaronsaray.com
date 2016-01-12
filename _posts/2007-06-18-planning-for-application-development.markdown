---
author: aaron
comments: true
date: 2007-06-18 01:33:17+00:00
layout: post
slug: planning-for-application-development
title: Planning for application development
wordpress_id: 9
categories:
- Website Monitoring Project
---

In my "younger years" in the coding world, I'd have an idea like I have right now with the website monitoring project - and immediately start coding.  I'd get the framework done, implement a feature or two, and then finally start thinking about my requirements.  Predictably, the code would turn into an unmaintainable mountain of crap - and I'd be wasting more time rewriting and refactoring than I wanted.  For this project, I decided to take steps against this happening.

<!-- more -->

Its very important to plan and design out all of the main ideas of the projects you take on - especially if you're going to be making an open source project.  How depressing it is to see the reputation of PHP or OSS in general tarnished by projects which aren't planned thoroughly.  In recent blog entries, I've been noticing more and more backlash against the PHP community because of the large amount of crappy scripts released into the community - and I wholeheartedly believe this is a problem of planning.  I wanted to make sure my project did not bear this stigma.

There are many mind-mapping tools out there - some open source and some not (some as simple as notepad ;)) - and maybe "next time" I'll use some - but my tool for this project is a 5 subject notebook.  [A previous entry of mine](http://aaronsaray.com/blog/2007/06/12/website-monitoring-project/) detailed out the questions I've been needing to answer to move forward with this project...  and I'm making progress.  The next step in my planning is actually making a bulleted list of the items that I'm going to have to address when working on this project.  I had a high level outline listed above, but I went into more detail now.



### The first thing: define the idea.



I broke down my idea into bullet points and main headings:



	
  * Plugin based site monitoring

	
    * Make a set of default plugins

	
      * Uptime Monitoring

	
      * HTTP Response

	
      * Broken Links

	
      * Tests hosted with xml results







	
  * Logging

	
    * log results to...

	
      * mysql

	
      * sqlite

	
      * flat file

	
      * syslog/event viewer (depending on OS?)







	
  * Alerting

	
    * email

	
    * web page

	
    * RSS / XML

	
    * REST services?




	
  * Schedule

	
    * alert scheduling

	
    * plug in scheduling

	
    * cron/img loading?




	
  * Self tests

	
    * Connection diagnostics

	
    * Versions of PHP/mysql

	
    * updates to the system itself





Additionally, I took apart each one of these modules and listed out my concerns on each... and the things I'd need to learn and figure out - so more indepth.

The commonalities I came up with was the Self tests are very important (ie: don't fail a test if there is no connection to the internet or if the versions of PHP don't match), alert specificity (ie: do we alert right away, or are there multiple tests performed on a failed test... so to reduce false positives), do we alert on successes, are alerts customized by plugin, agent configuration, etc).



### I have to make my lists of things to do...



So, so far, I've built a list of things to research into before I actually start:



	
  * Refactoring of PHP

	
    * concepts and possible automated methods?




	
  * Best IDE to use

	
    * Zend Studio

	
    * PDT

	
      * tutorials for each







	
  * Debugging in the IDE

	
  * Test writing using TDD

	
    * IDE integration?




	
  * Community tracking software

	
    * trac

	
    * subversion public/private repositories

	
    * wiki and message board support




	
  * User testing interfaces

	
    * auto fill form module for firefox

	
    * selenium?




	
  * PHP Doc / JS Doc

	
    * I already know these - but automated extras?

	
    * docbook tutorials?

	
    * Is there one for CSS?




	
  * Coding Standards

	
    * review PEAR coding standards and possibly adopt for me





So this is a large list of items that I have to do before I actually start on the coding.

So far, I've been researching into PHP Refactoring.  I plan to move on to researching any automated PHP refactoring, and then more.  My immediate to-do list is:

	
  * Automated PHP refactoring

	
  * IDE trials coupled with debugging in the IDE

	
  * Unit testing (PHPUnit or Simple test)


