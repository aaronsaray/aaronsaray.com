---
layout: post
title: Theme/Template System in Zend Framework
tags:
- zend framework
---
Theme systems are very common in projects written on Drupal, Joomla, and Wordpress.  I didn't see much out of the box support for themes in Zend Framework at first.  However, I was wrong.  It's pretty easy.  The only real decision I had to make is if I want to make themes that extend a default theme - or themes that are simple and on their own / totally encapsulated.  I will do the encapsulated version - but give some pointers on how you would do the other version, too!

### Make a Front Controller Plugin

Since themeing is something that is only specific to the view system that is rendered by a web page request, we'll make a front controller plugin.  I'm not creating this functionality in the bootstrap class because command line scripts don't need to run this, only web requests (which happen to begin with the front controller).

However, we do have to register our front controller plugin using the bootstrap class.  First, I'm going to register my new plugin.  The plugin will be called Template.  It will be located at `application/plugins/Theme.php`.  (Note: the default ZF loader knows this location).

**`application/bootstrap.php`**
```php?start_inline=1
class Bootstrap extends Zend_Application_Bootstrap_Bootstrap
{
  protected function _initFrontControllerPlugin()
  {
    $front = $this->bootstrap('frontcontroller')->getresource('frontcontroller');
    $front->registerPlugin(new Application_Plugin_Theme());
  }
}
```

This method simply registers a new plugin named `Application_Plugin_Theme()` to the front.  

### Pick your Theme

I'm going to create only one theme for this demonstration.  

    Name: My Simple Theme
    Folder: simple

For the purpose of our demo, we'll just hardcode this as the 'chosen' theme.  You may have some sort of theme management solution.

### Plan your file system

Next, I know that I'm going to have multiple view folders: one for each theme.  Additionally, I'm going to have to have different folders inside of the public folder to support this.

Our initial views folder:

    application/views/scripts
    application/layouts
    public/images

Instead, if we're going to create assets for My Simple Theme, the folder paths will now be this:

    application/views/simple/scripts
    application/layouts/simple
    public/themes/simple/images

Any specific content is placed in these folders instead.

### Create the Front Controller Plugin

Our plugin will be called `Application_Plugin_Theme`.  I'll register a routeShutdown hook because this is one of the last things we have to do or figure out.  Certainly don't want to do it on every call in the loop nor do I want to do it before a redirect could occur.

**`application/plugins/Theme.php`**
```php
<?php
class Application_Plugin_Theme extends Zend_Controller_Plugin_Abstract
{
  public function routeShutdown($request)
  {
    /** hard coding this for our example **/
    $theme = new stdClass;
    $theme->foldername = 'simple';
    Zend_Registry::set('theme', $theme);

    $bootstrap = Zend_Controller_Front::getInstance()->getParam('bootstrap');
    $view = $bootstrap->bootstrap('View')->getResource('View');
    $view->setBasePath(APPLICATION_PATH . '/views/' . $theme->foldername);

    $layout = $bootstrap->bootstrap('Layout')->getResource('Layout');
    $layout->setLayoutPath(APPLICATION_PATH . '/layouts/' . $theme->foldername);
  }
}
```

The first three lines of this are the theme management hardcoded portion I created.  It is important later, however, in the view helper we're going to create to have access to the $theme object --- hence the `Zend_Registry` call.

First, access the bootstrap.  Next, set the base path of the main view object by including the theme folder name in it.  Notice how this is `setBasePath()` - if you wanted to create a system where templates inherit other ones, you may use `addBasePath()`.  The `setBasePath()` resets the paths array internally and then adds the paths for `/scripts` and `/helpers`.

Next, if you are using layouts, which I'm sure you are, you basically do the same thing with the layout object.

With this plugin, now all items will load from their proper folders.  Just as an example - say you are using the simple theme.

    url: /blog/viewAll
    controller/action: BlogController::viewAllAction()
    layout: application/layouts/simple/layout.phtml
    view: application/views/simple/scripts/blog/viewAll.phtml

### Last step: View Helper

Since there are different public assets depending on what template that was used, we created the multiple folders in the public folder.  For example, you may have
`public/simple/images`, `public/simple/js`, etc.

Since this view helper is going to be shared among all of our views, however, we can put it up a level, outside of the theme root.  The views folder may now look like this:

    application/views/helpers
    application/views/simple/helpers
    application/views/simple/scripts

Create a new Helper called `Application_View_Helper_Theme` inside of the file: 

**`application/views/helpers/Theme.php`**
```php?start_inline=1 
class Application_View_Helper_Theme
{  
  public function theme($url)
  {
    /** your theme management system may be different **/
    $theme = Zend_Registry::get('theme');
    $baseURL = "/themes/{$theme->foldername}";
    return $baseURL . $url;
  }
}
```

Now, modify the front controller plugin to "add" not "set" a new helper script path.  Add the following code:

**`application/plugins/Theme.php`**
```php
<?php
  public function routeShutdown($request)
  {
    /**SNIP**/
    $view->setBasePath(APPLICATION_PATH . '/views/' . $theme->foldername);
    /**ADD THIS BELOW HERE **/
    $view->addScriptPath(APPLICATION_PATH . '/views/scripts');
  }  
```

Now, your zend framework project will look in the regular scripts folder as well as your theme folder for view helpers.

How might we use this?

**Old view:**

```php?start_inline=1 
echo '<img src="/images/smiley.gif" alt="smiley">';
```

**New view:**

```php?start_inline=1 
echo '<img src='" . $this->theme('/images/smiley.gif') . '" alt="smiley">';
```

This will render the theme URL of `/themes/simple/images/smiley.gif`.
