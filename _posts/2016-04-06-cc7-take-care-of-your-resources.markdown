---
layout: post
title: Take Care of Your Resources
tags:
- php
---
> This entry is republished from the original columns included years ago in the [PHP Architect](http://phparch.com) magazine.  I really recommend purchasing the magazine to get timely articles, columns and PHP news.

### Episode 7: Take Care of Resources, They Will Take Care of You

I'm going to say something that I never thought I'd say in my life.  In fact, I'm not sure that a single programmer has ever said this!  Ready?  

Going to church at a young age helped me be a better programmer.

Now, let me explain.  One of the core principles of my religious upbringing was to be a good steward of my money, resources and time.  If I let this simple concept be your guide, the understanding was that I will be rewarded with happiness, love and success.  Basically, if one took care of things, you'd receive the same in return.  But how does this translate into being a Confident Coder of PHP?

### Don't Use More Than You Need

To help illustrate this point, let's imagine that we have PHP installed on a server that charges per CPU cycle.  Perhaps my program has a simple loop that executes until an array is fully iterated through.

```php?start_inline=1 
<?php
$values = array(1, 2, 3, 4, 5);
for ($i = 0; $i < count($values); $i++) {
	echo "I am on line {$values[$i]} in my program.\n";
}
```

This will execute the loop while $i is less than the number of elements in the array.  Each time this loop begins, the second statement in the for-loop definition is executed.  This is wasteful and unneeded.  The count of the array elements will not change so there is no need to calculate this each time.  With our current charge per CPU cycle, this will raise our expenses too.

Because I want to take care of my environment and not waste processing power and money, I'm going to rewrite my code like this:

```php?start_inline=1 
<?php
$values = array(1, 2, 3, 4, 5);
$valuesArrayCount = count($values);
for ($i = 0; $i < $valuesArrayCount; $i++) {
	echo "I am on line {$values[$i]} in my program.\n";
}
```

In this new code, I opted to count the values only one time.  Now, instead of executing a function on each loop, it just does one simple comparison calculation.  I took care not to execute commands that weren't necessary.  And by removing this extra function call, the total loop is also slightly faster.  And speedy execution is one thing a Confident Coder can really appreciate.

### Don't be the guest who won't leave

It's pretty difficult to be a successful PHP programmer without having at least some database skills.  One of the most common pairing is with MySQL.  I've too often seen programs where the usage of different technologies have not been optimized.  With MySQL in particular, PHP programmers can become the guest who won't leave: wasting time and server connections.  Let me demonstrate with some code.

```php?start_inline=1 
<?php
$sql = "select name, address_id from main_table limit 5";
$mysqli = new mysqli();
if ($result = $mysqli->query($sql)) {
	while ($mainRow = $result->fetch_assoc()) {
		$addressQuery = "select city, state from address_table where id={$mainRow['address_id']}";
		if ($addressResult = $mysqli->query($addressQuery)) {
			if ($addressRow = $addressResult->fetch_assoc()) {
				echo "{$mainRow['name']} in {$addressRow['city']}, {$addressRow['state']}\n";
			}
		}
	}
}
```

Because the data is highly normalized in this example, the name and the address are in different tables.  Let's follow through the execution of this code.

First, up to 5 results are retrieved from the main table.  On each iteration, another query is executed to get the results from the address table.  Finally, the full information is displayed.  So, for each result in the first table, an additional query must be ran each and every time.  As a Confident Coder, you don't like seeing that there is up to 5x more work, time and expense than is required to finish the job.

Before I demonstrate a re-factored approach, let me give a bit of clarification.  I know that not all PHP programmers are familiar with other technologies.  That's fine.  It's alright to specialize, but you need to have some familiarity with other technologies and best practices.  A Confident Coder is not happy with knowing the bare minimum to finish the job.  Instead, do a bit of research or ask someone with a different skill-set or discipline to help you.  

Now, let's take a look at the new code:

```php?start_inline=1 
<?php
$sql = "select t.name, a.city, a.state from main_table t inner join address_table a on t.address_id=a.id limit 5";
$mysqli = new mysqli();
if ($result = $mysqli->query($sql)) {
	while ($row = $result->fetch_assoc()) {
		echo "{$row['name']} in {$row['city']}, {$row['state']}\n";
	}
}
```

MySQL is made to handle relationship data.  This is why the JOIN command exists.  So, let's make use of it!  Instead of making up to 6 calls to the database, now only one query is made.  I rely on MySQL to handle the data relationships for me.  Instead of being the guest who will never leave the MySQL connection, one query and I'm done!  I've taken care not to waste resources.  And, as usual, a byproduct of this is that the whole program is now faster too.

### End Notes

Taking care of your resources in your code is a lot like vehicle or home maintenance.  You don't need to do it, and you'll be fine -- for a while.  However, time will break down all things.  Proper maintenance and care will make sure you'll get more life and better performance out of your car, home, and even code!  
