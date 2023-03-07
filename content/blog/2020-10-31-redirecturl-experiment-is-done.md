---
title: The RedirectURL Experiment is Done
date: 2020-10-31
tags:
- business
- archived-projects
---
This is a tech and business blog, so I normally don't get too deep or emotional. But, I've got to talk a bit about my dream and what I've learned.

<!--more-->

It's important to have dreams, to have goals, to have something to hope for. Especially during hard times (record unemployment, a pandemic, 11 different singing competition shows),
you need to have something to look forward to.  One of my goals is to have a "side project" that generates some revenue.
I've always created random projects to learn the newest tech and to give back to open source.  But, as I get older, I realize that
I might also like to have diversified income. I'd like to not be grinding it out forever - I'd like to invest in my future and myself.

So, I have dreams. I have ideas. I try them out. Most fail.

### The Genesis of RedirectURL

One idea I had was an app called [Possessor]({{< ref "/blog/2019-08-26-the-end-of-possessor" >}}).  I had been using services that had required
me to validate and verify that I owned my domain. Each one seemed to have a different way of doing things. I wondered: could I make an application
that other companies could integrate with that would help them verify that you "possessed" ownership to something you claimed.  I could use
all of those systems that other companies have described, but be more of an aggregator. If I said you owned it, you didn't have to ... say... put in a TXT
record for Google but put in a XML file in your doc root for Microsoft.  Companies like that would just call Possessor and say "do you have ownership"
of this?  If not, they'd receive the instructions from Possessor so that you could set up the verification. It would be very
transparent.

Well, that didn't work.  You can [read here]({{< ref "/blog/2019-08-26-the-end-of-possessor" >}}) to find out more about it.

So when this was done, I really wanted to redirect the Possessor URL to the blog entry I had written about it. I went to my Registrar Namecheap
to redirect the domain. A lot of these registrars offer this service for free. That's when I realized that `.app` domains required the domain to be
SSL, and Namecheap (like most other registrars) didn't redirect SSL, they only redirected non-ssl.  Dang!

So, I went to my next tool: Cloudflare.  At that point in time, I think the plans were set up that you might have a few rules to do redirects, but
very soon it was no longer free.  It required you to pay for a redirect, which I didn't want to do.  (Turns out, I've figured out that you can do
a good bit of this actually for free. I just didn't see that.) I also thought the average user a) didn't want to muck about in the complex rules
system of Cloudflare and b) might not even know how that works.  So RedirectURL was born.

### Implementing RedirectURL

I decided to work with [Joel](https://joelclermont.com) as a partner for my new product RedirectURL.  I knew that at some point
I might want to have a pretty scalable infrastructure and I'd need some cloud configured services.  I spend a lot of my time in application 
programming, but I knew he knew his way around AWS and Azure pretty well.  So, we decided to work together.

I wrote some Articles about redirecting URLs in Nginx, Apache and WordPress (I had Joel do IIS).  I figured that would attract
visitors / searchers.  Then, I pitched you could redirect any URL for free.

The unique thing we did that most registrars didn't do was that we created a Let's Encrypt SSL certificate for your redirect.

I created a Laravel application that would provide the free services (simple redirects) as well as the subscription paid services
(complex near-regex redirects).  The idea was at some point to allow a higher tier too for Agencies that might want to upload
entire spreadsheets of URLs to redirect.  And I wanted to make an API that would allow us to make WordPress plugins and things like
that.

Joel created the infrastructure to work with Caddy and host the SSL certs and provide the redirects. He also made cloud functions
to check DNS, verify configuration and provision new services.

### Challenges

With subdomains, you can easily tell people to point to a CNAME in DNS and you can do the redirect.  With top level domains, you have
to use an A record (unless your registrar supports CNAME flattening - which most don't).  The challenge is we needed people to
alter their DNS services and add in an IP - which may actually change in the future.

Motivation was also a factor.  I'm not a marketer, so we didn't see much traffic.  We didn't market it that well, either.
I think this was something that I wanted but Joel didn't really. He just wanted to work on the project with me so we'd learn together. 

### Just Not Worth It

There are a number of features I still wanted to build, but I never seemed to get around to them.  So that meant that both
partners weren't really that excited about building on it.  I also wanted to move hosting, and that would require IP moves.
The last straw was logging in and seeing only 1 (free) user, no paid users, and only 35 or so new visitors a month!!  
Or maybe the final straw was that Joel convinced me that Cloudlfare could actually do what I needed. I had lost my founders'
insanity and was now open to listening to him again.

So I shut it down.  And you might be here (probably not) from the redirect URL handled by Cloudflare.

### Haven't You Given Up on a Lot?

If you're an active reader, you wouldn't be out of line to ask "Haven't you shut down and given up on a lot of ideas?"
You're right. I have tried a lot of things and shut down a lot of things.  But that's what I really wanted to talk about now.

It's not a bad thing to fail. Failure is what teaches us. Any one who practices a sport knows that it's all of their failures
that makes the practice worth while.  It's a chicken and egg - if you didn't fail, you wouldn't need practice - but the more you
practice, the more you experience failure.

But you also start to experience success. It's just how you measure it.

It's been quite trying to think about this lately. I do sometimes feel like a failure. Every idea I seem to come up with
seems to wither away and die. I'm shutting things down left and right.  But, I'm learning a LOT.

Success seems easy when we look at the end result.  We don't see all the times that these people have failed. And, the 
successful thing is much more exciting to talk about than all the failures. I don't feel alone with all of my challenges.
That doesn't mean it's easy, though.

It's ok to fail. But failing, shutting things down, and moving on - is not giving up. I learn from every new thing I do
and make more adjustments.  I think RedirectURL was probably one of the most ambitious things I took on (besides working
on my own with my own company [More Better Faster](https://morebetterfaster.io)). And I've learned a lot.

### What Have I Learned?

Writing about failure takes vulnerability - if you're willing to admit what you failed, why, and what you learned. Otherwise
it's just venting and complaining.  Let me try to distill what I've learned.  (Again, I don't hazard that my regular readers
actually care about my thoughts - just my technical and business tips I share - but I think there's valuable business-related
and self-help related items in this summary list).

* Know your limitations in business.  I have more of an operations mind, less of a sales and marketing mind. I think in the
future I need to partner with the skill, ability and desire to market and drive sales.

* Understand that both partners need to equally love the product. Joel is freaken amazing.  But I don't think his heart
was much into the product as I was.  Again, he was right, I was just too stubborn to realize that Cloudfront could handle it.
But I think if you work with something with a partner, you need to make sure they're calibrated with you on the desire and 
mental investment.

* Know your customer.  I didn't really narrow in on my customer right. It was someone who would know enough to change
their DNS, but not want to set up a redirect in Cloudflare or on a server.  It was someone who was potentially needing
a complex redirect, would be willing to pay me for it, but didn't want to set it up. It was kind of a narrow sub-set of 
people. Yeah, I did dogfood my own product, but... yeah. Turns out it was a customer segment I didn't want to support either.
Almost one of those knows just enough to be dangerous group.

### Final Notes

Honestly, I got a bit depressed when I realized it was time to shut down RedirectURL. Another failure.  But, I did learn
a lot. And getting rid of non-performing projects, products and assets lowers the cognitive load - so I can be ready
to do something new, and even better!  

Remember, failing is part of learning. If you move on and learn, shutting things down is not giving up.
