---
title: "Expression #1 of SELECT list is not in GROUP By clause"
date: 2019-08-03
tags:
- mysql
---
This MySQL error isn't as hard as you might think to solve.  Let's find out why it's happening and what we can do to fix it.

<!--more-->

The error message is usually something like this:

> ERROR 1055 (42000): Expression #1 of SELECT list is not in GROUP BY clause and contains nonaggregated column 'database.table.column' which is not functionally dependent on columns in GROUP BY clause; this is incompatible with sql_mode=only_full_group_by

It might be `#1`, `#2`, etc - depending on your query.

### Why is This Happening?

This is a case of 'the answer is in the error message' - but if you're not familiar with MySQL enough, it might be hard to decipher.  Basically, what's happening is the query you're using is trying to retrieve columns that are not part of the the group by clause.  These are called nonaggregated. MySQL is warning you that it can't guarantee what values will show up.

When you do a `group by`, you are grouping by exact values. This summary/aggregate functionality then returns that uniquely grouped value in the column, if requested.  When you retrieve columns outside of the grouping, they could be anything. They may likely be the same value, but MySQL can't guarantee that.

Let's give an example:

```
id, first, last, day
1, aaron, saray, monday
2, aaron, saray, tuesday,
3, aaron, saray, wednesday
```

Let's say you wrote a MySQL query like this:

```sql
select first, last from my_table group by last
```

We know from the data that this will return `aaron` and `saray` - but MySQL doesn't.  Imagine this example:

```sql
select day, last from my_table group by last
```

Since the day values are different on each row, you don't know what the actual `day` will be when returned. You know that `last` will be `saray` but `day` could be Monday through Wednesday.

This is what MySQL is warning you about.

**This just happened!?**

As with most errors, it seems like it "just happened" but it most like a small change you were unaware of.  This can magically appear for two reasons.

First, someone might have updated the MySQL configuration to start using `sql_mode=onlY-full_group_by` with your queries.  With older versions of MySQL, this was not enabled by default.

More than likely, though, your MySQL was upgraded to version `5.7.5` or newer.  This turns on this setting by default.

### How Can I Fix It?

While this is a legitimate error, you probably know what you're doing and are ok to work around it.  To signal to MySQL you'd like to move forward anyway, you have two options.

First, you could [disable only full group by](https://dev.mysql.com/doc/refman/5.7/en/sql-mode.html#sqlmode_only_full_group_by). I don't recommend this, though, because I believe this error is useful. It's indicating you have a code, data or architectural smell.  This is like taking a hammer to this query or the server in general.

I recommend doing this: **use [any_value()](https://dev.mysql.com/doc/refman/5.7/en/miscellaneous-functions.html#function_any-value)** instead.  `any_value` indicates to MySQL that you are ok with retrieving "any value" for this column, regardless of it not being predictably grouped.

So, for example, our first query would now look like this:

```sql
select any_value(first), last from my_table group by last;
```

For more reference and explanation, you can [check out the MySQL manual on this](https://dev.mysql.com/doc/refman/5.7/en/group-by-handling.html).
