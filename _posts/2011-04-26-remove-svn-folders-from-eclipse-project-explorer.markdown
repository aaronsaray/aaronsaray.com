---
author: aaron
comments: true
date: 2011-04-26 14:16:15+00:00
layout: post
slug: remove-svn-folders-from-eclipse-project-explorer
title: Remove .svn folders from Eclipse Project Explorer
wordpress_id: 843
categories:
- Eclipse PDT
- IDE and Web Dev Tools
- svn
tags:
- Eclipse PDT
- IDE and Web Dev Tools
- svn
---

It had been irritating to me seeing the .svn folders littered throughout my project workspace.  In addition, they all show up in the search results... this can be irritating with the svn-base files that show the old version of the file before a commit.

Well never fear: there is a quick solution.  

Open up eclipse and right click on your project in the workspace.  
Choose Properties and then select resource.  Add a resource filter of type 'exclude'
Enter the .svn folder name and click OK.  

You should no longer see the .svn resources in your project.
