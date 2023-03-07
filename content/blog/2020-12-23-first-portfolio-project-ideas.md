---
title: Coming Up With Your First Portfolio Project (with coding walkthrough)
date: 2020-12-23
tag:
- javascript
- html
- css
- business
---
When talking to junior developers, I hear the same question over and over: "how can I demonstrate what I know, or show experience, if I haven't had any gigs yet?" Old-timers tell you to build a portfolio, but how do you do that? Where do you get ideas? How do you choose a project that's not overwhelming?  Let me explain my rationale as well as demonstrate how I might make my first portfolio project.

<!--more-->

### Who Is This For?

The short answer is everyone.  You should make a portfolio project or an example project if...

* You're just getting started and you need some way to demonstrate your work
* You're switching careers again, maybe from management back to dev, and you don't have any recent work to show
* You have lots of experience but all of your work is behind closed doors
* You have to learn a new technology, so why not be a bit structured about it before you have to actually use it for your job

No matter who you are, you will find yourself making portfolio or example projects throughout your career. It's about time that we learn how to do this successfully.

### How To Get Started

First, you have to have a general idea of what technologies you want to use or demonstrate.  Then, you need to scope it down to a manageable size. Don't allow scope-creep into your own ideas (it's hard to manage this when you're working for a client, why do you let it happen to your own projects?  Feeling empathetic now, hrm?)  Finally, it needs to be ripe for iterations and expansions.  Let's dig in.

You have to pick the general technologies you want to work with. I'm in favor of starting out simple and then expanding.  You want to build your house on a good foundation.  For example, if you want to work for a React developer shop, but you haven't programmed at all, I wouldn't reach for React right away.  React is a library on top of Javascript. I'd start with Javascript as my base.  Then, when it comes to display, I could choose something like Bootstrap, Foundation, Tailwind or any number of CSS frameworks.  But, do I need all of that? Do I really need to learn something huge and new? I'm only going to need _some_ styles: start simple, just work in plain CSS.

Scoping to manageable size is actually harder than you think.  When its something you're excited about, you'd be surprised about all of the ideas that start flowing in while you're working. But, it's important to have an end in mind.  Remember, this is about having a piece to show.  Trust me, as a hiring manager, I'd rather see a completed piece of work at a lower skill-level, than a fractured pile of half-finished code at a higher level.  So, keep your todo list small and put off future ideas until later.

Finally, iteration.  It's important to have a piece of work at a finished block (as discussed above), but be able to make changes on top of it.  It's rare that projects in the real world are green-field (brand new, from scratch).  You're likely going to be taking something and then building on top of it. By making sure you have room for iteration, you can demonstrate that skill as well.

What things can you iterate on? Well, first, you can do technology.  Remember we picked very simple technology to get started? What would it look like to swap out your plain CSS with a CSS framework? What about introducing Vue or React?  Or, if your project is finished, now what does adding a new feature look like?

### The Idea Picking Process

How do I come up with an idea? What tech do I choose?

The idea can come up from anything in life.  What is something you use very often? Could you make a duplicate of it?  Remember, your version can be "worse" and not competitive. This is just for demonstration purposes.  

What technologies have you heard of lately? What do you wish you knew? What jobs are most common in your area? Or in the company you want to work for?

#### The Idea

I use the Carrot Weather App a lot on my phone -- every day actually.  I think I'd like to make my own "weather app."  I could get the location of the visitor, get a weather feed, show a nice image of the weather and then display the details.  Doesn't seem that hard.

#### Technology

I've been hearing a lot about Google's Materialize CSS Framework. I also heard a lot about PreactJS - which sounds like a React alternative - smaller and more efficient.  I would like to learn those particular technologies I think.  I think I'll make a webpage that uses these technologies to show my weather.

### Reducing Scope

I did some research about finding the user's location. It looks like it could be complex. Different browsers may deal with it different ways.  Sometimes visitors don't give permission to expose it to you. Other times it may not be fully accurate.  I think this is a good example of an area I can split off for iteration.  For the time being, I'm going to just hard-code a location.

I know that Preact requires me to learn how reactive javascript works.  Maybe I don't know how this works yet, or what this even means.  So, in the mean time, I am going to follow my above advice and just do this with simple Javascript.  I think that if I use plain Javascript, it would not be that hard to implement it in Preact as a revision later.  But, I do know that learning Javascript AND learning Preact can be overwhelming.

