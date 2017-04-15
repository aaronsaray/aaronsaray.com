---
layout: post
title: 'Zend Framework: to include or not to include'
tags:
- zend framework
---

There are two ways of working with Zend Framework as a library in your project.  These are including it in your project repository and using a shared copy on the server (like PEAR).  Let us discuss both:

### Including Zend Framework In Your Project


The first method is to include the Zend Framework library folder in your zend framework project's library folder (uh....).  So, for each project on your server that is built on Zend Framework, the following path has a copy of Zend Framework:  /root/to/your/app/library/Zend.  This means each project has at least the entire size of the Zend Framework in it.  Pros/Cons?





  * **Pro:** Can control the exact version of Zend Framework with this project.  A server zend-framework upgrade won't potentially hose up your project.


  * **Con:** Have to update ZF in each project on the server when an update comes.


  * **Con:** Takes up considerable space in the code base.


  * **Pro:** Easier IDE configuration.  It can find all the code easily in this project (true: you could configure your IDE to use other libraries that aren't in the project)


  * **Pro:** Migrating to a new server, just one less thing to consider when setting up.  Code with the ZF in it is fully contained and deployable anywhere.






### Using Zend Framework as a server wide install


Like PEAR, Zend Framework can be installed on the server in a shared location.  You may install your Zend Framework Library folder into a different path, for example: /root/to/shared/code/Zend.  Then, your PHP has to be configured to have that in its include path.  Pros/Cons?





  * **Pro:** Any project at any location on your server has access to Zend Framework.  As you know, you can only pick pieces of ZF to use, like the PDF functionality.  May make it easier to transition project from legacy code to ZF.


  * **Pro:** When an update comes, it can be applied only one time to the shared location.


  * **Con:** Updating shared code could break an application - all need to be tested with new code.


  * **Pro:** Save code space in your code repository.



Currently, I'm going with including it each project as a point of preference.  I think the risks outweigh the possible time/storage savings.  So, what are your thoughts?
