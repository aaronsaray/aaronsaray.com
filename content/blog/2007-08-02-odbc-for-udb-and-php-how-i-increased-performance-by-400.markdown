---
title: ODBC for UDB and PHP - How I increased performance by 400%
date: 2007-08-02
tag:
- php
- sql
---
In our current setup at ("the triangle"), we have to use odbc connections to access our db2-udb database - and I don't like it.  But we have to stick with it - and that's the way life is.  The main reason I don't like it is the immense overhead and time it takes to execute queries.  Well, I did some research and found out some interesting things.  The most important of which was a cursor setting that allowed me to gain up to 400% performance.  Find out how:

<!--more-->

The dynamic scrollable cursor used to fetch data from the database in odbc is not supported by db2, so db2 downgrades the cursor to a dynamic keyset driven cursor.  This is by default.  Performance is gained by downgrading to a forward cursor only - which is faster than the scrollable cursor.

To test this, you can use the [`odbc_connect`](http://php.net/odbc_connect) constant `SQL_CUR_USE_ODBC` as the 4th parameter of your connection (previously I wasn't specifying a 4th param).  This is the code I used to test it:

**Remember, try the test once with the constant, and once without.**

```php
$dsn = 'DRIVER={iSeries Access ODBC Driver};SYSTEM=SYS1;';
$username = 'USERNAME';
$password = 'PASSWORD';
$sql = "select * from library.file fetch first 200 rows only";
 
$db = odbc_connect($dsn, $username, $password, SQL_CUR_USE_ODBC) or die(odbc_error());
 
$start = microtime(true);
 
$result = odbc_e xec($db, $sql);
while ($row = odbc_fetch_array($result)) {}
 
$stop = microtime(true);
 
print $stop - $start;
```

Of course, remember to swap out the proper credentials and make a legitimate sql call for testing.

If anyone has any reasons or pointers why this setting could be bad, let me know.  Thanks!
