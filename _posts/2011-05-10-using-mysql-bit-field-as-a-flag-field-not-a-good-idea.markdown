---
author: aaron
comments: true
date: 2011-05-10 15:09:17+00:00
layout: post
slug: using-mysql-bit-field-as-a-flag-field-not-a-good-idea
title: 'Using MySQL Bit Field as a Flag Field: Not a Good Idea'
wordpress_id: 856
categories:
- mysql
tags:
- mysql
---

The last time I created a char(1) for a flag field, I remembered the MySQL BIT field - so I did a bit of investigation.  I thought, well if I can make a bit field of one bit that is either 0/1, I can save data space in my db.

I created the table like this:

    
    
    CREATE TABLE `test` (b BIT(1));
    



In order to place data in a BIT field, you must prefix it with b and have the bit value between quotes.  So, I did the following test:

    
    
    insert into test set b=b'1'
    insert into test values(b'0')
    select * from test
    



Unfortunately, when I did this, I got only 'b' as a response from each of those.  Then I thought, maybe it needed to store 'b' and 1 bit was not enough to store both the identifier of 'b' as well as the content (mind you, one would think the identifier wouldn't be in the data.. I'm just grasping at straws). I drop/create with a 2 bit item.  Nope. Increase it to 8, still nope.

Every time I do a selection, I only get b's.  Maybe I'm doing something wrong.


    
    
    SHOW VARIABLES LIKE "%version%";
    



    
    5.1.41-3ubuntu12.6



So it should be a supported version...

Finally, I started to think - even if I got this to work, when I'm exporting data, would it have the 'b' in the identier field?  If so, that might make it harder to create imports/exports.  I really just want a 0/1,  a Y/N.  

If anyone can show me what I'm doing wrong, that would be awesome.  For now, I'm sticking with char(1).




