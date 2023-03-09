---
title: Localized dates in php
date: 2009-01-07
tag:
- php
---
The PHP Date manual page has a ton of interesting features to format the date that you can display to the user.  However, when you look closer at it, there are actually some really useful modifiers that will help us with our date calculations as well.  

<!--more-->

For the longest time, I had just used the `time()` function and let the pieces fall.  This was OK when the offset was similar to my own timezone - but servers change locations - and websites have global audiences.  The date and gmdate functions can help with this.  Both functions take an optional timestamp parameter.  If you do not specify this, they'll calculate based off of the current date.  This actually becomes quite useful for our calculations... Let's jump in.

## `date` - the date on your current server

The `date()` function's default timezone is based on your server's timezone (or **`php.ini`**'s, etc...).  Regardless of where that timezone is set, it uses it to display/retrieve a localized version of the time.  For example, if it were noon in GMT, and your server was in central time, if you used `date()` to retrieve the time, it would display a time equivalent to noon - 6 hours - so 6am.  (Holy run-on sentence, batman!)

When I say displays the time equivalent, this is because of the first parameter of date's behavior.  When you review the man page, you'll see many different ways to display the time - including some common RFC based ones.

Generally, I shy away from using `date()` unless I really have to.  I feel it gives a bias to the output because of its timezone centric behavior.

How do we not do that??

## `gmdate` - the date in Greenwich Mean Time

Unless you live under a rock, you know that GMT is the basis of our timezones.  You are either ahead or behind them via half hours and full hours, incrementally from the distance to that location.  This obviously is to balance out for the earth's rotation - duh - enough with the 3rd grade lecture...

`gmdate` takes the format of the date function as well, but its default offset is `0`.  This is especially useful if you do not send in a timestamp because it will grab the current time off the server and display it based off of the GMT (not central time for my server, perhaps eastern time for yours, etc, etc).  Normally, when storing date formats, you will always be storing them in GMT to have a common base format.  This function is useful because it can show you exactly, accurately what the value is that you're storing.

So, now we know we have two functions that do rather similar things, its time to find out how to actually get them something to work with.

## `time` - current time measured in seconds

Ok - so we have date and gmdate which take optional second parameters of a timestamp - so how do we pump them full of information besides the current time?  Using `time()` of course!  `time()` returns the number of seconds since `1/1/70 0:0:0 GMT`.  Now, since this is the # of seconds from a GMT date, to a GMT date, its a perfect candidate for both functions!  Want to see a nice display of a timestamp in GMT - the local method you may have stored it in? - send it into `gmdate()`.  Want to see what that time that really was in your timezone?  Use `date()`.

Ok - display and content - we've got them.  Now, let's tie it all together in something that is useful to the end user and website.

## Date Storage, User Information, and Display

Ok, so the biggest thing to remember, let's always store our time with the `time()` output - this gives us a proper and accurate GMT time, no need to worry about Daylight savings, moving servers, etc.  (using datestamp/timestamp formats in mysql is a topic for a full other article - at this point, we're just using an integer to store our dates).  Ok, now with our proper GMT, let's always use gmdate() to format our date as well.  This way, we never accidentally introduce a timezone offset to our date.  We need two other things yet, is it daylight savings time - and what is the user's timezone.

Daylight savings time can be returned using `gmdate('I')` - which will give 1 if daylight savings, and 0 if not.  This will equate to keeping the standard offset or adding an hour to it.  For example, Central time is -6 offset, but with daylight savings time active, its +1 hour - so -5 offset.  1 small caveat, you may not need to use this calculation if that user's timezone does not have DST.

Finally, the user's offset.  You should store this with the user record.  For example, when storing my record, I would expect to see -6 for central time.

## A real life code example

Ok, let's see our code now in practice.

First off, Aaron comes to the website at `7:30p jan 5th, 2009 Central (1:30AM on january 6th, 2009 GMT)`.  He posts an entry.

```php
mysql_query(
  "insert into entries (title, body, authorID, datePosted) "
  . "values ('$clean_title', '$clean_body', $authorID, time()
);
```

Now, the data we see looks like this:

```txt    
ID | title | body                 | authorID | datePosted
----------------------------------------------------------
1  | yay!  | I like making posts! | 12       | 1231205400
```

It's also important to see my user row:

```txt
ID | name  | gmtOffset
----------------------
12 | aaron | -6
```

Let's see some code for displaying that entry localized for when I wrote it:
    
```php
$authorID = 12;
$entryID = 1;
$author = new Author($authorID);
$entry = new Entry($entryID);
$dst = gmdate('I') ? 3600 : 0;
$datePosted = $author->gmtOffset * 3600 + $dst + $entry->datePosted;

print "{$entry->title}<hr></hr>{$entry->body}<br></br><em>Posted at ";
print gmdate("M/d/Y h:i:sa", $datePosted);
```

Let's do a quick run down of this code:

We have the `authorID` and the `entryID` set there just for reference.  We make new objects based off of them - pretty simple mock-code almost.

Next, we calculate if daylight savings time is in effect.  If it is, the function returns `1` - or `true`.  If not, `0` or `false`.  So our ternary operator either adds an hour to the offset for DST true, or does nothing for it being off.  Finally, we calculate our date posted based off of the author's GMT offset, whether DST is active, and what the GMT time of the entry was.
