---
layout: post
title: Dialing Phone Numbers from a Webpage
tags:
- mobile
---

I've recently been investigating making some better mobile accessible pages for some of my projects.  I've seen pages that allow you to dial a phone number directly from the webpage - so I thought I'd investigate...



#### WTAI - Mobile Protocol


The WTAI protocol is a robust set of specs to add additional functionality to web accessible phones (see more here on the [OMA Technical Section](http://www.openmobilealliance.org/tech/affiliates/wap/wapindex.html)).  What I'm really interested in, however, is the ability to dial a phone number and add a phone number to the contacts.  I've also heard tell that some phones do not automatically prompt the user for running this command.  My moto q9c does.  Just keep this in mind when using these commands for designing your pages.



##### Dial a Phone Number


The first number we're going to Dial is 414.555.1212.  From a usability point of view, you should also clearly label your link.  The format for this link is:


    
    
    wtai://wp/mc;##########
    



The #'s represent the phone number.  See my example code:


{% highlight HTML %}
<strong>Call me now: </strong><a href="wtai://wp/mc;4145551212">414.555.1212</a>
{% endhighlight %}
    



Obviously, this will make the link access the WTAI protocol dialing method.



##### Storing a Contact



The format for this is similar:


    
    
    wtai://wp/ap;##########;XXXXXXXXXXXXXX
    



The #'s represent the phone number, the X's represent the name the contact will be stored as.  See my code example:


    
{% highlight HTML %}
<a href="wtai://wp/ap;4145551212;Aaron Saray">Add Me to your contacts</a>
{% endhighlight %}
