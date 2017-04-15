---
layout: post
title: What I believe MVC is - or MVCFDH
tags:
- PHP
- programming
---
There are many interpretations of MVC - there are less definitions but more implementations.  I want to cover what I personally do when using PHP for MVC.  I call it MVCFDH.

[![](/uploads/2008/mvc.jpg)](/uploads/2008/mvc.jpg){: .thumbnail}

### What is MVC?

A real quick definition of MVC for those who are not familiar.  MVC is a design pattern that consists of separating the logic, action and display from each other.  The three parts of this are Model, View, and Controller.  The Model contains the logic and business content, the View contains the way of displaying that content, and the Controller interprets the actions being requested by the user to glue the Model's usage to the View.  Theoretically, you should be able to swap out any one of the components with another of the same interface - and function flawlessly.  A common example of this is using multiple views - 1 for HTML on the screen, 1 for WAP devices, 1 for web services, etc.  Now, if you're not familiar beyond this quick refresher, I recommend doing more research on the web.

### What do I use?  Why MVCFDH of course!

After many implementations in PHP, I've discovered that the general simplistic example of MVC didn't work exactly as I would want.  There was still so much over lap, confusion on how certain functionality should act, etc.  I added two more components called F and D.  This means, I have Model View Controller Frontcontroller Dataobject Helper.  Let me detail each one of these:

### Steering Wheel or... Front Controller

The front controller intercepts the first request to the code.  This may be a web page URL with parameters for a surfer or a request to a web service for data exchange.  Either way, every single request comes through this first controller.  (Practically implemented, this is usually the index.php file in the base directory for the web server with some apache rewrite rules in most examples.)  This front controller is responsible for knowing how to locate every single other file in the system.  It also stores some global knowledge about the request for later usage - such as the request time, the method of request (browser, xml request, etc).  It doesn't do any processing necessarily on this information - it just makes the information available.  Finally, it methodically can interpret from the request what type of controller to request - and passes execution to said controller.  I've seen people use various types of garbage collection or logging in these front controllers.  I don't know exactly if that fits or not.  The most important thing is to make it quick and clean - this is just the front door of the house.

### Mr. Bossy TakesAction JR, or ... Controller

Each specific requested action has a controller.  This controller handles that request, and uses some of the information freely available from the front controller - to determine what model to include / invoke.  The controller is basically just a bootstrap for validating that the request type is a valid request - ie - something that CAN be done - and then determines what WAY to implement the requested feature based off of request type.  For example, you may prepare data differently for a web page than you will for a PDF file.  A common misconception is that this is referring to different models with the potential for code duplication.  Instead, this is referring to specific portions of the same model that it has determined.  (Practically, your code might know the request was for a PDF of the sales details, so it calls the model function getForPDF() which in turn calls a private method generateSalesDetails().  A request for the same items for a web page might call getForHTML()).  The controller calls the proper models and then is responsible for applying the returned content to the view.

### This is why I'm hot... or... Model

The model is where I move away from many ways of implementing the traditional MVC pattern.  The model should have generic functions to perform whatever business logic is required as well as more specific functions to cater to any type of request that the controller may make.  Finally, it is responsible for applying the Dataobjects - waking them up - and knowing how to extract data from them.  The model always returns data to the controller.

### Stop treating me like a piece of meat... or... the Dataobject

The data object is a very precise object that connects to an entity of content.  Only the model directly ever works with this.  It makes sense to have all Dataobjects have the same interfaces for the models to use.  Additionally, they should be built in a way that allows them to couple efficiently with each other.  Resist taking short cuts and putting common business logic in these objects. (For example, if your business always uses a 'fullname' you may want to make a function for your data object that returns full name by combining the first and last. Do NOT do this.  You never know - maybe the next usage of this will require the fullname to be first, MI, and last.)  Data objects may use various ways of acquiring their data.  In theory, they should be transparent enough for you to swap out a mysql database and use an xml data store - and no one would know the difference.

### Ladies Gossiping - ... or... The View

I find that the biggest hurdle for new users of MVC is the view.  Understanding that there can be code that displays data while not performing any manipulation is usually hard to comprehend.  Or knowing that logic can happen in the model - but it can't ever output its final result.  This comes from PHP's embedding features - so its not a surprise to see this.  The view contains the general markup to display the content that the controller received back.  The controller invokes the proper view for the data - which is to say the proper view for the current request type and action type.  Basically - any sort of HTML, CSS and JS will be in your view.  Two common questions: what about separating CSS from HTML - and what about Automated JS generation from Helpers or Models.  First of all, CSS/JS separation from your markup is a must - and indeed another topic entirely - but suffice to say the view is your implementation of proper client side design and development with content being pumped into it afterward.  Follow all of the rules that you know to be good practice when adding your CSS and JS.  Second - JS that is generated and how to import that is generally a very long conversation.  Just follow the directions of your library you are using.  I've seen examples as easy as just injecting it mid HTML to generating an include .js file that contains JS for only the current request.  That is not the focus of this article.

### Jared's got aids... or Helpers

I would be remiss if I didn't talk about those little bits of code that you just can't live without - and that MUST be brought out into something else in order to eliminate code duplication.  Helpers refer to those small bits of code that help us perform needed tasks - such as connecting to a database, generating repetitive HTML code - like forms, retrieve configuration options, etc.  These are a necessary evil - and are usually held outside of your main application tree - but still part of the project.  These should never contain any business logic or generate any output.

### Wowzies - thats quite a lot

Granted, setting up your first MVCFDH project can be daunting - there is so much to know, so much not to forget, and more so to actually code.  However, as with all good things in life, it usually takes a bit of work.  From experience, I can say that this has worked the best for ME.  My project has survived multiple versions of browsers, now two distinct request types, and 4 php upgrades (3 of which started using the MVCFDH).

### Also...

That name - MVCFDH - is too hard to say.  Major props to [Billy.brokeit](http://www.billygilbert.net) for asking me some questions at #superdev the other day about what I thought about MVC.  Such inspiration ;)