This CSS I have to make for this project seems pretty simple. It won't even have any interactions, so I don't need any buttons.  I only want imagery and simple layout.  I can probably do this in plain CSS. If I need more complexity later, I can use a framework to help me and guide in making design choices to save time.

So, it appears I'll need two sources of information.  The first I'll need is the weather.  The second is I'll need a source of imagery like Unsplash.  I know you can search Unsplash for certain types of pictures.  Do I really want to add this complexity? I could just download like 20 images that I hope are the 20 most common weather types. Naw, I think I'll reduce scope for now and not import fresh images. I'll just display the weather for now -- actually only just the temperature.  A next step, after I've done this programming, is to figure out if I should search Unsplash for imagery.

### The Final Project Idea

My goal is to make my first, simple portfolio project.  In the end, I'd like to learn Materialize CSS, Preact and work with the browser's location APIs.  But, to keep this manageable, I've decided to do the following: I will make a weather application, hard-coded to a specific location, that gets the weather forecast's temperature in real time.  It will use Javascript to retrieve this information and update the display with simple HTML and CSS.

### Let's Program This

> For those who are more advanced, please understand that this tutorial is being done in small steps similar to how a new programmer might work through a project.  Try to be patient. :)

#### The Design

The first thing I'm going to do is set out some simple layout for my weather webpage.  I'll create plain HTML.

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>My Weather App</title>
</head>
<body>
  <header>
    <h1>Current Weather</h1>
  </header>
  <main>
    <h2>42°</h2>
  </main>
