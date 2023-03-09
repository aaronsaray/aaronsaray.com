---
title: 'Doctrine Error: Expected Plain Value'
date: 2015-03-19
tag:
- php
---
I'm so used to PHP's liberal allowance for single and double quotes, that I forget that other languages and tool-sets don't play that way.  Case in point, my most recent error:

<!--more-->
    
```txt
[Syntax Error] Expected PlainValue, got ''' at position 378 in class My\Bundle\App\Entity\ItemDefinition.
```

It was actually pretty difficult to search for `'` - so hopefully this will help someone else who is looking.  The solution?

Drum-roll please:  It's because in an annotation, single quotes were used instead of the required double quotes.
