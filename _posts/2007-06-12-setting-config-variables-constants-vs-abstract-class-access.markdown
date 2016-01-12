---
author: aaron
comments: true
date: 2007-06-12 01:26:26+00:00
layout: post
slug: setting-config-variables-constants-vs-abstract-class-access
title: Setting Config Variables - Constants vs. Abstract Class Access
wordpress_id: 478
categories:
- PHP
tags:
- PHP
---

As I was looking through some old code from Big Boy, I noticed a block of his code at the top of his initial control file and noticed a way he was using his configuration.  He was defining his from an INI file and setting constants in the code with a prefix identifier.  I then took a minute to look at my most recent framework to see how I was using my config - a static class instance with an internally held singleton pattern.  It got me starting to think of which was best... I have a new open source project coming up and I'd like to do the right thing.



### INI File and Constants



Having dabbled in win32 programming back in the 3.1 era, I am very familiar with the .ini file.  I used to love to sneak little bits of 'hacks' into all my ini files ( even as far as making another person's file manager load into something else from accessing their win.ini... ;) )  PHP supports this with its [parse_ini_file](http://php.net/parse_ini_file) function.  This function lets you make standard .ini files - and will read them into a nice pretty array for you.  With an additional boolean flag, you can even make multidimentional arrays (check out the docs).  Basically, big boy was reading in an .ini file and then looping through sections, and variables and defining them... code example:


    
    $ini = parse_ini_file('values.ini', true);
    foreach ($ini as $section=>$sectionArray) {
    foreach ($sectionArray as $pointer=>$value) {
    define('CONFIG_' . strtoupper($section) . '_' . strtoupper($pointer), $value);
    }
    }



As you can see, this now puts our config options into a nice set of constants for use in our class, models, controllers, etc.  (disclaimer: I'm sure big boy has made better code since this...)



### Config using a static class and possible Singleton Pattern



For my configuration options, I built a static class (which I used PHP5's autoload to make accessable) called CONFIG.  I then created a set of static methods, get and set (in hindsight, I could have modified these to use the magic methods for this class...), a singleton constructor and a logic module.  My logic module made a few decisions based on server configuration, location and site, allowing me to access those properties later.  I also could have made a mysql connection or a .ini file read in this if I wanted to.

The get and set methods function the same way.  First, it will check to see if there is an instance of itself running with a static resource.  If not, we'll call the constructor (which will call the logic and make all of the decisions).  Then, after its either started for the first time, or available, we then get our copy of it and return our desired configuration option.  I made the values private, which allows us to return them with our get method but not allow them publicly editable (good programming design).   I also allow a user to create their own configuration class which is brought in via reflection to bring in other values into the class (this is where the main logic can happen for site specific config options).

Here, for reference is what I'm using currently... (note this one is slightly different than what I originally described... because I use a framework of classes)


    
    
    /**
    * configuration
    *
    * This file contains the class that is used to access configuration values.
    *
    * @author Aaron D Saray
    * @package FWCONFIG
    */
    
    /**
    * main config class
    *
    * This class handles the configuration variables.  It references a
    * class called FWCONFIGDETAILS which has user information for the class.
    *
    * @package FWCONFIG
    */
    class FWCONFIG
    {
    
    /**
    * The private values to our config
    * @var array
    */
    private $_values = array();
    
    /**
    * Constructor
    *
    * This constructor is responsible for bringing in the external values
    * from the FWCONFIGDETAILS.php file
    */
    public function __construct()
    {
    
    /**
    * Check to see if the user has set a CONFIGCLASSPATH
    * constant in the FW.php file.  By default, this is blank,
    * so we just put the config file in the doc root.  Messy?
    * don't care.
    */
    if (FW::CONFIGCLASSPATH) {
    $path = FW::CONFIGCLASSPATH;
    }
    else {
    $path = $_SERVER['DOCUMENT_ROOT'];
    }
    
    $file = $path . DIRECTORY_SEPARATOR . 'FWCONFIGDETAILS.php';
    
    /**
    * if we can read the file, lets bring it in.  If its not readable,
    * doesn't exist, or any other thing, we don't care about it.
    * It is possible to have an instance of the Framework without this
    * config.
    */
    if (is_readable($file)) {
    /**
    * means we found it, and so we'll include it and then
    * do our reflection
    */
    require ($file);
    
    if (!class_exists('FWCONFIGDETAILS', FALSE)) {
    throw new FWexception('FWCONFIGDETAILS file found but with no class.');
    }
    
    /**
    * now we're ok to make a new instance of this class through
    * reflection so we can get all those values names.
    * this should also run the constructor
    */
    $configReflection = new ReflectionClass('FWCONFIGDETAILS');
    $config = new FWCONFIGDETAILS();
    
    /**
    * now do reflection to get these values
    */
    $properties = $configReflection->getProperties();
    foreach ($properties as $property) {
    $name = $property->name;
    
    /**
    * make sure its public
    */
    $r = new ReflectionProperty($config, $name);
    if (!$r->isPublic()) {
    throw new FWexception($name . ' in your config class must be public');
    }
    
    /**
    * set it to our internal self's values.
    */
    $this->_values[$name] = $config->$name;
    }
    }
    }
    
    /**
    * Get Value
    *
    * This method is called statically to return a config value.  It checks
    * to see if there is an instance of the config in the registry.  If
    * there is not, it makes one.
    *
    * @param string $value The value to get.
    * @return mixed
    */
    public static function get($value)
    {
    $registry = FWREGISTRY::getInstance();
    
    /**
    * make sure its got an instance of our config class now
    * if not, create one
    */
    if (!$registry->exists('FWCONFIG')) {
    $registry->set('FWCONFIG', FWCONFIG::getInstance());
    }
    
    $config = $registry->get('FWCONFIG');
    
    /**
    * make sure we're returning a value, otherwise throw an exception.
    */
    if (isset($config->_values[$value])) {
    return $config->_values[$value];
    }
    else {
    throw new FWexception('Accessing an invalid value: ' . $value);
    }
    }
    
    /**
    * Generate new instance of the class
    *
    * Does a singleton pattern and stores it in the registry
    *
    * @return object
    */
    public static function getInstance()
    {
    $registry = FWREGISTRY::getInstance();
    
    if (!$registry->exists('FWCONFIG')) {
    $registry->set('FWCONFIG', new FWCONFIG());
    }
    
    return $registry->get('FWCONFIG');
    }
    }
    ?>
    





### So - whats the best way to do it? (and any lessons learned?)



There are good arguments for both sides: Use constants because we shouldn't have to edit our config options (well unless we have a plug-in architecture that allows for some of the internal config options to be reset), don't use a class because its bloaty and requires the user to always create an instance of your class (but they can create their own configuration options without having to edit your code or even really know how it works...)

Well, there's never just one right answer for solving issues with programming, but I lean towards the more complex but expandable / extensible method of the static class.  I just like the ability to do everything in a more abstract way - and to hide away some of the logic for building our configuration options.

There are things that I could do to make the config class better.  It can be made more flexible by building in different ways to set config options (balance this with the bloat effect), I could create a better way for bringing in the class for reflection (or allowing for multiple classes... for a plug-in type system).

I'm always open to hear anyone else's configuration solutions too!
