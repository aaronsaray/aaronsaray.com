---
title: Using PHP to find distance between Zip Codes
date: 2009-05-28
tag:
- php
---
Today marked the second time I had to write this code from scratch.  To save my self time - and hopefully you too! - I'm going to post what I've developed.

<!--more-->

## Get Your Zips

I found a great resource at [ibegin.com](http://geocoder.ibegin.com/downloads.php) - a download of 5 digit zip codes, city, state and county name, and their latitude and longitude.  (Just in case it's unavailable, I have archived it [here](/uploads/2009/zip5.zip).)

## Import your Zips

The table I'm using was created with this SQL:
    
```sql
CREATE TABLE  `zipgeo` (
  `zip5` char(5) NOT NULL,
  `city` varchar(250) NOT NULL,
  `state` varchar(250) NOT NULL,
  `lat` double NOT NULL,
  `lon` double NOT NULL,
  `county` varchar(250) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
```

The following is the code used to import this .csv file into the table:

```php
set_time_limit(0);
$mysqlhost = 'localhost';
$mysqluser = 'user';
$mysqlpass = 'pass';
$mysqldb = 'mydatabase';
$mysqltable = 'zipgeo';
mysql_connect($mysqlhost, $mysqluser, $mysqlpass) or die(mysql_error());
mysql_select_db($mysqldb) or die(mysql_error());

$fields = array('zip5', 'city', 'state', 'lat', 'lon', 'county');
$contents = file('zip5.csv');

$buffer = 100;
$basestatement = "insert into {$mysqltable} (`" 
               . implode("`, `", $fields) 
               . "`) VALUES ";

$counter = 0;
$inserts = array();
foreach ($contents as $line) {
  $linefields = explode(',', $line);
  $linefields = array_map('trim', $linefields);
  $linefields = array_map('mysql_real_escape_string', $linefields);
  $inserts[] = "('" . implode("', '", $linefields) . "')";
  $counter++;

  if ($counter == $buffer) {
    $query = $basestatement . implode(',', $inserts);
    mysql_query($query) or die(mysql_error());
    $counter = 0;
    $inserts = array();
  }
}

if (count($inserts)) {
  $query = $basestatement . implode(',', $inserts);
  mysql_query($query);
}

print 'done';
```

This imported a nice set of 41,755 zip code rows.

## Distance Calculations

Now, I should give a disclaimer: this is just code that you can use.  It is not the 'cleanest' or best organized.  When I implement this code for my employer, I will be making a few changes, including it in a class, etc.

```php
function degrees_difference($lat1, $lon1, $lat2, $lon2)
{
  $theta = $lon1 - $lon2;
  $dist = sin(deg2rad($lat1)) * sin(deg2rad($lat2)) +
          cos(deg2rad($lat1)) * cos(deg2rad($lat2)) *
          cos(deg2rad($theta));

  $dist = acos($dist);
  $dist = rad2deg($dist);

  $distance = $dist * 60 * 1.1515;

  return $distance;
}
```

This will return the distance in miles between one lat/long combination and another.

```php
function difference_between($firstzip, $secondzip)
{
  $query = "select zip5, lat, lon from zipgeo where zip5 in ({$firstzip}, {$secondzip})";
  $result = mysql_query($query) or die(mysql_error());

  $firstzips = mysql_fetch_array($result);
  $secondzips = mysql_fetch_array($result);

  return degrees_difference(
    $firstzips['lat'], 
    $firstzips['lon'], 
    $secondzips['lat'], 
    $secondzips['lon']
  );
}
```

This code gets the latitude and longitude for two zip codes and then executes that last function.  Note: it doesn't matter what order the zip codes are - the distance from A to B is always the same as B to A.

```php
function get_zips_within($zip, $miles)
{
  $milesperdegree = 69;
  $degreesdiff = $miles / $milesperdegree;

  $query = "select lat, lon from zipgeo where zip5={$zip}";
  $result = mysql_query($query);
  $latlong = mysql_fetch_assoc($result);

  $lat1 = $latlong['lat'] - $degreesdiff;
  $lat2 = $latlong['lat'] + $degreesdiff;
  $lon1 = $latlong['lon'] - $degreesdiff;
  $lon2 = $latlong['lon'] + $degreesdiff;

  $query = "select * from zipgeo where lat between {$lat1} and {$lat2} and lon between {$lon1} and {$lon2}";

  $result = mysql_query($query);

  $zips = array();
  while ($row = mysql_fetch_assoc($result)) {
    $zips[] = $row;
  }

  return $zips;
}
```

This last statement gets the zips within that many miles.

## How Should I Use These?

Because I'm not about to do the calculations based on the earth's curvature in my SQL statement, I can have some misleading results.  Since the distance - especially as the difference in location grows - is elongated by the curvature, the initial query using the between statement should actually request a larger mileage than expected.  Then, this result set should be looped through and compared using the function which computes using the curvature to get a more accurate result set.

So, basically, if I were going to get all locations within 50 miles of 12345:

  * Run query to get all results within 65 miles of 12345

  * loop each result through next function which computes distance between 12345 and result's zip.  If it's 50 or less, keep it.
  