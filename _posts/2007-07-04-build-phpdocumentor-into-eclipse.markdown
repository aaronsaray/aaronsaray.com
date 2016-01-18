---
layout: post
title: Build PHPDocumentor into Eclipse
tags:
- Eclipse PDT
- PHP
---

Well, maybe thats a little bit misleading - actually you're running PHPdocumentor as an external tool.

[This wiki article](http://www.plog4u.org/index.php/Using_PHPEclipse_:_Installation_:_Installing_the_phpDocumentor) gives the steps to configure the documenting package into your eclipse instance.   I've followed these instructions and find it almost near perfect.

However, at ("the triangle"), I've been thinking about implementing a new method for documenting.  Instead of making our output directory relative to the current path, we'll be path-ing it to the release folder's documentation subfolder.  After each project goes to production, it'll be up to the developer to run and update the newest documentation.  Part of the development cycle will be creating the documentation and correcting any errors.  I look forward to this - and thanks to those guys for documenting and tutorial-izing it.
