---
layout: post
title: Tamper Data Firefox Extension - is it worth it?
tags:
- IDE and Web Dev Tools
---

As you can probably tell from my last test of a firefox extension [here](http://aaronsaray.com/blog/2007/06/24/load-time-analyzer-for-firefox/), I am constantly looking for new tools to make my job more accurate (see: lazier).  Another similar extension I came across is [Tamper Data](https://addons.mozilla.org/en-US/firefox/addon/966).  Tamper Data doesn't have alot of documentation, so it was harder to actually determine the uses of this extension.  Some tutorials on the net claimed that Tamper Data was better than Live Headers or Load Time Analyzer.  So, I decided to try it out.  Lets see some screenshots and some features:

**Lets Start Tamper Data**

I went to the tools menu of my firefox and choose tamper data.  I also clicked on the Start Tamper option, and then loaded up my favorite test website, the [free online diary site, JEMDiary](http://www.jemdiary.com). Right away, I was prompted with a message box - tamper the data, submit it, or abort.

[![tamperprompt.gif](http://aaronsaray.com/blog/wp-content/uploads/2007/07/tamperprompt.thumbnail.gif)](http://aaronsaray.com/blog/wp-content/uploads/2007/07/tamperprompt.gif)

Its useful to note that the Abort option stops that particular request.  If we started our request, and clicked abort, we're done.  It is also good to note that if you start tampering with images, and other includes (an option in the options dialog of tamper data), you could abort individual requests (yay! a website with no css!).

You can also click 'submit' which will submit the request with no tampering.

Finally, you can click tamper to modify the request, like this:

[![tamperitem.gif](http://aaronsaray.com/blog/wp-content/uploads/2007/07/tamperitem.thumbnail.gif)](http://aaronsaray.com/blog/wp-content/uploads/2007/07/tamperitem.gif)

This page shows the request and allows you to modify some of the request options as you can see.  Additionally, you can add post variables one by one, or many, or even from a file (the menu on the page is a right click option).  After you've customized this, you can submit the tamper (this is soooo much easier than our good ol telnet...)

**The Results Are In**

After you've requested the entire website, you'll receive the following dialog.

[![tamperresults.gif](http://aaronsaray.com/blog/wp-content/uploads/2007/07/tamperresults.thumbnail.gif)](http://aaronsaray.com/blog/wp-content/uploads/2007/07/tamperresults.gif)

This shows each of the requests, their header results and accepts, the order, the time, OH MY!!  So much info!  But it gets better.  Your right click menu brings in the options to view the source of the item, view them in your browser (from the cache), replay the request, and more.  Additionally, you can graph one item or all items (like the other plugins).

[![tampergraph.gif](http://aaronsaray.com/blog/wp-content/uploads/2007/07/tampergraph.thumbnail.gif)](http://aaronsaray.com/blog/wp-content/uploads/2007/07/tampergraph.gif)

**Give me more customization!**

So lets bring up the options for this plugin.

[![tamperoption.gif](http://aaronsaray.com/blog/wp-content/uploads/2007/07/tamperoption.thumbnail.gif)](http://aaronsaray.com/blog/wp-content/uploads/2007/07/tamperoption.gif)

The options here include the ability to tamper with the request or all items, cache our data, and add in additional preset tamper options (side note: although that option looks cool, I haven't found the way to use them!! I'm sure I'm just missing it...)  I expected more configuration options... oh well.

**Is it worthwhile?**

It all comes down to what you're looking to do.  IF you have a legitimate use in your testing (ie you're working directly with headers or you're vuln testing), this tool is a no brainer - get it!  However, if you're working on standard development, or just curious from time to time on your headers, you should go with the Load Time Analyzer instead - because of its advanced configuration options.  It does what it does better.
