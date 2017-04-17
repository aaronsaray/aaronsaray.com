---
layout: post
title: Is it better to write your 'for' loops backwards in PHP?
tags:
- performance
- PHP
---
After listening to a javascript internals optimization talk, I wanted to see how these concepts could relate to PHP.  The biggest thing that stuck out to me was the order of the for loops in javascript.  According to the talk, loops written backwards (or using the deincrement operator instead of the increment one...) was a lot faster.  They said comparing a value to zero was faster than comparing a value to another value.  With the backward loop, you were always comparing to zero.  I decided to try these tests on php:

I'm not entirely solid with my testing method.  My idea was to make a forward loop and a backward loop.  Each would do one PHP action.  I'd run the test 10 times to get an idea what the mean was - did forward loops win or did backward ones win?  This is the code I used:

```php?start_inline=1
$var = 1;
 
for ($j=0; $j < 10; $j++) {
  $time_start = microtime(true);
  for ($i=0; $i < 100000; $i++) {
    $var = 1;
  }
  $time_end = microtime(true);
  $timef = $time_end - $time_start;
  print "{$timef} - forward<br />";
 
  $time_start = microtime(true);
  for ($i=100000; 0 < $i; $i--) {
    $var = 1;
  }
  $time_end = microtime(true);
  $timeb = $time_end - $time_start;
  print "{$timeb} - backward<br />";
 
  if ($timef > $timeb) {
    print '<strong>Backward Wins</strong>';
  }
  else if ($timef < $timeb) {
    print '<strong>Forward Wins</strong>';
  }
  else {
    print 'ARE YOU KIDDING ME?';
  }
  print '<br /><hr />';
}    
```

After running the test a few times, I was actually surprised.  There really wasn't that much of a difference.  Here's an example of the output for one of my tests:

    0.061929941177368 - forward
    0.064308881759644 - backward
    **Forward Wins**
    
    
    
    * * *
    
    0.069388151168823 - forward
    0.056493997573853 - backward
    **Backward Wins**
    
    
    * * *
    
    0.065435886383057 - forward
    0.056330919265747 - backward
    **Backward Wins**
    
    
    * * *
    
    0.065697908401489 - forward
    0.056133031845093 - backward
    **Backward Wins**
    
    
    * * *
    
    0.066594123840332 - forward
    0.065793991088867 - backward
    **Backward Wins**
    
    
    * * *
    
    0.059870004653931 - forward
    0.064540863037109 - backward
    **Forward Wins**
    
    
    * * *
    
    0.057721138000488 - forward
    0.064589023590088 - backward
    **Forward Wins**
    
    
    * * *
    
    0.057284832000732 - forward
    0.064239978790283 - backward
    **Forward Wins**
    
    
    * * *
    
    0.067974090576172 - forward
    0.056583166122437 - backward
    **Backward Wins**
    
    
    * * *
    
    0.068339824676514 - forward
    0.056351900100708 - backward
    **Backward Wins**
    
    
    * * *

So as you can see, there's no real proof that in PHP the order of your for loop matters.
