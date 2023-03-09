---
title: Use Netlify functions to proxy an API without CORS
date: 2022-08-21
tag:
- javascript
---
You've got a great idea, there's a free API, and you've got free hosting on Netlify. You're ready to begin. You request your first bit of data and you hit that infamous CORS error: `Cross-Origin Request Blocked: The Same Origin Policy disallows
reading the remote resource at https://some-url-here`. 

<!--more-->

Ahh! So now, you have to build a complex backend to deal with this. Or do you? If it's just something simple, you can use Netlify's functions to proxy the request. Let's walk through how.

First, let's break down what we want to do.  We want to make a website - for some reason - that shows the last time [chickenfacts.io](https://chickenfacts.io) was updated.  Luckily, there is an [API](https://github.com/aaronsaray/chickenfacts.io/blob/master/API.md) that you can retrieve.  Turns out you need to call the endpoint `https://chickenfacts.io/api/v1/facts.json` for a JSON return.  The field `last_counted` tells when the last update happened.

> I should point out that this is a contrived example.  There is actually no error with chickenfacts.io CORS - but since you're here, your API likely has one. So just use your API in this example. Why would you be trying to retrieve chicken facts anyway?

Next, with that information, you want to build a plain, simple vanilla JS app that inserts that information into a page and you're set.  (I'm building it in plain javascript - but this works with any Javascript framework - I didn't want to get distracted with things like React vs Vue).  Also, there are many ways to make this JS / HTML. The point is we're focusing on the most simplest way of demonstrating the Netlify functions. Don't get stuck on the other things.

## First, let's build out our HTML/JS

I'm going to assume that you're familiar with connecting Netlify to your Github repository and configuring it to deploy your code.  If not, you can check out their [great article here](https://www.netlify.com/blog/2016/09/29/a-step-by-step-guide-deploying-on-netlify/).

Let's take a look at our file.

{{< filename-header "index.html" >}}
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>When was chickenfacts.io last updated?</title>

  <style>
    body {
      margin: 0;
      height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  </style>
</head>
<body>
  <main>
    <h1>When was chickenfacts.io last updated?</h1>
    <h2 id="the-date">Loading...</h2>
</main>
<script>
  const theDate = document.getElementById('the-date');

  fetch('https://chickenfacts.io/api/v1/facts.json')
    .then(resp => resp.json())
    .then(data => {
      theDate.innerText = data.last_counted;
    });
</script>
</body>
</html>
```

First, there's just some simple CSS to center my `h1` and `h2` both horizontally and vertically.  The `h2` has an ID just to make it easier to target. It says "loading..." when it first loads.  Then, the javascript tries to get the data and assign it to the text.  Pretty simple.

But what about the error: `Access to fetch at 'https://chickenfacts.io/api/v1/facts.json' from origin 'http://127.0.0.1:8080' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource. If an opaque response serves your needs, set the request's mode to 'no-cors' to fetch the resource with CORS disabled.`

This means we're not going to be able to load this API as is.  (You can read more about what this means and why on [MDN's great resource on CORS errors](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS/Errors)).

So, we need to make a proxy with Netlify's functions.  (If you need, you can check out more about [Netlify functions here](https://docs.netlify.com/functions/overview/)).  Point is, we need to make a function that retrieves this data, then returns it to us in a way that we can deal with.

## Building the Netlify Function

I'm going to name my function `chickenfacts-facts` because I want the name to indicate the service I'm proxying and the end point I'm retrieving. I'll place it in a folder called `netlify/functions`. I'll name a folder `chickenfacts-facts` and the file will be called `index.js`. (Note: it is a synchronous function, otherwise we'd append `-background` to the name of the folder.)

{{< filename-header "netlify/functions/chicken-facts/index.js" >}}
```javascript
exports.handler = async () => {
  return {
    statusCode: 200,
    body: JSON.stringify({ last_counted: '2022-02-03' })
  }
};
```

This is just our first pass. I want to make sure that I can actually retrieve the response from my function. I will return a status code of 200, and I'm going to return a javascript object with the `last_counted` key like my chickenfacts API has. I want to change the front end javascript the littlest possible.

The way to call Netlify functions is to use a prefix of `/.netlify/functions/` and then the base name of the javascript file or the folder.  So I'll change my URL in my javascript and commit/deploy:

```javascript
fetch('/.netlify/functions/chickenfacts-facts')
  .then(resp => resp.json())
  .then(data => {
    theDate.innerText = data.last_counted;
  });
```

Sweet! After this deploy, now our site is retrieving the data that we hard-coded no problem.

So, the last step is that we need to retrieve the API data and send it back instead of hard-coding our stuff.

In order to do this, I'm going to need to install something like [node-fetch](https://www.npmjs.com/package/node-fetch) to use my favored fetch-style async behavior.  I can install the NPM package (now you can see why it's good to have a folder named after the function - now we can have a `package.json` with the function to instruct on the dependencies). We're going to use version 2 as it supports CommonJS.

```bash
cd netlify/functions/chickenfacts-facts
npm i node-fetch@2
```

Make sure to commit your `package.json` and lock file as well.  We also have to tell Netlify to install this for us during function build.  There are a number of ways to do this, but the easiest I found was to create a `netlify.toml` file at the root of your project - if you don't already have one - and add a line to install the plugin to install function requirements.

{{< filename-header "netlify.toml" >}}
```toml
[[plugins]]
  package = "@netlify/plugin-functions-install-core"
```

Now, Netlify will do the install during deploy.

Let's move on to modifying our function.

{{< filename-header "netlify/functions/chicken-facts/index.js" >}}
```javascript
const fetch = require('node-fetch')

exports.handler = async () => {
  let statusCode, data;

  try {
    const response = await fetch('https://chickenfacts.io/api/v1/facts.json');
    data = await response.json();
    statusCode = 200;
  } catch (err) {
    statusCode = err.statusCode || 500;
    data = { error: err.message };
  }

  return {
    statusCode,
    body: JSON.stringify(data)
  }
};
```

We now import the `node-fetch` library and make a request and process the JSON of the API.  I'm just assigning the data as retrieved to the `data` object.  If there is any error, we'll set the `statusCode` and `error` key on the data object.  Finally, we return these results.

**Success!** Now, we retrieve our data through a proxy using Netlify functions (still for free!) and can bypass the lack of appropriate CORS settings. No more error!

## End Notes

You should keep in mind that you can use this to hide your authentication or API keys (you can find out [more here](https://docs.netlify.com/functions/build-with-javascript/)) - but you should be careful as there are no limitations on this. It's up to you to lock down CORS on your own end point - as well as do any rate limiting or anything else to restrict abuse of your own functions.
