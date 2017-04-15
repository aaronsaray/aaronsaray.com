---
layout: post
title: When to be OOP - and how much... Lesson Learned!
tags:
- PHP
- Website Monitoring Project
---
I just finished reading a snippet of a book about design patterns - of which Strategy, Adapter, Decorator and others were discussed.  It got me to thinking about my design patterns that I used in JEMDiary - and what I'll be using in this project.

The trouble comes when you start trying to figure out how implicit and explicit your OO design should become - for example, do you create a new object and rely on it to bring in its own db connection (and tightly couple it) or provide more public methods for it to explicitly create itself, passing in a db connection that hits an interfaced class instead.  Do you use the many strategy type patterns and keep a more loose architecture, or be more specific to your project and make it possibly more private (and more efficient)?

Well here is what I'm going to do...

In JEMDiary, I started with my first MVC architecture.  I learned a lot about separating business logic, display and navigation/redirection or "control".

I ended up making a few core classes - which in hindsight should have been abstract classes - but they were just base classes.  Then, I extended each of those to be more specific, but still worker classes.  So, all of my database classes extended the main DB class, blah blah blah.  I re-invented the wheel, and basically had my own PEAR classes (but in this particular case they extended PDO ;)).

Then, I moved on to develop my core directory layout.  I decided to put my control modules inside of the folder named 'view' with a specific view underneath it.  The reason I did this is because I assumed certain views might have different functionality (IE, you might not be able to do everything on your WAP view...).  So, I ended up making the file /view/browser/write.php - which was the controller for the browser view.  Inside of there, we made our decisions on whether to show a display, process a write or do a redirect.  The decision to show a view was a view class instantiation, the processing was a base model class.

There was another directory called MVC.  Inside of here, every single main model class was there in PHP files named after their class name (like PEAR).  Then, folders named after each of the base model classes had either more model, or a view folder with a view named class in it.  The directory separator was an underscore (like PEAR).

So, an example of our write.php class could be a filename of ('/view/browser/write.php')

```php?start_inline=1
$write = new JEMDiaryWrite_view_browser();
echo $write->output();
```

So, the model classes all had protected methods and variables... and were known to be extended by the view classes.  So, if our title of our module was set, it'd be set in model as a protected attribute and accessed through $this because we extended it.  So, it wasn't weird to end up seeing a class definition such as:

```php?start_inline=1
class JEMDiaryWrite_view_browser extends JEMDiaryWrite
```

The issue came from when I wanted to show the profile information in the read pages.  I had a read page display... but we can only extend one class at a time with PHP - so I wasn't able to extend the profile logic.  Instead, I had to create my own version of the profile object inside of the read view... - this was just stupid and redundant.

#### What could I have done better?  What will I do for this new project?

Well, I got 'protected-happy'... I wanted to protect everything all the time... which is an OK idea, but hard in concept.  One of the patterns I was just reading about was using data objects all the time.  So instead of having some protected array attributes, keep the logic private, but then create public objects.  This way they can have their attributes public, but not be coupled to the actual logic.  They can also "take responsibility" by having their own methods... Why is this important?  Take for example a row returned from a database.  It has a timestamp in mysql.  You may want to create this as a unix_timestamp.  You could create a new data object which would have this as one of its methods - so it could internally take control of that for you.

Another concern I had is that I'd end up switching hosting providers and then I'd have to write a new class FAST for my db connections and the like.  Well, if I had architected the classes differently, I could use an Adapter pattern to translate quickly enough.

All in all, I think I need to make my model classes more plug-able and strategy and decorator based.  Pass along the data objects instead of making all the data private.  I have to make sure I temper this design pattern with making sure I do keep some data private.  I know I'm not going to make the same mistake of extending the models with the view classes - heh!
