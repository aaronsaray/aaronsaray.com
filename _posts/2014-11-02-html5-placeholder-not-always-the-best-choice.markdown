---
layout: post
title: 'HTML5 Placeholder: Not Always the Best Choice'
tags:
- html
- Misc Web Design
---

One of the applications my team develops is used by a group that we've determined to be very much beginners at computer usage and internet comprehension.  We attempt to make the product as intuitive as possible - while staying away from the newest trends.  I don't believe our place is to challenge their current notion of what websites do at this time.  We stay a bit behind the curve because they need to use this application to solve a task.  The task is already hard enough, we shouldn't be pushing them past their comfort zones.

Because of a bug in the programming, we noticed we weren't trimming the user input for a search form.  A large amount of search terms began with at least one space.  So, we fixed that issue - we added trim.  

But, why were there so many space prepended search terms?

At first, I thought maybe it was copy and paste terms.  Perhaps they were copying and pasting items into the field.  But, if that were the case, logic would tell us that there would be at least a somewhat proportional amount of space appended terms.  But there were hardly any.  What could be causing this?

Our best guess now is the HTML5 placeholder attribute on the search term.  When you click in the input box to do a search, the placeholder says something like 'Search product name' - and it doesn't disappear until you've typed your first character.  (Before html5 placeholders, most javascript libraries used to remove the placeholder on focus.  I actually liked that, but... anyway...)  So, our best guess is that our users hit space to clear out that term that they don't want to search, and then type their own.
