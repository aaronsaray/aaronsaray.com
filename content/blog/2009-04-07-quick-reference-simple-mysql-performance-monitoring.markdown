---
title: 'Quick Reference: Simple MySQL Performance Monitoring'
date: 2009-04-07
tags:
- mysql
---
There are a few quick ways to monitor MySQL performance.  This isn't much of an in-depth reference, just a quick reminder.  Lets look:

<!--more-->

### mysqladmin status

Shows a quick status:
    
    mysqladmin status
    Uptime: 102594  Threads: 1  Questions: 39  Slow queries: 0  Opens: 12  Flush tables: 1  Open tables: 0  Queries per second avg: 0.000

### mysqladmin processlist

Show the active processes and what they're doing:
    
    mysqladmin processlist
    +----+------+----------------+----+---------+------+-------+------------------+
    | Id | User | Host           | db | Command | Time | State | Info             |
    +----+------+----------------+----+---------+------+-------+------------------+
    | 25 | root | localhost:3185 |    | Query   | 0    |       | show processlist |
    +----+------+----------------+----+---------+------+-------+------------------+

### mysqladmin extended

This is short for `extended-status`, which shows you pretty much everything you want to know about the current system.

    mysqladmin extended
    +-----------------------------------+----------+
    | Variable_name                     | Value    |
    +-----------------------------------+----------+
    | Aborted_clients                   | 0        |
    | Aborted_connects                  | 8        |
    | Binlog_cache_disk_use             | 0        |
    | Binlog_cache_use                  | 0        |
    <snip>
    | Threads_connected                 | 1        |
    | Threads_created                   | 1        |
    | Threads_running                   | 1        |
    | Uptime                            | 102658   |
    +-----------------------------------+----------+

Add iterations or relative comparisons with `-i` and `-r`.  For example, the following updates the list every 10 seconds with relative numbers (shows change well).
    
    mysqladmin extended -i10 -r
    
### Other Resources

[MySQL.com's explanation of some performance monitoring options](http://www.mysql.com/news-and-events/newsletter/2004-01/a0000000301.html)
[MyTop - top clone for mysql](http://jeremy.zawodny.com/mysql/mytop/)