</body>
</html>
```

When I load this up, it's pretty plain. Simple white screen with black text kind of smashed to the left.

So, I decide that I want to style this just a little better -- nothing fancy. But I do want a more techie looking font, want the information centered, and maybe some sort of background -- perhaps a gradient that looks like sky.

With plain CSS, I'm going to apply these styles.

```css
body {
  font-family: sans-serif;
  text-align: center;
  background: linear-gradient(#ffffff 0%, #97d1ff 100%);
}
```

Woah, something isn't right here.

[![Progress 1](/uploads/2020/portfolio1.jpg)](/uploads/2020/portfolio1.jpg){: .thumbnail}{: .inline}

Looks like the background is repeating over and over.  This isn't what I wanted.  

When you search CSS background, you find `no-repeat`.  So I'll apply that.

Well that seemed to stop the repeat, but the background stops right below the temperature note.  I really wanted it to fill the whole screen.  Perhaps I'll do another Google search for something like "css gradient background fill entire screen" and start to compare the results.

What I determined through my "trial and error" is that I likely want to make the `html` element 100% tall and do my background on that.  That makes sense as the HTML is the container outside of the body.  I can then remove repeat from my background if I put background size of `cover`.  That will make it stretch the entire height and width.

Right now there is no content to scroll so everything looks fine. However, I always add a bit more content on to the screen to see how my solution works if I had to scroll. I simply put `hi there<br>` about 100 times in my HTML.  This made the document scroll.  Turns out that the background stops when I scroll and it's white again.  The final fix for this is to make the background fixed.  Here's the final code.

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>My Weather App</title>
  <style>
    html {
      height: 100%;
      background: linear-gradient(#ffffff 0%, #97d1ff 100%);
      background-size: cover;
      background-attachment: fixed;
    }
    body {
      font-family: sans-serif;
      text-align: center;
    }
  </style>
</head>
<body>
  <header>
    <h1>Current Weather</h1>
  </header>
  <main>
    <h2>42°</h2>
  </main>
</body>
</html>
```

And what it looks like:

[![Progress 2](/uploads/2020/portfolio2.jpg)](/uploads/2020/portfolio2.jpg){: .thumbnail}{: .inline}

See, we already have some very important proof as part of our portfolio piece. We've solved how to make a css gradient background the entire display of the page.  When I searched for this, there were a lot of people asking this same question. By learning this, we're already ahead of the pack. And, our project demonstrates that we've learned this now.

#### The Programming

Now, I need to get some weather information.  To do this, I'm going to go to the Weather.gov page for their API information located at [weather.gov/documentation/services-web-api](https://www.weather.gov/documentation/services-web-api).

It looks like I can get some information from the API in JSON format.  If I click on the examples tab I can see some examples of what I need to do.

> If this is your first time working with an API, expect that this will take the longest amount of time in the project.  Do not be surprised if you get stuck here or have to come back to it a few times. I'm going to make it seem very easy, just to fit into the length of this blog post.

I'll pull out a tool like [Postman](https://www.postman.com/) to understand how the API works.

For my technology, I have a couple choices. I want to program completely in plain Javascript, no libraries or frameworks.  Even though I've heard great things about [Axios](https://www.npmjs.com/package/axios), I know it is a library.  There has to be a way to make http calls in plain Javascript right?

After some searching, I come across the [fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch) method.  This looks like exactly what I need.

So, I look at the Weather.gov API and find an end point that will give me the weather forecast.  It looks like I can query `https://api.weather.gov/gridpoints/{office}/{grid X},{grid Y}/forecast` to get the forecast.

What are grid points??

Further research indicates that they're some sort of internal mechanism at the weather service.  To get the grid points I need, I can call another end point with latitude and longitude: `https://api.weather.gov/points/{latitude},{longitude}`

Ok, so this makes sense.  I get latitude and longitude (from a future iteration using the browser location information), request the grid points, then use the grid points to get the forecast.  Then, use the forecast information to populate the temperature on the screen.

So, let's start writing some Javascript.  First, I'm going to go set the latitude and longitude, then get the points, and log it to my console.

```javascript
const latitude = 43.0500961;
const longitude = 87.9089852;

fetch(`https://api.weather.gov/points/${latitude},${longitude}`)
  .then(response => console.log(response));
```

Well this is weird. I'm getting a `404` error that says I'm unable to get points for that location.  Well, that points out something good, actually.  I didn't handle any errors.  I should maybe `catch` my error and rudimentarily notify the user.

Looks like the `404` error is not something that throws an exception.  I do a bit more research, and I've come up with something else now:

```javascript
fetch(`https://api.weather.gov/points/${latitude},${longitude}`)
.then(response => {
  if (response.ok) {
    console.log(response);
  } else {
    alert('There was an error retrieving your weather.');
  }
})
.catch(error => alert('There was an error retrieving your weather.'));
```

Ok, so this alerts the user if there's a 404. But I don't like that it has the same error repeated twice. I do have that catch there, so maybe I'll just throw an error if the response is not `ok` and let my error handling deal with that.

```javascript
fetch(`https://api.weather.gov/points/${latitude},${longitude}`)
  .then(response => {
    if (!response.ok) {
      throw new Error('Weather not found.');
    }

    console.log(response);
  })
  .catch(error => alert('There was an error retrieving your weather.'));
```

No one will see `Weather not found.` unless I update my error handling to deal with the error message more verbosely in the future.

But, why am I still getting an error?  Turns out that the longitude I chose is actually in China. I forgot to make it negative!!

Once I handled that, I was logging a big object.  I remembered I had to call `json()` on the response object from some reading I had done on MDN.  Now I have a big object.

After reading the docs, I've found out that the property I'm after is the object's `properties.forecast` URL.  That has the weather office and the grid points built in.  That will give me the forecast then.  So, I'm going to try that next.

```javascript
fetch(`https://api.weather.gov/points/${latitude},${longitude}`)
  .then(response => {
    if (!response.ok) {
      throw new Error('Weather not found.');
    }

    return response.json();
}).then(points => points.properties.forecast)
  .then(url => console.log(url))
  .catch(error => alert('There was an error retrieving your weather.'));
```

Getting closer! Now the URL I need to call for the forecast is logged.  (If you're not aware of what's going on there, you should review the [javascript arrow functions documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions)).  So, now I'm going to get the forecast and see what information I have available to me.

I then duplicated some of the functionality I had done to get the points, and updated the error messages.  After I get the big forecast object, I look and see that I want to get the current degrees.  This can be found at the forecast's `properties.period[0].temperature` field.

I've done a lot, and now I finally have the temperature. Let's look at what we have so far:

```javascript
const latitude = 43.0500961;
const longitude = -87.9089852;

fetch(`https://api.weather.gov/points/${latitude},${longitude}`)
  .then(response => {
    if (!response.ok) {
      throw new Error('Unable to get points.');
    }

    return response.json();
  })
  .then(points => points.properties.forecast)
  .then(url => fetch(url))
  .then(response => {
    if (!response.ok) {
      throw new Error('Unable to get forecast.')
    }

    return response.json();
  })
  .then(forecast => forecast.properties.periods[0].temperature)
  .then(temperature => console.log(temperature))
  .catch(error => alert('There was an error retrieving your weather.'));
```

In that last `then` I finally have the temperature.  I want to replace that with my temperature above.  I think I'm going to put the word `Loading...` in that `h2` for now.  Then, I want to swap the value out.  The easiest way I can do that now will be to assign an ID to that field for now.  Here's what I swapped it out to be:

```html
<h2 id="temperature">Loading...</h2>
```

Now, in my Javascript, I want to put the temperature in there.  In that last `then()` I can assign the value by replacing the inner text.

```javascript
document.getElementById('temperature').innerText = temperature + '°';
```

And now it's working!

[![Progress 3](/uploads/2020/portfolio3.jpg)](/uploads/2020/portfolio3.jpg){: .thumbnail}{: .inline}

The final code looks like this:

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>My Weather App</title>
  <style>
    html {
      height: 100%;
      background: linear-gradient(#ffffff 0%, #97d1ff 100%);
      background-size: cover;
      background-attachment: fixed;
    }
    body {
      font-family: sans-serif;
      text-align: center;
    }
  </style>
</head>
<body>
  <header>
    <h1>Current Weather</h1>
  </header>
  <main>
    <h2 id="temperature">Loading...</h2>
  </main>
  <script>
    const latitude = 43.0500961;
    const longitude = -87.9089852;

    fetch(`https://api.weather.gov/points/${latitude},${longitude}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Unable to get points.');
        }

        return response.json();
      })
      .then(points => points.properties.forecast)
      .then(url => fetch(url))
      .then(response => {
        if (!response.ok) {
          throw new Error('Unable to get forecast.')
        }

        return response.json();
      })
      .then(forecast => forecast.properties.periods[0].temperature)
      .then(temperature => {
        document.getElementById('temperature').innerText = temperature + '°';
      })
      .catch(error => alert('There was an error retrieving your weather.'));
  </script>
