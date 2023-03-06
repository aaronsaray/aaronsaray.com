---
layout: post
title: Search Goodreads Bookmarklet
tags:
- javascript
---
When people suggest books to you, it's common that they'll send you a link to Amazon. If it's a good book, I want to add it to my Goodreads list so I remember to read it later.  This has been a pretty manual process, and that bothered me.  I looked and found some Google Chrome extensions, but those didn't seem to work for me anymore.  So, I created my own bookmarklet.

*tldr;* Drag this bookmarklet to your bookmark bar, click it when you're on an Amazon book page, and it'll open a new tab with the Goodreads page for that book. [Search Goodreads](javascript:(function(){let t=document.querySelector('#productDetailsTable');let i=t.innerHTML.match(/\d{3}\-\d{9,}/);if(i.length){let u='https://www.goodreads.com/search?q=' + i;window.open(u);}else{alert('Can not find ISBN');}})();)

Here is the source code for it.

```javascript
(function () {
  let t = document.querySelector('#productDetailsTable');
  let i = t.innerHTML.match(/\d{3}\-\d{9,}/);
  if (i.length) {
    let u = 'https://www.goodreads.com/search?q=' + i;
    window.open(u);
  } else {
    alert('Can not find ISBN');
  }
})();
```

This is a self-executing function in javascript.  It attempts to find the `productDetailsTable` id and get the inner HTML from that. If it can find an ISBN-13 format type number, it assumes that's the ISBN and opens a new tab executing a search.  Goodreads will automatically take you to the book page if it finds a search with just an ISBN.  If Amazon changes their page layout or you're not on a book page, it'll alert you that it can't find the ISBN.
