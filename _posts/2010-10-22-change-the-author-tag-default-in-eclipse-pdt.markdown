---
layout: post
title: Change the @author tag default in Eclipse PDT
tags:
- Eclipse PDT
---
When creating a docblock in Eclipse PDT, if commenting is enabled, a template is inserted.  This template references the `$user` variable which is usually set to whichever user you are logged into your machine with.  You can change this variable on the command line every time you launch Eclipse if you really wanted to:
    
    eclipse -vmargs -Duser.name="Aaron Saray"

If you don't want to change the process you use to launch Eclipse, you can also just quickly change the template with these steps:

  1. Open Window Menu and click Preferences

  2. Expand PHP -> Code Style

  3. Click Code Templates

  4. On the right, expand Comments and click on Types

  5. Click the Edit button on the right and change `${user}` to your name

  6. Click OK a bunch
  