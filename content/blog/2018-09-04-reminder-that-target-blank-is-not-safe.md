---
title: Reminder That Target Blank Links Are Not Safe
date: 2018-09-04
tag:
- javascript
- html
- security
---
**tldr;** Remember to use `rel="noopener"` on `target="_blank"` links where you do not control the destination.

<!--more-->

When we consider sanitizing data, we think a lot about what's on our page. We want to make sure no javascript is inserted into our page. Once you get past our domain, though, all bets are off and we don't care.

But that attitude is wrong. In certain cases, the next page, a different domain, can also affect us slightly. With a bit of javascript and a new tab link, a malicious domain can redirect your site to a phishing website.  Now, you might say that's not a big deal - it's not actually attacking your site. But that's an ignorant attitude. We all need to do our part to help keep the internet safe.

Let's run through an example - then I'll show the code.

### Attack Vector

First, either you specifically create a link or you allow someone using your site to create a link.  The link opens in a new tab to a different domain.  You've accomplished this by saying `target="_blank"`.  

Then, the malicious new open tab redirects the `window.opener` to a site that looks a lot like yours but asks for a login. It might put a note on top that says "You've been signed out for inactivity" - which makes perfect sense if you think about it. The user was on a new tab - maybe they were there for a long time.  

Finally, the user logs into the phishing site, then the phishing site redirects them back to your previous page (remember, they had the `referer`) and everything looks good - because the user wasn't actually logged out anyway.  For bonus points - with a misconfigured website - they might indicate that you've successfully logged in using a `GET` query.

Let's take a look at how this code works.

**`https://one.com/index.html`**
```html
Cool thing <a href="https://two.com" target="_blank">click here</a>.
```

**`https://two.com/index.html`**
```html
<p>I can haz redirect your previous tab.</p>
```

And the javascript:

```javascript
window.opener.location = 'https://looks-like-one.com';
```

And boom, your previous tab is redirected to a site that looks like it's one.com but it's not.

### Mitigation Solution

The solution to this is very simple.  Whether coding your own links or parsing/sanitizing users' input, we can solve this with [rel noopener](https://developers.google.com/web/tools/lighthouse/audits/noopener).

**`https://one.com/index.html`**
```html
<a href="https://two.com" target="_blank" rel="noopener">click here</a>.
```

Now, the destination page does not have access to `window.opener` and you've done your part.
