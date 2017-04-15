---
layout: post
title: Emulation of Collections - true stories of data object handling
tags:
- PHP
---

Today, Big Boy sent me an e-mail at work talking about emulation of collections in his .net programming.  He included a code sample (after the break).  This got me thinking about how I am planning on handling data going forward.  Do I want to handle data as keyed arrays, objects, complex objects, or... ?  Additionally, I started thinking about the Null Object programming pattern, and how this can fit into my data handling pattern.  I've made an interesting discovery - and am going to set my paradigm going forward using these complex objects.  Heres how...

Big Boy sent this code example:

```php?start_inline=1
class Collection
{
    public function __get($property)
    {
        if (isset($this->$property)) {
            return $this->$property;
        }
        else {
            throw new Exception("Property {$property} was not found in the Collection.");
        }
    }
    public function __set($property, $value)
    {
        $this->$property = $value;
    }
}
```

This spurred me into thinking about data objects further (and my previous post about such).

**For example, I have an article - and I want to save its title, body and author in an object... how could I do this best?**

With bigboy's method, I decided to run this test.

```php?start_inline=1
$article = new Collection();

$article->title = 'my test title';
$article->body = 'My test body';
var_dump($article);

$myval =  $article->postedDate;
```

As I was hoping, I got the desired response:

    object(Collection)#1 (2) { ["title"]=>  string(13) "my test title" ["body"]=>  string(12) "My test body" }
    
    
    **Fatal error:** Uncaught exception 'Exception' with message 'Property postedDate was not found in the Collection.' in C:\DEVELOPMENT\temp\collection.php:10 Stack trace: #0 C:\DEVELOPMENT\temp\collection.php(25): Collection->__get('postedDate') #1 {main} thrown in C:\DEVELOPMENT\temp\collection.php on line 10
    
    
Ok, so it works... but the exception message isn't that helpful to me.  True, I know where the variable is, but lets face it, I'm lazy.  So, _what was the collection that caused the issue?_

I tried some experiments with the get_class() function - but wasn't able to retrieve the actual name of the instance variable (any takers on how this can be done?).

At any rate, another thing to keep in mind is that **we can now extend our collections to be object specific**

Following our example above, we have two solutions for this - simple OO extension or write an adaptor class.  Lets try both.

```php?start_inline=1
class DatedArticle extends Collection
{
    public function getDate()
    {
        try {
            $d = date('m/d/Y', $this->postedDate);
        }
        catch (exception $e) {
            $d = date('m/d/Y');
        }
        return $d;
    }
}

$article = new DatedArticle();

$article->title = 'my test title';
$article->body = 'My test body';

print $article->title . ' was posted on ' . $article->getDate();
```

As expected, this prints out:

    my test title was posted on 06/26/2007

As you can see, we were able to extend this Collection with our customized DatedArticle.  That class was smart enough to know about the lack of attribute throwing an exception - and was able to assign a default value in that case (not greatly data-integral-based, but who cares ;) proof of concept).

The next way is to make DateArticle an adapter class.

Our modified code looks like this:

```php?start_inline=1
class AdapterDatedArticle
{
    public $collection;

    public function __construct($collection)
    {
        $this->collection = $collection;
    }
    public function getDate()
    {
        try {
            $d = date('m/d/Y', $this->collection->postedDate);
        }
        catch (exception $e) {
            $d = date('m/d/Y');
        }
        return $d;
    }
}

$article = new AdapterDatedArticle(new Collection());
$article->title = 'my test title';
$article->body = 'My test body';

print $article->title . ' was posted on ' . $article->getDate();
```

It functions exactly the same.

**The difference in these two methods of architecture is the difference in the explicitness of your code.**

When you start extending classes, some of the coding becomes far more implicit.  Because of this, it can be confusing (although somewhat more compact) code.  On the other hand, when doing a more explicit adapter pattern, you appear to generate more code - but its easier to follow?

### Which is the best way to do it?

