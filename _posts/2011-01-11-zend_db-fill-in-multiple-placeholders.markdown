---
author: aaron
comments: true
date: 2011-01-11 16:45:56+00:00
layout: post
slug: zend_db-fill-in-multiple-placeholders
title: Zend_db fill in multiple placeholders
wordpress_id: 762
categories:
- zend framework
tags:
- zend framework
---

I've been using Zend_db to create a query which does a simple search on three columns of a table.  Fortunately, I found out that the where() statement handles single parameters intelligently when there are multiple placeholders.  In the case that there are many placeholders but only one parameter, that parameter will be added to each of the placeholders the same.

For example, see this statement:


    
    
    $select->where('email like ? OR first_name like ? OR last_name like ?', array('%' . $q . '%'));
    
