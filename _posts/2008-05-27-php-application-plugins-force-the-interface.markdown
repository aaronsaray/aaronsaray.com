---
layout: post
title: PHP application plugins - force the interface
tags:
- PHP
---

The other day I was experimenting with some PHP plugin scripts and trying to develop my own robust plugin system.  I started thinking: how can I guarantee that a 3rd party developer sticks to my plugin standards?

Well the obvious answer is an interface.  But, I wanted to make sure that their plugin actually implemented it.

#### Enter instanceof

I had previously only thought of instanceof as a way to verify if an object was of a specific type of class - but this can be extended to interfaces.  let's check out my test code here:
    
{% highlight PHP %}
<?php
interface pluginInterface
{
    public function update();
}

class thirdPartyPlugin implements pluginInterface
{
    public function __construct()
    {
        print 'constructed';
    }

    public function update()
    {
        print 'update ran';
    }
}

$a = new thirdPartyPlugin();

if ($a instanceof pluginInterface) {
    print 'is good';
}
else {
    print 'discard me.';
}
{% endhighlight %}

The first section is the plugin interface.  For our example, I'm making a very simple interface: all plugins must have a method called update().

Next, we have the third party plugin which implements pluginInterface.  It has the update method - as well as any other methods.

Finally, our plugin loader will make a new instance of the plugin, and then verify its of the type of pluginInterface.  This makes sure that we've loaded this interface with our third party plugin.  In this code, if you were to remove 'implements pluginInterface' from thirdPartyPlugin, the 'instanceof' will fail and print 'discard me'.


#### Make the parameters in the Interface more exacting


So, let's say that every single update() method should do something to the object 'testObject'.  With this modified code, I make sure that the update() method of the 3rd party plugin expects its first parameter to be testObject.  If you do not match up the exact type of object in the declaration as the interface, it will fail. (note: the object's variable name does NOT need to match)

see code:

{% highlight PHP %}
<?php
interface pluginInterface
{
    public function update(testObject $tO);
}

class thirdPartyPlugin implements pluginInterface
{
    public function __construct()
    {
        print 'constructed';
    }

    public function update(testObject $object)
    {
        print 'update ran';
    }
}

class testObject
{}
{% endhighlight %}


#### Can this help with security?

Sure!  Think about this:  you install a 3rd party plugin, but you don't have time to review all of its code line by line.  Ok - so this malicious 3rd party plugin now wants to access your database connection and drop all of your records.   It expects to pass in the database connection to its update function... so it defines the function as this:

{% highlight PHP %}
<?php
public function update(testObject $object, $dbConnection)
{% endhighlight %}


Well, sure enough, this will fail as well - you must match EXACTLY to the interface.

_Note:_ I'm not advocating that this is your only security measure in your application.  There are other ways for 3rd party plugins to take advantage of your system - but as a responsible developer, you should make multiple layers of security.
