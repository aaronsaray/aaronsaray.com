---
author: aaron
comments: true
date: 2015-03-12 20:06:26+00:00
layout: post
slug: getting-variable-values-from-nested-twig-symfony-custom-template
title: Getting variable values from nested twig / symfony custom template
wordpress_id: 1800
categories:
- PHP
- symfony
tags:
- PHP
- symfony
---

Today, I was working with a custom form themed symfony / twig project.  The previous developer had developed a bootstrap based theme (yes, this is an older symfony project at this moment - I think this is a bundled theme now).  I was struggling with the block **field_row** item.  Inside of this, there was a call to **form_label** passing in just the form view again.  I was setting a custom label on the form_row() call in the main template, but nothing was happening.

_I should mention... I'm just learning this particular integration, plus this is slightly old code, so I may be partially right in my entry.  If I have something wrong, please comment!  I'd love to learn.  But, I wanted to post this because I couldn't find the answer myself._

In my **edit.html.twig** file, I had the following:

    
    
    {{ form_row(form.myItem, {'label': 'My special label'}) }}
    



It wasn't grabbing my output in the custom template.  The template excerpt looked like this...


    
    
    {% block field_row %}
     
        <div class="{{ div_class }}">
            {{ form_label(form) }}
            <div class="controls">
                {{ form_widget(form, _context) }}
                {{ form_errors(form) }}
            </div>
        </div>
     
    {% endblock field_row %}
    



In this case, the form variable passed to form_label did not have my custom variable on it.  _Caveat: it looks like its a form render view object, but I don't quite yet follow why this matters..._  Anyway, I tried using **form.get('label')** but that didn't work.

Turns out, the **_context** array had the values for this particular element.  So, I modified:


    
    
            {{ form_label(form, _context['label']) }}
    



Yay!  That got the standard label - or the custom label I set.  Success.
