---
title: Random user generation - optimized
date: 2007-06-28
tags:
- sql
---
I came across [this blog posting](http://jan.kneschke.de/projects/mysql/order-by-rand) about optimizing order by `rand()` and decided to make my queries better.  Here is my real life example on how to optimize this query:

<!--more-->

Normally, when you click the random link on jemdiary ([jemdiary.com/read/random](http://www.jemdiary.com/read/random)), you are retrieving a user's username to view their diary.  This user has to have their account flagged to allow random reads, and not be globally password protected.  Finally, they need to be an active user.  The settings are in the Tsettings table, the users are in the Tuser table.  See my current sql statement:

```sql
select u.userID, u.userName from Tuser u
  inner join TuserSettings s on u.userID=s.userID
  where s.allowRandom=1 and s.globalPasswordProtect=0 and u.status='A'
  order by rand() limit 1
```

This, unfortunately is going to be slow because of the order by portion of the query.  Using what I learned in that blog post, I was able to modify the sql to take advantage of their speedy query.  Its important to know that I have only deleted a few rows from the user-database.  About 3% are missing.  The rest have just been inactivated (eh... design changes as time goes on ya know ;)).  So, I didn't implement the balancing algorithm.  Additionally, I added a few extra items in for testing, so I could make sure that my users were actually validating correctly.  See this sql:

```sql
select u.userID, u.userName, s.globalPasswordProtect, s.allowRandom from Tuser u 
  JOIN (select (rand() * (select max(userID) from Tuser)) as id) AS r2
  inner join TuserSettings s on u.userID=s.userID
  where 
    u.userID >= r2.id and s.allowRandom=1 and 
    s.globalPasswordProtect=0 and u.status='A'
  order by u.userID ASC limit 1
```

This was a nice fast way to do it.  (The production version of this only selects `u.userID` and `u.userName`).
