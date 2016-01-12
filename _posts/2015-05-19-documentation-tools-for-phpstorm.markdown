---
author: aaron
comments: true
date: 2015-05-19 19:56:05+00:00
layout: post
slug: documentation-tools-for-phpstorm
title: Documentation Tools for PHPStorm
wordpress_id: 1815
categories:
- web tools
tags:
- web tools
---

I like when projects have documentation, yet I hate writing it.  That's why I rely on [phpDocumentor](http://www.phpdoc.org/) to do most of my documentation for my project.  Recently, I've also discovered a new tool for documenting my API: [ApiDoc](http://apidocjs.com/).  I've also been relying heavily on vagrant for my projects.  

So, when it came to generating this documentation, I wanted to make sure that I didn't have to do too much work.  So, I configured PHPStorm with external tools over SSH using vagrant configurations to do this.

Let's have a quick look:



### Setting up the Tools


First, [install phpDocumentor](http://www.phpdoc.org/docs/latest/getting-started/installing.html) to your virtual machine.  I happened to have mine installed as a global binary on this project vm.

Second, [install apiDoc](http://apidocjs.com/#install) using npm.

Next, Go to the **PHPStorm preferences > Tools > Remote SSH External Tools**.

Click the **+** button to add a new tool:
[![Screenshot 2015-04-05 18.15.42](http://aaronsaray.com/wp-content/uploads/2015/04/Screenshot-2015-04-05-18.15.42-150x150.png)](http://aaronsaray.com/wp-content/uploads/2015/04/Screenshot-2015-04-05-18.15.42.png)



  * Enter php doc as the name.  You can group it differently if you'd like.


  * Leave most of the options at defaults.  I chose to leave it as Current Vagrant.  (if you don't have this option, you might not have vagrant installed in this project.  You may want to choose a default remote interpreter instead.)


  * I entered phpdocumentor as the program because I have it installed as a global command.  This might be something like "php path/to/phpdoc/bin" if you have it installed with composer.


  * Finally, I put my parameters in the parameters input box.  You can set your own based on the phpdocumentor cli options, but mine basically says the source code directory (-d) and the output location (-t)


Click OK and you're good to go for phpdocumentor.

The same configuration can be done with apiDoc.  For parameters, I used "-i /path/to/api.php -o /path/to/api/doc/output".   

[![Screenshot 2015-04-05 18.21.11](http://aaronsaray.com/wp-content/uploads/2015/04/Screenshot-2015-04-05-18.21.11-300x282.png)](http://aaronsaray.com/wp-content/uploads/2015/04/Screenshot-2015-04-05-18.21.11.png)After you save this, you now have external tools available to use in PHPStorm.  You simply have to click on the Tools menu, hover over External tools, and choose your tool from the menu.  (Note, if you have used vagrant, it may ask you to confirm you'd like to use the current vagrant instance each time you run the tool.)  Also, if you chose a different group for the commands, the menu will be different.


