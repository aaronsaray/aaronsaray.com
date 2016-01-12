---
author: aaron
comments: true
date: 2014-10-25 15:31:02+00:00
layout: post
slug: jquery-code-to-manage-check-all-uncheck-all-checkboxes
title: jQuery code to manage check all / uncheck all checkboxes
wordpress_id: 1763
categories:
- html
- jquery
tags:
- html
- jquery
---

At work the other day, our designer created an interface that had multiple checkboxes, and then of course a check-all checkbox.  The thought was that if you check the check-all box, all items become checked.  When our QA person started testing the interface, I noticed that a child item unchecked let the check all box remain checked.  I explained to the programmer and QA person that this was not the desired outcome.  As soon as one checkbox is unchecked, the checkall should now be unchecked.  In addition, if you check all children by hand, the checkall should automatically check itself.  

At first some people on the team seemed quizzical or argued.  They said that they didn't think this was the action that should happen.  I explained that the experience was that the checkbox checked meant all items are checked - if it was not checked, that meant at least one child was not checked.  I explained that this was the default action of this interface design.  

After we made the changes, they all agreed that the new functionality was as expected.  I thought it was interesting that this particular user experience was so well done in so many places that the programmers and qa person had not even noticed it.  (Interesting thought for UX people - when you do your job right, the user might not even notice!)  

So I created a snippet of jQuery to handle this featureset for the team in a generic method.  You'll see this below.



### Instructions



Create a checkbox that is your checkall control.  Give it a data attribute of 'checkall-control' and have the value be the group name of the children checkboxes.  On each child box that should be controlled by the checkall, give it a data attribute of 'checkall-group' witht he name of the group that it belongs to.  Then, the jQuery will handle the rest.



### The Code



Here is the jQuery snippet to handle the requested functionality.


    
    
    $('input[data-checkall-control]').each(function(){
        var $checkAll = $(this);
        var $children = $('input[data-checkall-group="' + $checkAll.data('checkall-control') + '"]');
     
        $checkAll.on('click', function() {
            if ($checkAll.is(':checked')) {
                $children.prop('checked', true);
            }
            else {
                $children.prop('checked', false);
            }
        });
     
        $children.on('click', function() {
            if ($children.filter(':checked').length == $children.length) {
                $checkAll.prop('checked', true);
            }
            else {
                $checkAll.prop('checked', false);
            }
        });
    });
    



Here is an example of the input boxes that this would control.


    
    
    <table>
        <tr>
            <th><label><input type="checkbox" data-checkall-control="group1">Check All</label></th>
            <th>Option</th>
        </tr>
     
        <tr>
            <th><input data-checkall-group="group1" type="checkbox" name="checkme[]" value="1"></th>
            <th>Value 1</th>
        </tr>
        <tr>
            <th><input data-checkall-group="group1" type="checkbox" name="checkme[]" value="2"></th>
            <th>Value 2</th>
        </tr>
        <tr>
            <th><input data-checkall-group="group1" type="checkbox" name="checkme[]" value="3"></th>
            <th>Value 3</th>
        </tr>
        <tr>
            <th><input data-checkall-group="group1" type="checkbox" name="checkme[]" value="4"></th>
            <th>Value 4</th>
        </tr>
    </table>
    
