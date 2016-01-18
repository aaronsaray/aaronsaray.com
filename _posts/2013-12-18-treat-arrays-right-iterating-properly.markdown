---
layout: post
title: 'Treat Arrays Right: Iterating Properly'
tags:
- PHP
---

Oh, PHP - your love affair with arrays is like no other language.  You can always tell if someone learned PHP first before all other programming languages.  They think, design, and talk in arrays.  Have a list?  Make it an array.  Have a heap?  You mean array, right?  Collection object? Naw, I’ve got an array right here.

PHP loves arrays too.  Check out [php.net/manual/en/ref.array.php](http://php.net/manual/en/ref.array.php) to see exactly what I mean.  So many ways to work with arrays, I love it!  Every PHP programmer loves and respects arrays, right?  So why do so many of us treat them the wrong way?

Now, I know what you’re saying already.  _How can you treat an array poorly?  How am I not working with them right?  My programs work!  I have a high traffic site!_  It’s ok.  Maybe you’re doing it right - but just bear with me here. Let’s have a little bit of a refresher.  Let’s review some best practices.

There are two ways to iterate through arrays that I want to focus on: the loop structure and the array manipulation function.  Of course, I speak in generalities and in suggested best practice (we all know sometimes that odd scenario breaks “the rules”), so don’t get too stuck on all the details.  I tend to see these two methods as unique and separate.  Each has their own strength.  For example, if you’re going to use a looping structure with an array, you’re aiming to keep the original array intact.  You might use this structure for printing information to the screen in a list.  On the flip side, if you’re looking to change the values in an array, you’re going to want to use one of the array manipulation functions.

If you’re like me, you’re already scanning through the article, looking for code and bold type.  So, here you go.



#### Best Practice: Use Loops When Not Changing Array Values

{% highlight PHP %}
$array = ['a', 'b', 'c', 'd', 'e'];

$length = count($array);
print '<ul>';
for ($i = 0; $i < $length; $i++) {
    print "<li>{$array[$i]}</li>";
}
print '</ul>';
{% endhighlight %}


Here, I have an array cleverly named $array.  I do not wish to change the values in the array, only display them in a nice unordered list.  I’m not sure how many elements there are, but they all belong in this list.  So, I can use a loop to iterate through each element and print each value out.


#### Best Practice: Use Array Manipulation Function To Change Array Values

{% highlight PHP %}
$array = ['a', 'b', 'c', 'd', 'e'];

array_walk($array, function(&$value, $key) {
    $value = strtoupper($value);
});
{% endhighlight %}


In this example, I want $array to contain all the same letters, just uppercase.  I’ll be using this array some other time, but I need the values changed immediately.  In cases like this, use the array_walk() method to pass in the array to a function to do the manipulation.  Since I’ve passed $value by reference, any manipulation I do to the value will be applied directly back to the array.
	


#### Challenge: Create a New Array of Uppercase Values and a Random Number



For this challenge, what would be the best practice?  Should I create a loop or use an array manipulation method?  Below, I’ll show both ways to do it.  Which is best?

{% highlight PHP %}
$array = ['a', 'b', 'c', 'd', 'e'];

$uppercase = array_map(function($value){
    return strtoupper($value) . rand(1,1000);
}, $array);

$secondUppercase = [];
foreach ($array as $letter) {
    $secondUppercase[] = strtoupper($letter) . rand(1,1000);
}
{% endhighlight %}



The first way uses the array manipulation method array_map().  This method creates a new array from the values returned from each element of the manipulated array.  Pretty nice, simple code.  The second way initializes a new array, then loops through each original array element individually, appending to the new array.  The first way is the better way to do this.
I already hear the arguments!  Both ways work!  They do, I understand that, but this is about treating the array right.  Treat the array with the proper method to create the best, most efficient code.  If given a chance to create my own loop in PHP versus using a loop created in the core using C, I’m going to opt for the latter.  There is a reason why these methods exist; for scenarios like this.

But, if you’d like to just ruffle my feathers a little bit, I encourage you to send me your most confusing, poorly treated array code.  For example…



#### This Is Not The Best:


{% highlight PHP %}
$array = ['a', 'b', 'c', 'd', 'e'];

print '<ul>';
array_walk($array, function($value, $key) {
    print "<li>{$value}</li>";
});
print '</ul>';
{% endhighlight %}



It’s not the best, it’s not what the method was designed for, but PHP allows it.  And in the end, maybe if you **can** do it, you’re ok to do it.  But for me, I’m going to keep writing code that treats arrays right.