</body>
</html>
```

### Where Do I Go From Here?

First, we need to get this out there for people to see.  Then, you can work your iterations.

#### Displaying Your Work

There are two ways to display your work.  First, you should distribute it in a way that people can see it in action.  You can do this with free hosting solutions like [Netlify](https://www.netlify.com/) or [Heroku](https://www.heroku.com/).  You might also choose a shared hosting account like [Bluehost](https://www.bluehost.com/) or you might go with a cloud provider like [AWS](https://aws.amazon.com/).  The point is, don't expect people to do the work to execute your code. Just provide it somewhere for them. Don't worry if it's not perfect.

Next, you want to display your source code.  For very simple work, you can put your code on something like [Codepen](https://codepen.io/).  This is for showing very simple examples.  Otherwise, put your source code on something like [Github](https://github.com/) or [Gitlab](https://gitlab.com/).  This way, people can see your source code and see how you did something.  Portfolio projects are equal parts what you made and how you made it.  As a bonus, if you use git, you'll have a history of your progress on your portfolio site.  Those who may be interested can actually go back in time and see how you've progressed.

#### Iterations / New Features

As I talked about above, there are many new features and technologies we can add to this.  If I want, I could include a CSS framework (although I have no real use for it right now).  If I wanted to, I could use reactive javascript of some sort to replace that loading indicator with information.  Actually, there are tons of ideas - let's see how much we could expand this and keep ourselves busy building a cool portfolio:

* Use CSS Framework
* Use reactive javascript like Preact
* Get location information from browser
* Get fallback latitude / longitude from user input
* Put CSS and Javascript in separate files
* Show more information besides just the temperature
* Integrate more forecast information like 10 day forecasts
* Cache the calls to the end point so not to hit traffic limitations
* Bring in third party art based on the weather - or use icons
* Figure out if there's a nicer way to handle errors
* Refactor the nested `then()`s to methods instead

There are so many more things you could slowly build out on this.

### End Notes

I wanted to show how you might think of an idea, scope, and then execute for a portfolio project.  If you don't have code to show, there's nothing stopping you from doing something like this.  Just understand that it's example work - it doesn't have to be better or different than competition. You just need to demonstrate that you can do this type of work.  Now get started with your portfolio work!
