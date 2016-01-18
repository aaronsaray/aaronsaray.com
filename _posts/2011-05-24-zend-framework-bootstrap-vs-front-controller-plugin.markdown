---
layout: post
title: 'Zend Framework: Bootstrap vs Front Controller Plugin'
tags:
- zend framework
---

Today I was reviewing some old code I wrote in Zend Framework.  One of the things I was doing in the Bootstrap.php file was creating an function called _initViewSettings().  In here I set a bunch of values for the xhtml version, the css files to include, etc.  Now I realize my mistake:

**Do not include functions in the bootstrap.php file that will never be used by command line.**

Since Zend Framework projects can be launched via command line and via web page, there needs to be no overlap in the bootstrap.php file between uses.  There should only be bootstrapping code - that is to say, things required in order to access or initialize global resources.  The view and its settings are not a global usage object. 

Instead, create a front controller plugin.

Front controller plugins are launched whenever there is a request as a webpage.  They are not ran when a CLI program is ran.  (Don't get this confused with definition and initialization.  The bootstrap class has to define and initialize them - it just doesn't invoke them).  

Let's see this in practice.

**Before: application/Bootstrap.php**

{% highlight PHP %}
<?php
class Bootstrap extends Zend_Application_Bootstrap_Bootstrap
{
  protected function _initViewSettings()
  {
    $this->bootstrap('view');
    $view = $this->getResource('view');
    $view->doctype('HTML5');
    $view->setEncoding('UTF-8');
    $view->prependStylesheet('/css/main.css');
  }
  // ...
}
{% endhighlight %}



Now, afterward, make sure front controller plugins are defined, and then create a front controller plugin.

**After: application/Bootstrap.php**

    
{% highlight PHP %}
<?php
class Bootstrap extends Zend_Application_Bootstrap_Bootstrap
{
  protected function _initFrontControllerPlugins()
  {
    $front = Zend_Controller_Front::getInstance();
    $front->registerPlugin(new Application_Plugin_ViewSetup());
  }
  // ...
}
{% endhighlight %}
    



**After: application/plugins/ViewSetup.php**

{% highlight PHP %}
<?php
class Application_Plugin_ViewSettings extends Zend_Controller_Plugin_Abstract
{
  public function routeShutdown($request)
  {
    $bootstrap = Zend_Controller_Front::getInstance()->getParam('bootstrap');
    $view = $bootstrap->bootstrap('view')->getResource('view');

    $view->doctype('HTML5');
    $view->setEncoding('UTF-8');
    $view->prependStylesheet('/css/main.css');
  }
}
{% endhighlight %}
    



Remember, always remove non-essential code from the bootstrap process.
