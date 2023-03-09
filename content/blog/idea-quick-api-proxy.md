---
title: Idea - Quick API Proxy service
date: 2022-10-02
tag:
- ideas
---
I have a long history of sharing [ideas](/tag/ideas/) on this blog for services/sites/utilities. Here's the newest one: a very cheap service to proxy API requests that don't have open CORS requests / require an API key.

<!--more-->

Here's are the two problems... 

First, you're a front end developer that wants to use an API but that API doesn't have CORS configuration enabled.  You can't retrieve the API data in your app, so you must develop some sort of back end service to retrieve it and just proxy it forward (there used to be a heroku app running to do this but it was very slow.)

Second problem: you have an API that you want to read data from, but it requires an API key. You don't necessarily want to create a full backend for this - you'd rather just pay $5/mo (or something) and work with a proxy that sends your API key, but keeps it secret from the front end.

**Solution** Quick API Proxy Service.  You use this product to secure your end point and hide your API key.  It provides access to any browser with the proper CORS configuration. It can send along your hidden and secured API key and acts like a proxy.

Let's look at a simple example.  Let's say you have an API that you'd like to hit:

`https://api-with-no-cors.com/api?search=term`

or

`https://secured-api.com/api?search=term&key=secret`

(this would work even with an authorization header instead of a GET parameter key)

Instead, you could hit:

`https://quickapi.com/your-random-uuid-here/api?search=term`

The tool would know that the UUID was your configuration - and your configuration was to set up the root of the URL as well as the secret key if applicable.  Then it would work as a proxy.

Let's talk about the actual business:

## Billing:

**Free tier:** 100 calls a month, 1 secret or key appended as a request parameter or header.

**Little Project tier:** 10k calls a month, unlimited secrets or keys appended to a request or header. Custom defined CORS headers. Define referrer limitations. $50/year

**Major Project tier:** Unlimited calls (within reason), the rest of little project features, the ability to limit end points that can be called / methods on the destination API.  $500/year

## Implementation:

Use Cloudflare workers with a custom domain.  Use Cloudflare KV storage to look up configuration and map the data.  Use something like Okta or Auth0 to build a validation layer for configuration.  Store a configuration single page app on Cloudflare pages.

## Concerns:

* What are the costs for requests / bandwidth / storage at Cloudflare. It's pretty cheap but would there be enough paid plans to pay for the freemium model.
* If someone can pay $500 a year for this (or more) - are they already a customer who is willing to just build a back-end?  If they could do it themselves, it's cheap - if they have to pay for someone to do it for them, then this is still affordable.
* Can this / or I should say, how will this be abused? Is this why the Heroku one was slow and is sometimes not available?
* What would I use for email verification? Maybe the twilio email verification? Is that needed for billing? What do we need to stop bots for free version?
* How will people who need this know how to find this - there's a lot of SEO that needs to happen to match the people who need this

## End Notes

Overall I like the idea, but I'm sharing it here because I don't see it as something that I can make profitable.  Be a great project for a beginning programmer, though!  Let me know if you build something similar!
