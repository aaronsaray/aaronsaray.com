---
layout: post
title: When uniqid is too slow in PHP
tags:
- PHP
---
I just profiled some of my code and found out that the biggest chunk of my processing time was used by [uniqid()](http://php.net/uniqid).  I use this to generate form tokens to prevent cross site request forgeries.  On one page, I have 6 forms each with its own unique uniqid().

The first thought is to just use one ID per page.  However, I didn't want to change too much of my code.  It's working - so lets just make it work faster.  I did some thinking and realized that maybe my unique id didn't need to be THAT unique - just not super predictable.  A sha1() hash of a random number should do the trick.  And it should be faster.  Just to verify, I did my own benchmark using this code:

```php?start_inline=1
$start = $stop = array();

$start['uniqid'] = microtime(TRUE);
for ($x = 0; $x< 1000; $x++) {
    $val = uniqid();
}
$stop['uniqid'] = microtime(TRUE);

$start['mt_rand'] = microtime(TRUE);
for ($x=0; $x<1000; $x++) {
    $val = mt_rand(0, 1000000);
}
$stop['mt_rand'] = microtime(TRUE);

$start['sha1/mt_rand'] = microtime(TRUE);
for ($x=0; $x<1000; $x++) {
    $val = sha1(mt_rand(0, 1000000));
}
$stop['sha1/mt_rand'] = microtime(TRUE);

foreach ($start as $key=>$startval) {
    echo "{$key}: " . ($stop[$key] - $startval) . "<br></br>";
}
```

The results:
    
    uniqid: 1.1227629184723
    mt_rand: 0.0030300617218018
    sha1/mt_rand: 0.0076968669891357
    
As you can see, sha1/mt_rand combination is so much faster.  In fact, **140x**!  While this is still micro-optimization, running that 6 times to me makes a difference.

Your thoughts?  Is this still unique enough for form tokens?
