---
layout: post
title: MySQL Explain rows column really IS an estimate
tags:
- mysql
---

Here is an interesting proof of concept that the 'rows' column of the explain output is actually an estimate, and not the real amount.  I KNEW it to be true, but somehow I didn't feel like it was right.  I always thought "the closer the rows # gets to the exact amount of retrieved data, the better.  Exact is what you strive for."  Turns out, that's not true.  The closer the number, the better, but its still just an estimation.  Sometimes its estimated accurately, other times its not.  See this example:
    
    mysql> select * from city;
    +----+-------------+
    | id | name        |
    +----+-------------+
    |  1 | chicago     |
    |  2 | springfield |
    +----+-------------+
    2 rows in set (0.00 sec)
    
    mysql> select * from state;
    +----+------+
    | id | name |
    +----+------+
    |  1 | IL   |
    |  2 | WI   |
    |  3 | MO   |
    |  4 | WA   |
    +----+------+
    4 rows in set (0.00 sec)
    
    mysql> select * from citystate;
    +--------+---------+
    | idcity | idstate |
    +--------+---------+
    |      1 |       1 |
    |      1 |       2 |
    |      1 |       3 |
    |      2 |       1 |
    |      2 |       2 |
    |      2 |       3 |
    |      2 |       4 |
    +--------+---------+
    7 rows in set (0.00 sec)
    
    mysql> select city.name, state.name from citystate  join city on city.id=citystate.idcity  join state on state.id=citystate.idstate  where state.name='IL';
    +-------------+------+
    | name        | name |
    +-------------+------+
    | chicago     | IL   |
    | springfield | IL   |
    +-------------+------+
    2 rows in set (0.00 sec)
    
    mysql> explain select city.name, state.name from citystate  join city on city.id=citystate.idcity  join state on state.id=citystate.idstate  where state.name='IL'\G;
    *************************** 1. row ***************************
               id: 1
      select_type: SIMPLE
            table: city
             type: ALL
    possible_keys: PRIMARY
              key: NULL
          key_len: NULL
              ref: NULL
             rows: 3
            Extra: 
    *************************** 2. row ***************************
               id: 1
      select_type: SIMPLE
            table: citystate
             type: ALL
    possible_keys: NULL
              key: NULL
          key_len: NULL
              ref: NULL
             rows: 7
            Extra: Using where; Using join buffer
    *************************** 3. row ***************************
               id: 1
      select_type: SIMPLE
            table: state
             type: eq_ref
    possible_keys: PRIMARY
              key: PRIMARY
          key_len: 4
              ref: foxone.citystate.idstate
             rows: 1
            Extra: Using where
    3 rows in set (0.00 sec)
    
hahah!  3 rows in city is what it estimates...

Interestingly enough, however, if you add an index...
    
    ALTER TABLE `city` ADD INDEX `name_idx` (`name` ASC);

It is reflected accurately now.
    
    *************************** 1. row ***************************
               id: 1
      select_type: SIMPLE
            table: city
             type: index
    possible_keys: PRIMARY
              key: name_idx
          key_len: 48
              ref: NULL
             rows: 2
            Extra: Using index
