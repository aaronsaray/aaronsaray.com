---
layout: post
title: 'IE JS Error: Expected identifier, string or number'
tags:
- javascript
---
I just ran into this a bunch - works fine in FireFox ... of course.

Well apparently, Internet Explorer won't allow you to have a trailing comma in a array or object definition.  Let me show you:

```javascript
functionCall({
        options: {1,2,3},
        others: {1,2,3},
});
```

The trailing comma after the other's line is making IE expect another identifier.  So, just strip it out so that line is now:

    others: {1,2,3}
    
And you should be golden!

Now, if only IE told me what line the error was on ;)

(For those who need a tip, I loaded up the site in firefox with jsview extension - and went to view all js.  Then do ctrl-L to jump to a line - and type in the line number that IE mentions... see if there is something around there that looks like this scenario)
