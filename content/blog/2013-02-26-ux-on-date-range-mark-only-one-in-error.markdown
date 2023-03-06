---
title: 'UX: On date range, mark only one in error'
date: 2013-02-26
tags:
- misc-web
- ux
---
In one of our applications, an event system requires a start and end date.  There is validation to check to make sure the end date is after the start date.

<!--more-->

A member of my team was creating the error messages for this routine and marked an error on both date input boxes with a message saying that the end date must be after the start date.  

I told him this violates the user experience.  Let me explain why.

He was correct that the start date must be before the end date.  Or the end date must be after the start date.  Right there, that is the error.  So, what we find out is that there is only one date in error.  One of the dates is correct, and the other one is in error because of the relationship it has to the first.  Both dates are not wrong, they can't be.

He was marking both boxes as error which indicates to the user that 100% of their input was wrong.  It's like saying "well, because you didn't put your end date after your start date, both your start date AND your end date is wrong."  Really, it should say "Because you didn't put your end date after your start date, your end date is wrong."  That marks only the one that is wrong, wrong.  They are 50% wrong.  

Finally, should the start date or the end date be marked as the one incorrect?  I vote that it is the end date.  Most likely, people think of events from their start date, so they are much more likely to put the start date correctly.  Think about it this way: the next time you have a week of vacation, do you think of it as the week that starts on Monday, or the week that ends on Friday?  Chances are, you think of it as the Monday week - so your start date is the one that's most likely correct.  So, you should choose the end date as the one that is most likely incorrect.
