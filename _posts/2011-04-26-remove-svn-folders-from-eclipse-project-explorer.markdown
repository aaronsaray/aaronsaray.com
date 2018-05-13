---
layout: post
title: Remove .svn folders from Eclipse Project Explorer
tags:
- eclipse-pdt
- ide-and-web-dev-tools
---
It had been irritating to me seeing the .svn folders littered throughout my project workspace.  In addition, they all show up in the search results... this can be irritating with the `svn-base` files that show the old version of the file before a commit.

Well never fear: there is a quick solution.  

* Open up eclipse and right click on your project in the workspace.  
* Choose Properties and then select resource.  Add a resource filter of type 'exclude'
* Enter the .svn folder name and click OK.  

You should no longer see the `.svn` resources in your project.
