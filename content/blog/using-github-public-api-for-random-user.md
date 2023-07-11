---
title: "Using Github Public Api for Random User Retrieval"
date: 2023-07-11T09:50:51-05:00
tag:
- archived-projects
- github
- javascript
---
Let's say you have a domain you're not going to use anymore that has to do with web development. What should you do with it? Obviously write some JS to redirect that domain to a random Github user's profile, right? Let me show you how.

<!--more-->

So, someone cold-emailed me a few years ago with [milwaukeewebdeveloper.com](https://milwaukeewebdeveloper.com) for sale. I thought great - I'll take it! It was about $300 I think.  Then, I used it to redirect to my blog site, later to my business site, and then later, I realized it wasn't the type of traffic I want. (In fact, there are a lot of Milwaukee-based web development firms I'd suggest you look at - compared to my more specialized services!)

So, while I'm letting it expire (yes I thought about trying to sell it again...) I wanted to do something interesting with it.  So, I deployed a [repo](https://github.com/aaronsaray/milwaukeewebdeveloper.com) on Netlify and let it go until it expires.

## What it does

So, what I wanted to do was query Github for a random user who's location was the Milwaukee area.  I didn't want to have to spin up a private api key, though, and use Netlify functions or something to secure it. I just wanted to do it JS.

Turns out the public API can provide this. It is pretty limited, but since it's public, it's limited by IP - which means each visitor of the site has their own limit - and it's not my responsibility. Yes!

## How to do it

While the existing site is a little bit more complicated, this is the basics of what is needed.

First, the HTML.

```html
<html>
  <body>
    <h1>Redirecting to MKE Github</h1>
    <script>
      // see script below
    </script>
  </body>
</html>
```

I added more to my version (like a spinner, some style, etc) - but basically I want just a page to let the visitor know what they're about to do. There is no artificial wait, so some users may not even see this page.

Then, the inline script looks like this:

```javascript
const githubUrl = new URL('https://api.github.com/search/users');
githubUrl.searchParams.append('per_page', '1');
githubUrl.searchParams.append('page', Math.floor(Math.random() * 1000)) + 1;
githubUrl.searchParams.append('q', 'repos:>0 location:milwaukee type:user');
githubUrl.searchParams.append('order', Math.random() < 0.5 ? 'asc' : 'desc');

const sortOption = Math.floor(Math.random() * 4) + 1;
if (sortOption > 1) {
  sortOption === 2 && (githubUrl.searchParams.append('sort', 'joined'));
  sortOption === 3 && (githubUrl.searchParams.append('sort', 'followers'));
  sortOption === 4 && (githubUrl.searchParams.append('sort', 'repositories'));
}

fetch(githubUrl)
  .then(response => response.json())
  .then(data => window.location.href = data.items[0].html_url);
```

So let's dissect this.  First, there are other ways to do this easily with the Octokit JS SDK that they provide. However, that's a whole dependency I didn't want or need - so it's just plain vanilla JS.

First caveat of this implementation: Github only allows up to 1000 results, so instead of retrieving 1000 and trying to pick a random one, I decided to say 1 per page, and make the page number a random number up to 1000.  This way the random page is only one user - and it's only one record to send over the wire.

Next, the URL is created with the Javascript URL object. This makes it easy to use in the fetch as well as to add fully escaped parameters to.

The search term `q` can contain some magic search terms for Github.  In order to make this interesting, I made sure that I'm searching for more than zero repos (so they're somewhat interesting users) and that their location is milwaukee - and finally that they're a user, and not an organization.

Finally, there are 4 sort options. The default sort option is like a 'best match' sort of relevancy thing - which has no sort option.  The rest are by joined date, followers numbers, and number of repositories.  So I pick a random thing out of the 4 by appending one of three options to it - or leaving it blank for the 4th.

After that, there's no error handling or anything - it just redirects to that user's profile url from the Github payload.

## End Notes

You probably shouldn't do it this way for anything that matters. Create an account, get a higher throttle, and use more intelligence with your retrieval and error handling. But, this is a nice starting point or something that can be fun.

Can you tell I'm old and remember the random web link circles that people used to join?