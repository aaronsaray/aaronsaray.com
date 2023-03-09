---
title: Twitter Live Search Updates Page
date: 2009-11-09
tag:
- javascript
- twitter
---
I decided it would be kind of cool to make a page that combined a bunch of twitter hash tags or just tweets in general.  Here are the details...

<!--more-->

## Twitter Search API

Twitter has a [Search API](http://apiwiki.twitter.com/Twitter-Search-API-Method%3A-search) that is pretty useful.  The important things to know are that it can track trends with hash tags as well as search the entire content of the tweet.  The other useful thing is it returns json if requested.

## What I wanted

I wanted to have a script that would create a page with 1 to many twitter search api terms - and then combine them into some sort of table on the web page.  I also wanted to have it refresh periodically.

### Using Javascript

I decided to use javascript instead of PHP for a couple reasons:

  * Javascript would initiate the search from the user's browser... this means that I would not get black listed from twitter's search API.  I personally did not have to worry about an api limit on my server either!

  * PHP would require a full page reload every few seconds in order to display the newest data.  Alternatively, I could use ajax to repoll the PHP code for the new tweets - but I might as well just do all javascript then...

### The Javascript

The first thing, in the head of the HTML document, I loaded google's jquery.  1 less request from my server - plus great cacheability:

```html
<script src="http://jqueryjs.googlecode.com/files/jquery-1.3.2.min.js" type="text/javascript"></script>
```

Next, I embedded this script in the head of the page:

```javascript
$(document).ready(function() {
  var items = new Array;
  var $list = $("#list");
  function getResults(first)
  {
    var terms = ['true blood'];
    jQuery.each(terms, function(){
      var query = "http://search.twitter.com/search.json?callback=?&q;=" 
                + escape(this);
      $.getJSON(query, function(data){
        $.each(data.results, function(i, item) {
          if (!items[item.id]) {
            items[item.id] = 1;
            showResult(item, first);
          }
        });
      });
    });
  }
  function showResult(item, first)
  {
    var d = new Date(item.created_at);
    var t = $("<table><tr><td class="profile"><a href="http://twitter.com/" 
          + item.from_user + "" target="_blank"><img src="" 
          + item.profile_image_url + ""></img><br></br>@" + item.from_user 
          + "</a></td><td class="string">" + item.text 
          + "</td></tr><tr class="details"><td>From: " 
          + $('<textarea></textarea>').html(item.source).val() + "</td><td>" 
          + d + "</td></tr></table>");
    if (first == 1) {
      $list.append(t);
      t.show();
    }
    else {
      $list.prepend(t);
      t.slideDown('slow');
    }
  }
  getResults(1);

  setInterval(getResults, 3000);
});
```

Let me step through it... On page load, the content above is executed.  The first thing done is to call `getResults()` with a parameter of `1`.  Then, I'll set `getResults()` to be called every 3 seconds after that using `setInterval()`.

`getResults()` creates a loop and loops through each of the search terms. Above, I'm only using one search term: "true blood".  Then, it calls `getJson()` from twitter's search api using the callback function.  This json is then organized by the unique twitter ID (just in case search terms overlap tweets, we won't get duplicates...) and is sent to the `showResults()` method.  Note that the `first` variable is sent into that request.

`showResults()` simply builds a list item with the proper content, links, etc.  The only thing really notable about this is the choice when `first == 1`.  This was done in this way to build the auto update functionality properly.  It was best to get the search terms and append them on the first query.  But, then as time went on, we need the newest content at the top (so we don't have to keep scrolling down...).  Then, that's why each interval call for `getResults()` does NOT send in `1` - meaning it will prepend and slowly fade the content into view.

### Add a little style

Just for some good effects, I added this simple set of styles to the document.

```css
h1 {
  text-align: center;
}
body {
  color: #222;
  background-color: #f4f4f4;
}
.profile {
  width: 140px;
  text-align: center;
}
.string {
  width: 440px;
}
.details {
  font-size: 70%;
}
table {
  display: none;
  border-collapse: collapse;
  width: 600px;
  margin: 0 auto 20px auto;
}
td {
  background-color: #fff;
  padding: 5px;
}
table, td {
  border: 1px solid #ddd;
}
a img { 
  border: none; 
  height: 48px 
}
a {
  color: #1133ff;
  text-decoration: none;
}
```
    
This is simply responsible for creating a nice look to the tweets.

### Finally, the HTML

Since the javascript `$list` variable referred to it, let's put it in.  Here is the content of the body tag:
    
```html
<h1>True Blood</h1>
<div id="list"></div>
```

A simple title for the top of the page - and then the target element that the javascript will work with.

## Using This

Minus a few changes to the css, this is a pretty much plug-n-play solution.  Want to change the search term?  Change the `var terms = []` line.  Add in another element and the search will happen for both items, and append them together.  Best of all, the load on your server is very small.
