---
layout: post
title: Elgg Development Tools - Elgg Plugin
tags:
- elgg
- open source
- PHP
---
After working some with the open source Community building application [Elgg](http://elgg.org), I found some settings to be irritating.  I had to keep hacking my plugins to get these settings activated the way I wanted.  Also, I really wanted to put useful settings in the same location.

### Enter The Elgg Development Tools Plugin

This plugin has the following functionality:

  * Integrates FirePHP

  * Quick option to turn off view caching

  * Changes Error Reporting/Display

  * Copies other useful dev settings to one place

More about this after the file download:
[Elgg Dev Tools](/uploads/2009/oht_elggdevtools151.zip)

### Integrates FirePHP

The package includes the latest distribution of FirePHP.  When you enable FirePHP in the admin control panel under the Dev tools option, you can now use the FirePHP functionality in your plugins.  Sometimes coders remember to turn off the functionality later, but forget to remove all of the FirePHP calls.  A mock FB class is created to handle this - it basically accepts any method call and logs an error in the error log that you still have that line in there.

### Turn off View Caching

Normally, you have to either run the update.php script or enable/disable your plugin.  During development, this got super irritating.  Instead, enable this option.  It will make the site run a bit slower, but you won't have to keep enabling/disabling the plugin when you add new views.

### Display Errors

By default, Elgg hides the errors in the .htaccess file.  This will turn them back on without editing the elgg installation.

### Other Useful Dev Settings

I always forgot where simple cache options were.  I copied the setting to the plugin as well.  It basically does the same thing as under site admin.  I find it useful to have all of these settings in one place.

Any feedback is greatly appreciated.