I'm going the adapter route... The reason is because I've learned some hard lessons on JEMDiary with too much extending - as well as I like explicit code.  It helps your team members jump in and figure out everything easier.  Finally, here's the kicker: If made correctly, Adaptor Patterns don't need to be executed in a specific order.

The following two lines of code are the same (if corresponding classes are made correctly)

```php?start_inline=1
$article = new DatedArticle(new ByLinedArticle(new Article()));
$article = new ByLinedArticle(new DatedArticle(new Article()));
```

### Bonus tip - Make use of the Null Object

Another programming paradigm refers to the null object.  In our case, instead of throwing an exception, lets say its perfectly acceptable to have nothing returned.  In this case, we're going to list trackbacks.  Why not just make a null object and have it return that?

```php?start_inline=1
class Collection
{
    public function __get($property)
    {
        if (isset($this->$property)) {
            return $this->$property;
        }
        else {
            return (object) null;
        }
    }
    public function __set($property, $value)
    {
        return $this->$property = $value;
    }
}

$article = new Collection();

$article->title = 'my test title';
$article->body = 'My test body';

$trackBacks = $article->trackbacks;

foreach ($trackBacks as $t) {
    print $t->title;
}
```

In this case, we'll output nothing to the screen - which is perfectly fine.   However, you might not want to allow 'null' as a valid case... or its allowed, but it usually means there's a bug.  You may also not have the go ahead to modify all of the code to start handling exceptions.

### You can use Null Objects as a troubleshooting tool.

Now, lets say in our example, we know that each article should have an author, but we're not going to 'crash' if there is none.  We just will show the article with no by-line - but we CERTAINLY want to know about it.

Lets modify the code:

```php?start_inline=1
class Collection
{
    public function __get($property)
    {
        if (isset($this->$property)) {
            return $this->$property;
        }
        else {
            return new NullObject();
        }
    }
    public function __set($property, $value)
    {
        return $this->$property = $value;
    }
}

class PrePopulatedExample
{
    public $title = 'test title';
    public $collection;
    public function __construct($collection)
    {
        $this->collection = $collection;
        $this->collection->title = $this->title;
    }

    public function __get($property)
    {
        return $this->collection->$property;
    }
}

class NullObject
{}

$article = new PrePopulatedExample(new Collection());

print $article->title;
if (!($article->author instanceof NullObject)) {
    print ' written by: ' . $article->author;
}
```

_WOAH!! You just made this far more complicated!!_.  Yes.  Moving on...
First, we made our adapter class pre-populate some items.  We're assuming that this class failed to load in an author.  As the objects trickle down, we find no author - so we return a new NullObject.  Later on, we check to make sure that its not an instance of the Null Object.  If it _IS_ an instance, well, Null Object was created.  Otherwise, we're good to go on using it.

Why would we do it this way than just using a smart isset() call?  Well, now we can use the Nullobject to log instances of itself... for troubleshooting!

Lets modify NullObject and our creation of null object.

    /** Collection::__get **/
                return new NullObject(debug_backtrace());
    /** moving on **/

```php?start_inline=1
class NullObject
{
    public function __construct($debug)
    {
        $this->__complexLogging($debug);
    }
    private function __complexLogging($l)
    {
        /** do some complex logging here **/
    }
}
```

As you can see, I can now log a big backtrace to some sort of logging/reporting function.  Plus, the website still functions correctly.

All in all, its important to not over-complicate the situation, but there are many possibilities for using a good OO model.

### UPDATE: Bonus Tip #2!

Who's guilty of code like this? I know I am!

```php?start_inline=1
print $article->title;
if ($article->author != '') {
    print ' written by: ' . $article->author;
}
```

Well, in this instance with our last example, we'll get this error:

**Catchable fatal error:** Object of class NullObject could not be converted to string in C:\DEVELOPMENT\temp\collection.php on line 52

Instead, lets just add in this special little magic method into NullObject:

```php?start_inline=1
public function __toString()
{
    return '';
}
```

And we're all set.  Hacky?  a little bit...
