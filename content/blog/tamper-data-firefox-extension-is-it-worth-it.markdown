---
title: Tamper Data Firefox Extension - is it worth it?
date: 2007-07-04
tag:
- ide-and-web-dev-tools
---
As you can probably tell from my last test of a firefox extension [here]({{< ref "/blog/load-time-analyzer-for-firefox" >}}), I am constantly looking for new tools to make my job more accurate (see: lazier).  Another similar extension I came across is [Tamper Data](https://addons.mozilla.org/en-US/firefox/addon/966).  Tamper Data doesn't have a lot of documentation, so it was harder to actually determine the uses of this extension.  Some tutorials on the net claimed that Tamper Data was better than Live Headers or Load Time Analyzer.  So, I decided to try it out.  Let's see some screenshots and some features:

<!--more-->

**Let's Start Tamper Data**

I went to the tools menu of my firefox and choose tamper data.  I also clicked on the Start Tamper option, and then loaded up my favorite test website, the [free online diary site, JEMDiary](http://www.jemdiary.com). Right away, I was prompted with a message box - tamper the data, submit it, or abort.

{{< image src="/uploads/2007/tamperprompt.gif" thumb="/uploads/2007/tamperprompt.thumbnail.gif" alt="Screenshot" >}}

It's useful to note that the Abort option stops that particular request.  If we started our request, and clicked abort, we're done.  It is also good to note that if you start tampering with images, and other includes (an option in the options dialog of tamper data), you could abort individual requests (yay! a website with no css!).

You can also click 'submit' which will submit the request with no tampering.

Finally, you can click tamper to modify the request, like this:

{{< image src="/uploads/2007/tamperitem.gif" thumb="/uploads/2007/tamperitem.thumbnail.gif" alt="Screenshot" >}}

This page shows the request and allows you to modify some of the request options as you can see.  Additionally, you can add post variables one by one, or many, or even from a file (the menu on the page is a right click option).  After you've customized this, you can submit the tamper (this is soooo much easier than our good ol telnet...)

**The Results Are In**

After you've requested the entire website, you'll receive the following dialog.

{{< image src="/uploads/2007/tamperresults.gif" thumb="/uploads/2007/tamperresults.thumbnail.gif" alt="Screenshot" >}}

This shows each of the requests, their header results and accepts, the order, the time, OH MY!!  So much info!  But it gets better.  Your right click menu brings in the options to view the source of the item, view them in your browser (from the cache), replay the request, and more.  Additionally, you can graph one item or all items (like the other plugins).

{{< image src="/uploads/2007/tampergraph.gif" thumb="/uploads/2007/tampergraph.thumbnail.gif" alt="Screenshot" >}}

**Give me more customization!**

So let's bring up the options for this plugin.

{{< image src="/uploads/2007/tamperoption.gif" thumb="/uploads/2007/tamperoption.thumbnail.gif" alt="Screenshot" >}}

The options here include the ability to tamper with the request or all items, cache our data, and add in additional preset tamper options (side note: although that option looks cool, I haven't found the way to use them!! I'm sure I'm just missing it...)  I expected more configuration options... oh well.

**Is it worthwhile?**

It all comes down to what you're looking to do.  IF you have a legitimate use in your testing (ie you're working directly with headers or you're vuln testing), this tool is a no-brain-er - get it!  However, if you're working on standard development, or just curious from time to time on your headers, you should go with the Load Time Analyzer instead - because of its advanced configuration options.  It does what it does better.
