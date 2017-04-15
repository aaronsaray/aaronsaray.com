---
layout: post
title: 'Trac Bookmarklet: load ticket number easily'
tags:
- IDE and Web Dev Tools
---
While communicating with other coworkers, they generally just give me a trac ticket # and not the full URL.  And, as a lazy programmer, I hate typing in the full URL or loading up trac and searching the #.  So, I generated this bookmarklet.  Replace the url with the root path to your trac instance.  Finally, create a bookmark and put the following content in it:

    javascript:var url='http://domain.com/trac';var p=prompt('Ticket #?');if(p)document.location.href=url+'/ticket/'+p;
    
