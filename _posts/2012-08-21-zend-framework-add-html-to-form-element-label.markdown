---
author: aaron
comments: true
date: 2012-08-21 14:01:46+00:00
layout: post
slug: zend-framework-add-html-to-form-element-label
title: 'Zend Framework: Add HTML to form element label'
wordpress_id: 1257
categories:
- zend framework
---

By default, the labels of form elements in Zend Form are escaped.  Sometimes, like in check mark boxes for Terms of Use, it makes sense to add some HTML to this.  You can turn off escaping - but just be careful!  

**Example:**

    
    
    $this->getElement('agreetos)->getDecorator('Label')->setOption('escape', false);
    



So, there you go - you can now add a link to that label.
