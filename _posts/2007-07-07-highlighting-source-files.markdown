---
author: aaron
comments: true
date: 2007-07-07 01:52:00+00:00
layout: post
slug: highlighting-source-files
title: Highlighting Source Files
wordpress_id: 40
categories:
- Misc Web Design
---

I have been writing code snippets in this wordpress blog alot - and I wanted to possibly have the code highlighted.  One of the things that happened with code highlighting plugins I've noticed is that the code has to be valid (I've posted invalid PHP because stupid wordpress kept eating it) or one type of code (I post javascript/html combinations, with ellipses and such...), and so I finally decided to not highlight my code - unless I could find a really cool code highlighting plugin.  But along the way, I discovered some really cool tools that might be useful.

<!-- more --> The first place I looked at was the PHP functions of [highlight_file](http://us2.php.net/highlight_file) and [highlight_string](http://us2.php.net/manual/en/function.highlight-string.php).  While this is great for PHP... but didn't really do line numbers or anything.  This was ok, but I wanted a better solution - I'm a huge fan of line numbers (thank you IDEs!).  Well, this really cool script by Aidan called [PHP_highlight](http://aidanlister.com/repos/v/PHP_Highlight.php) is awesome!  It offers alot of cool features beyond the standard highlighting.

But what about my Komodo IDE and Eclipse and all those others that do a ton of highlighting... Well, enter [GeSHi](http://qbnz.com/highlighter/index.php).  GeSHi is the Generic Syntax Highlighter.  It supports the following languages:

Actionscript, ADA, Apache Log, AppleScript, ASM, ASP, AutoIT, Backus-Naur form, Bash,  BlitzBasic, C, C for Macs, C#, C++, CAD DCL, CadLisp, CFDG, ColdFusion, CSS, Delphi, DIV, DOS, Eiffel, Fortran, FreeBasic, GML, Groovy, HTML, Inno, IO, Java, Java 5, Javascript, LaTeX, Lisp, Lua, Microprocessor ASM, mIRC, MySQL, NSIS, Objective C, OCaml, OpenOffice BASIC, Oracle 8 SQL, Pascal, Perl, PHP, PL/SQL, Python, Q(uick)BASIC, robots.txt, Ruby, SAS, Scheme, SDLBasic, Smalltalk, Smarty, SQL, T-SQL, TCL, thinBasic, Uno IDL, VB.NET, Visual BASIC, Visual Fox Pro, Winbatch, X++, XML,  Z80 ASM.

I love this!!  If I had to do source highlighting, I'm going to use GeSHI.
