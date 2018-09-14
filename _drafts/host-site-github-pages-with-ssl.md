---
layout: post
title: Host Static Website on GitHub Pages with SSL and WWW redirect
tags:
- misc-web
---
You may know that you can host a static site on [GitHub pages](https://pages.github.com/) - but what if you want to have a www redirect and also SSL?  This [isn't that hard](https://blog.github.com/2018-05-01-github-pages-custom-domains-https/) until you get to the www redirect.  That would require a subdomain and a second SSL cert, which they don't provide.  

So, let me demonstrate how we can use GitHub Pages and Cloudflare to host your free GitHub pages website with SSL and www removal/redirect.  

In this example I'm going to focus on [morebetterfaster.io](https://morebetterfaster.io) - but this is basically the same setup for aaronsaray.com - except instead of using flat HTML and the gh-pages plugin, I use [jekyll](https://jekyllrb.com/).

### Register Domain

First of all, I recommend [NameCheap](https://namecheap.com) for domains. I'm not an affiliate, so I won't get a commission either. Just look into their history - they're pretty great. Anyway, register your domain to get started.  You'll be coming back to this later.

[![Register Domain](/uploads/2018/host1.png)](/uploads/2018/host1.png){: .thumbnail .inline}

### Set Up a Cloudflare Account

Run over to [Cloudflare](https://cloudflare.com) and set up a free account.  

[![Cloudflare](/uploads/2018/host2.png)](/uploads/2018/host2.png){: .thumbnail .inline}

It'll ask you to set up a plan and then confirm your existing DNS records. Basically, you're going to change your DNS name servers to Cloudflare, so it's attempting to bring over your records preemptively.  Just agree to this.

[![DNS Records](/uploads/2018/host3.png)](/uploads/2018/host3.png){: .thumbnail .inline}

Now, you'll see your name servers.  

[![Nameservers](/uploads/2018/host4.png)](/uploads/2018/host4.png){: .thumbnail .inline}

Time to go back to your registrar and change those.  Please note that you have to get your name servers from Cloudflare, yours may not be the same as mine.

[![Nameservers](/uploads/2018/host5.png)](/uploads/2018/host5.png){: .thumbnail .inline}

After this is complete, return to Cloudflare to finish everything up. Right off the bat, you'll probably have to wait, but that's ok. Just keep checking the nameservers. My experience is it only takes a few minutes to update. It could take 24 hours or more, though, depending on your configuration and registrar.

[![Check Nameservers](/uploads/2018/host6.png)](/uploads/2018/host6.png){: .thumbnail .inline}


### Create GitHub Organization and Site

The next thing to do is set up an organization on [GitHub](https://github.com). This is going to be where we'll host our content for our site and what will build out our custom GitHub pages URL.

[![Create org](/uploads/2018/host7.png)](/uploads/2018/host7.png){: .thumbnail .inline}

After the organization has been created, create a new repository and name it whatever you want. 

[![Create repo](/uploads/2018/host8.png)](/uploads/2018/host8.png){: .thumbnail .inline}

I'm going to name mine `website`.

[![Name repo](/uploads/2018/host9.png)](/uploads/2018/host9.png){: .thumbnail .inline}

Now that I've done that, it's time to create my quick website locally.  I'm just going to make a very simple website with the following file:

**`dist/index.html`**
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>More. Better. Faster.</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
      background: #ffffff;
      color: #2b2b2b;
      margin: 0;
    }
    div {
      font-weight: bold;
      font-size: 3rem;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
    }
  </style>
</head>
<body>
  <div>
	More. Better. Faster.
  </div>
</body>
</html>
```

This simple page will just be our home page for now.  Now it's time to initialize this page as our git repo and push it.  These instructions come directly from GitHub.

```bash
git init
git add dist/index.html
git commit -m "first commit"
git remote add origin git@github.com:morebetterfaster/website.git
git push -u origin master
```

Finally, I'm going to use [GitHub Pages NPM package](https://www.npmjs.com/package/gh-pages) to publish my site.  

To do this, I've done the following:

```bash
npm init -y
npm install gh-pages
echo "node_modules/" > .gitignore
git add .gitignore
git add package.json
git add package-lock.json
git commit -m "adding github pages"
git push origin master
```

First, this will initialize an npm project.  Then, you install github pages. That will create a `node_modules` directory which you want to ignore in your git commits, hence the next line.  Add the files, commit and push.  You're almost there.

The last thing we want to do is edit the `package.json` file to make it easier for us to push our github pages out.  You'll need to add the following under the `scripts` section:

`"deploy": "gh-pages -d dist"`

Now, you can run `npm run deploy` and it'll push to the github pages branch and set everything up for you.  The first indication this is all set up properly is the fact that you have 2 branches, one of them is `gh-pages`.

[![Branches](/uploads/2018/host10.png)](/uploads/2018/host10.png){: .thumbnail .inline}

You can also see that on the settings page.

[![Settings](/uploads/2018/host11.png)](/uploads/2018/host11.png){: .thumbnail .inline}

Now, you can change it to your custom domain as seen below.

[![Custom domain](/uploads/2018/host12.png)](/uploads/2018/host12.png){: .thumbnail .inline}

First of all, ignore the warning above.  That's fine. We're going to be handling that with our Cloudflare configuration.  Second, do not check the enforce HTTPS part yet. We're going to set that up at cloudflare.

### More Cloudflare Configuration

Now, we have GitHub all set up, we have our domain managed by Cloudflare. It's time to connect the dots.

First, let's do some CNAME flatting and adding aliases in Cloudflare.

Add a cname for your domain that is an alias of github and for the www.  Do not point this to your custom domain, just to the github one.

[![Cname](/uploads/2018/host13.png)](/uploads/2018/host13.png){: .thumbnail .inline}

Next, it's time to configure SSL.  Click the Crypto tab and make the ssl a `full` ssl (don't use strict).  You might have to wait for your certificate if its not already there.

[![Crypto](/uploads/2018/host14.png)](/uploads/2018/host14.png){: .thumbnail .inline}

Now, click the Page Rule tab to add rules to force https.

[![Force https](/uploads/2018/host15.png)](/uploads/2018/host15.png){: .thumbnail .inline}

Use the non-ssl version of the website with a asterisk and add a rule to always use HTTPS.  Then click save and deploy.

[![Force https](/uploads/2018/host16.png)](/uploads/2018/host16.png){: .thumbnail .inline}

Then, we can redirect `www` to non www by adding another rule.

[![Force https](/uploads/2018/host17.png)](/uploads/2018/host17.png){: .thumbnail .inline}

And that should be it.

