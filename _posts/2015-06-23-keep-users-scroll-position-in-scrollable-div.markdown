---
layout: post
title: Keep user's scroll position in scrollable div
tags:
- javascript
- jquery
---
The other day I was faced with an issue that I need to be able to keep the scroll position of a user in a overflow-y scrollable div.  Turns out - with a combination of javascript and local storage, this is pretty easy.

**TWO NOTES** First, instead of using local storage, you could also use a cookie.  And second, my project already had jQuery in it - it's not required for this solution.

```javascript
var $blockList = $('.block-list');
if ($blockList.length && window.localStorage) {
    $(window).on('unload', function () {
        var scrollPosition = $blockList.scrollTop();
        localStorage.setItem('blockListScrollPosition', scrollPosition);
    });

    var position = localStorage.getItem('blockListScrollPosition');
    if (position) {
        $blockList.scrollTop(position);
    }
}
```

In this example, the div (or really any element) has a class of 'block-list' to be used by this snippet.  Here's the outline of the functionality:

First, get the element that has .block-list as a class.
Next, if it exists and localStorage is available, do the functionality.
The functionality is to add an unload handler on the window object.  When the user leaves the page, the scroll top position will be set into local storage.
Finally, any time there is a stored value for the scroll position, the element is scrolled to that position.
