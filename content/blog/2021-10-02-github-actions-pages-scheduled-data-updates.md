---
title: Using Github Actions & Pages to Publish Static Pages Based on Dynamic Data
date: 2021-10-02
tags:
- github
- html
- javascript
---
This article will break down how I use Github Actions and Github Pages to retrieve data from an API, commit the new data to my repo, and have Github pages rebuild and use that data - all on a schedule with no hands-on interaction.

<!--more-->

*Here's how it works* if you don't want to follow along and can figure it out based on the idea:

* Create an html page that retrieves a local json file and parses/puts that data into the body using javascript
* Create a github action that retrieves api data, then overwrites the target json file, and does a commit of that new data
* Configure github pages to publish from the root of this repository and branch
* Schedule the github action to run using the cron-based scheduling declaration

You can find the finished code at this [repository](https://github.com/aaronsaray/auto-update-github-pages-demo).

### First Steps

For this example, I want to create a page that displays the daily Silver Spot Price based on the Metals.live API.  The beauty of this approach is that you could even use a private key with an API because Github actions store environment variables and secrets securely.

First, I'll create a very simple HTML file with some Javascript.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Silver Spot Price</title>
  <style>
    body {
      // style you want here
    }
</style>
</head>
<body>
  <h1>Silver Spot Price</h1>
  <h2>as of <time>loading...</time> local time</h2>
  <div>
    <sup>$</sup><data>loading...</data>
  </div>
  <script>
    fetch('data.json').then(res => res.json()).then(rows => {
      const data = {};
      rows.forEach(row => {
        const key = Object.keys(row)[0];
        data[key] = row[key];
      });         
      return data;
    }).then(results => {
      const lastUpdated = new Date(results.timestamp);
      const updatedSpot = parseFloat(results.silver).toFixed(2);
      document.querySelector('time').innerText = lastUpdated.toLocaleDateString() 
        + ' ' + lastUpdated.toLocaleTimeString();
      document.querySelector('data').innerText = updatedSpot;
    });
  </script>
</body>
</html>
```

First, we're just creating an HTML document with a few elements that we'll target later. They load with a `loading...` text input which will be removed later.

Then, after the dom is present, there's a script block which will retrieve our local `data.json` file, parse it from JSON, and then map it from the API's output
to something I want to deal with: a single object with prices/values.  We're basically parsing from something like...
`[{"gold":"1759.57"},.....,{"timestamp":1633121998666}]` to something like `{gold:"1759.57", timestamp: 1633121998666}`.  The API we're using returns more than
just the silver price.

When that is done being processed, we'll process the timestamp into a locale-based date string and parse the float value of the spot price to a USD style format
number. Those values will be inserted using the `innerText` property (better to use this than `innerHTML` - this way I don't need to deal with HTML entities).

Now that we have this working, it's time to look at the Github Action

### The Github Action

I've created a file called `.github/workflows/updates.yml` which contains the following:

```yaml
name: Price Retrieval

on:
  schedule:
    - cron: '0 6 * * *'
  
jobs:
  update:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v2

    - name: Fetch data
      id: myRequest
      uses: fjogeleit/http-request-action@master
      with:
        url: 'https://api.metals.live/v1/spot'
        method: 'GET'
      
    - name: Update data file
      run: echo '${{ steps.myRequest.outputs.response }}' > data.json

    - name: Commit changed file
      uses: EndBug/add-and-commit@v7
      with:
        add: 'data.json'
        message: 'Updated spot price data.json file'
```

First, I give it a name so I can recognize it in my Github Actions.

Then, I schedule it with Cron to happen every day at 6a GMT.  This is roughly around midnight in my own timezone - give or take an hour based on daylight savings time.

Then, it runs a job named `update`.  This will get a runner based on `ubuntu-latest`, and check out the code.  Then, it uses an action from `fjogeleit/http-request-action`
that I've configured to download the data from the API and store it into a variable named `myRequest`.  Then, it will echo that request response to my `data.json`
file in the local context of this checkout.  Finally, it uses the `EndBug/add-and-commit@v7` action to commit the updated file and push it back to the repo.

### Github Pages

Github pages is configured on this repository to build from the `main` branch.  It will build every time there's a commit.  This is useful because it will 
update itself every time I make a change to my HTML/JS - or - when the workflow makes a change to the data file.

Because of this, the workflow will retrieve the updated json, write it to the new file, commit it, and that'll trigger a Github page build.