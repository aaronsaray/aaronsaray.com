---
layout: post
title: HTML 5 and Me - Draft 10 thoughts
tags:
- html
---

I thought I'd ramble on a bit about my thoughts on the HTML5 differences from HTML4 draft from working draft 10 in June 2008.  You can find it - or the newest one - here: [html5 diff](http://www.w3.org/TR/html5-diff/).

I'm eagerly watching HTML5 and XHTML2 - to see who comes out victorious.  I'm hoping one wins and that we get a better standard - but regardless, here are my thoughts - somewhat sporadic:

  * Open issues: longdesc and other accessbility options still open - yet there are laws (like section 508) that we're expected to follow, but even the developers of a new specific let this slide to the end, as if its not important.  Last time I checked, there was not a law making sure that the menu element was clearly marked...

  * Moving away from the SGML based doctypes, so no access to dtd needed which means can just use  now to enable standards mode.  Cool!

  * Semantically, leaps and bounds forwards with asides, headers, footers, nav, article, figure, etc.

  * I am Concerned that browsers will take more styling in on these items though.  For example, note that a select option is styled differently in Safari versus firefox.

  * Added embed, so hopefully a lot less of nesting object and embed to just show a piece of content.

  * Little confused by datagrid - is it used in conjunction with table?

  * How is datalist not just a different version of select?

  * event-source seems kinda cool - like you would be able to use it notify users of batch jobs finishing on the interface.

  * Input has new type attributes - like datetime.  It is suggested that the browser will be able to provide a calendar, but will that be a floating one?  It would be horrible if they decided to insert it into the dom right after the input box.

  * Links have ping attribute which will notify services for user tracking.  However, it is suggested to give the user an opt out option.  This doesn't solve the problem at all - because people will continue to use redirects and javascript tracking then.

  * Added autofocus to input, button, textarea.  This is cool because JS doesn't need to be written to look for it on load.

  * The form attribute of input tag allows it to be used for many more than just one form. This is cool because we don't have to write as much JS to get and share those values anymore.

  * form has a new element called data for prefilling items.  I'm concerned that newer programmers may use the password field in the auto-prefill sensitive data.  Probably won't do it on purpose, but imagine writing a loop in PHP that would just generate this data, without looking to make sure that it was a password.  Before you know it, the password is then cached in the page.

  * input has the new required attribute - which is cool - but how will the user experience be presented?  You obviously can't make a red border if your background is red....

  * The script has a new attribute called async - curious to hear more about that - seems to be a way to load scripts like the defer attribute.

  * Link element has a new attribute called sizes for different icon sizes.  This is cool because this is helping to provide better content for the web to desktop experience - ie - saving pages with a proper sized favicon for their desktop icon.

  * iframe has sandbox feature which would allow content to display, but have no control over the existing page.  This will be good to separate user input from page content.

  * The a element without a href provides a placeholder link - this is bad.  I just don't like it.

  * label's focus has changed - it no longer will focus the control it is associated with - unless that is the OS's major function.  Don't like that at all.  I think the focus control has raised usability.

  * no frames!!! yay!!

  * Dropped acronym because of confusion with abbr - just use abbr now. *sigh*

  * Accesskey is pretty much demolished - I guess we can do this with JS libraries... just seems like a weird change.

  * Got rid of longdesc on img  - good.  alt is enough in my opinion.

  * name on a tag no longer exists. should use ID, which I have been doing.  This is a programming change which I can see people forgetting, though.

  * Language attribute on script is gone.  Wonder how that will work with js vs vbscript... or do people no longer do vbscript?

  * Cool things that were removed: attributes align, alink, link,text,vlink,background,bgcolor, etc... all of that CSS based items.  The only thing that I have to work on myself is the size attribute which is now missing.  I used to use it to determine how many chars would display. Need to use css width instead - which I SHOULD have been doing anyway!

  * Other API's that are introduced include persistent storage, dragable items and registering for specific protocols for a web based application. This will be cool to see how these are implemented beside things like gears and the dragable libraries already in JS.

  * Another real cool thing - the getElementsByClassName() access for DOM based languages is now added.
  