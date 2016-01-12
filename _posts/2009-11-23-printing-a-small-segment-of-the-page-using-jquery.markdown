---
author: aaron
comments: true
date: 2009-11-23 20:25:16+00:00
layout: post
slug: printing-a-small-segment-of-the-page-using-jquery
title: Printing a small segment of the page using JQuery
wordpress_id: 433
categories:
- CSS
- javascript
tags:
- CSS
- javascript
---

Using Yahoo's Grid Tools, I created a pretty decent page layout.  After all this was complete, I needed to generate a printable version of only a portion of the site.  This was a particular set of instructions.  I decided to tackle this with JQuery.



## The Setup


The page was created with Yahoo's Grids.
There were 4 sets of instructions on the site.
Each instruction had its own box containing the content - as well as a 'print this' link.
Users were liable to click the wrong link - and have to do it again.



## The Code


The following is the JQuery I wrote to solve my problem:

    
    
    	$(".printinstructions").click(function(){
    		$('.instructionalli').remove();
    		var box = $(this).parent();
    		$("<style media="print" type="text/css">#bd,#ft,#nav,#hd{display: none}a.printinstructions{display:none}.instructionalli{display:block}</style>").appendTo($('head'));
    		$(box).clone().insertAfter($('body')).addClass('instructionalli');
    		window.print();
    		return false;
    	});
    



This is what the content may have looked like:

    
    
    <div>
    <a href="#" class="printinstructions">Print These</a>
    <ol>
    <li>Do Step 1</li>
    <li>Do Step 2</li>
    </ol>
    </div>
    
    





## The Explanation


First, any time a link with the class 'printinstructions' is clicked, the function launches.  The first line in the function is responsible for undoing this process I'm about to describe.  This is necessary just in case someone clicked the 'print' button earlier on the wrong element by accident.

The first step is to get the parent container.  This is the content that we're going to make our only printed content.

Next, create a new stylesheet that makes everything "display: none" except for the body itself.  The media type is print.  Finally, it does make the class "instructionalli" "display: block".  (Note: I could have just as easily attached the page in the source... but I needed to only have this activate if the print button was clicked).

The final step is to clone the box (that is inside of something that is 'display: none') and add that after the body content.  Then, add the "display: block" class to it.  Finally the window.print() method is invoked.  For the most part, the user will have no idea any of this happened.  The final result is a printed version of the instruction's box content only.
