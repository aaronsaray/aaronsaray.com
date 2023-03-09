---
title: SPA No Framework, API No Database
date: 2019-06-03
tag:
- php
- javascript
- jekyll
---
The average webpage seems to contain tons of bloat and increase in size - and this is no good.  I decided that I wanted to create a proof-of-concept website that would act like a single page application that didn't require a framework like Vue or React.  I only need to support the latest evergreen browsers.

<!--more-->

Then, I decided to take it one step further: I didn't really want to run a backend service and spin up some hosting.  Sure, I could use something like Firebase, but I really just wanted to host everything for free on Netlify.

I created [chickenfacts.io](https://chickenfacts.io), a single page application with a JSON API.  This is how I did it (you can find the code on [GitHub](https://github.com/aaronsaray/chickenfacts.io)).

{{< link href="https://chickenfacts.io" img="/uploads/2019/chickenfactslogo.thumbnail.png" alt="ChickenFacts" >}}
Chicken Facts
{{< /link >}}

## Jekyll

First, I decided to use the static site generator [Jekyll](https://jekyllrb.com).  This is the same software that I use to build my own blog.  Jekyll takes markdown and html and creates flat files to be served.

I decided to just create a very simple index page.  This contains the links to CSS and JS files and has a small framework of markup.  The initial display hosts a 'loading' type animation.

I used SASS because it's built into Jekyll. I used plain Javascript because no form of babel is built into Jekyll by default.

The "API" is really just a set of flat files that are generated with Jekyll as well.  While the index / main page is a page, the chicken facts are considered posts.

Here's an example:

{{< filename-header "_posts/2019-06-02-6.html" >}}
```yaml
---
layout: json
source: https://www.thefactsite.com/chicken-facts/
---

The record number for eggs laid by a chicken in one year is 371.
```

This, and all of its siblings, are brought into the `page` variable when they're being generated.

Then, I created the layout called `json` with the following markup:

```yaml
---
---
{
  "id": {{ page.title }}, 
  "fact": {{ content | strip_newlines | jsonify }}, 
  "source": {{ page.source | jsonify }},
  "published": {{ page.date | date: "%Y-%m-%d" | jsonify }}
}
```

This basically takes the information from the post/page, and then generates a file output of it.  By default, it would be in a posts folder with an html extension.  I changed that in the *`_config.yml`* file:

```yaml
defaults:
  -
    scope:
      type: "posts"
    values:
      permalink: "/api/v1/facts/:title.json"
```

Now, file **`_posts/2019-06-02-6.html`** is created in the `/api/v1/facts/22.json` file with the following content:

```json
{ 
  "id": 6, 
  "fact": "The record number for eggs laid by a chicken in one year is 371.", 
  "source":  "https://www.thefactsite.com/chicken-facts/",
  "published": "2019-06-02"
}
```

Since these are flat files, no back end DB is required.  So, a request to `https://chickenfacts.io/api/v1/facts/22.json` will just serve a static file that appears like a JSON API.

## CSS

I used just basic SASS to create a nice CSS stylesheet.  The goal was to rely on browser defaults when I could, but customize only what I needed.

Three quick things to note:

1) I used flexbox layout to make sure the header and footer were always glued to the top and bottom.  I suggest looking into `flex-grow: 1` if you're not familiar with why this works.
2) To get some sort of responsive text size in CSS, I used a font size based on the viewport width.  So, as the viewport width got smaller, the text would get smaller.  The setting here was `font-size: 5vw`
3) I didn't want to add javascript for the bottom left expansion for the contact button.  So, I used plain CSS.

The markup for this looks like this:

```html
<div class="collapse">
  <input id="contact" type="checkbox" />
  <label for="contact" class="link">Contact</label>
  <div>
    <p>
      Created by Aaron Saray with this source code.
    </p>
  </div>
</div>
```

The concept is that the input checkbox will handle the toggling of this display.  Check out the relevant SASS:

```scss
.collapse {
  input {
    display: none;
  }

  label {
    display: block;
    cursor: pointer;
  }

  & > div {
    max-height: 0px;
    overflow: hidden;
    transition: max-height 0.25s ease-in-out;
  }

  input:checked ~ div {
    max-height: 2rem;
  }

  p {
    margin-bottom: 0;
    font-size: 0.7rem;
  }
}
```

Basically, the content and the input box is hidden.  The label is the main clickable part.  When the input is state checked, then we change the height of the content.  A bit of CSS transition and it works real nice: an expanding/contracting box with animations with no Javascript.

## Javascript

Finally, the app.  Like I said, I just decided to support the most recent evergreen browsers.  The Javascript is pretty simple:

```javascript
---
---
(function(max) {
  let id, requested = window.location.pathname.substr(1);

  if (requested) {
    id = parseInt(requested, 32).toString(10);
  } else {
    id = Math.floor(Math.random() * max) + 1;
    history.replaceState(null, null, id.toString(32));
  }

  function error(object) {
    alert("There was an error getting your chicken fact.  Sorry about that.");
    console.log(object);
  }

  function applyFact(data) {
    document.querySelector('article').classList.remove('loading');
    document.querySelector("q").innerText = data.fact;
    document.querySelector("article a").setAttribute("href", data.source);
  }

  fetch(`/api/v1/facts/${id}.json`)
    .then(function(response) {
      if (response.status !== 200) {
        error(response);
        return;
      }

      response.json().then(function(data) {
        applyFact(data);
      });
    })
    .catch(function(err) {
      error(err);
    });
})({{ site.posts | size }}});
```

A couple things to note, here.  First of all, this is an anonymous self executing function.  The reason there is front matter yaml in here is I wanted to pass in the total amount of posts that are available.  This way I can pick a random value that will exist.

Next, it determines if there is a base 32 number in the pathname.  That would give us `0-9a-z` as options.  This keeps URLs smaller for sharing, but then is converted to an ID that works with the 'API'.  If there is none, it generates a random number.  Then, it replaces the URL with the new one that includes the ID.  This allows the URL to be sharable.  Note that even though it generated a base 10 ID, it replaces the URL with the base 32 version.

Then, we use the `fetch` browser API to request the JSON endpoint, parse it, and pass it to apply fact.  This basically just retrieves the existing markup, passes in data, and changes some classes.

## Netlify Deploy

With this configuration, I told netlify to execute `jekyll build` as the build command and use the `_site` directory as the public directory.

The only thing I had to do was add a redirect on any non-existent URL to the base index file.  I did that with the following configuration:

{{< filename-header "netlify.toml" >}}
```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

## End Notes

There are many things I can do to make this better: a pagination API, better animations, share buttons, etc.  But, this proves that with very simple, open data, you don't need to use a heavy framework or a back end to serve your data.  Oh, and I have analytics on page load, but I really wouldn't know what is consuming the "API" without more data from Netlify.

Check out [chickenfacts.io](https://chickenfacts.io) for more quality Chicken Facts.  Or, submit your own on GitHub. :)