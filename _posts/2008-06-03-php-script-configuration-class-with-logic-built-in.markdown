---
layout: post
title: PHP Script Configuration Class with Logic built in
tags:
- PHP
---

Sometimes we have static configuration options, such as the name of the company or the location of a particular partner's website.  Other times, there are more dynamic configuration options - such as the current location's URL or database connection credentials.

For this article, I wanted to build on my previous article [here]({% post_url 2008-05-31-php-script-configuration-options-class-constants-or-mysql %}), and make a config class that could still get all of this information from a static method, while making decisions to create accurate config options.

Ok, let's take a look at the code:

```php?start_inline=1
class config
{
    private static $instance = null;

    private static $item1 = 'item 1 value';

    private static $item2 = '';

    public static function get($item)
    {
        if (is_null(self::$instance)) self::$instance = new self;

        return self::$$item;
    }

    private function __construct()
    {
        if (true) {
            self::$item2 = 'item2';
        }
        else {
            self::$item2 = 'other value';
        }
    }
}

print config::get('item2');
```
    

We have a class called config that we can access our variables from with the get() static method.  Notice how this time, we cannot access the variables directly - we have to use the method - so this is an improvement.

Every variable we have is static and private.  This allows the static methods to access them - but no one else.

Next, we have static item1 - which is a preset value with no logic surrounding it.  Item2 will need some logic - so it is predefined but blank.  Note: if you do NOT define this ahead of time, you will get an error.

Our method get() first checks to see if self::$instance is not null.  If it is null, it populates it with a new instance of self (which calls the constructor).  This singleton type pattern makes sure that the initial logic to define these variables only gets called once.

Next, the get() method returns the variable name from the current class that was sent in via $item.  There is no error handling in this very simple class - but you'd want to add some for a more robust configuration option.

Finally, the constructor is private because it will only be called from the static get() function - which is a part of the class.  As you see in the constructor, any logic is done in order to populate the values up above.

This is the type of configuration option I've been using going forward.  If there are any suggestions on how to make it more efficient, I'm all ears!
