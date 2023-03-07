---
title: Rewrite or Redirect URL with NGINX
date: 2021-05-18
tag:
- nginx
- misc-web
---
With a few steps, you can create redirects using your NGINX server configuration. Let's see how.

<!--more-->

> This is an article that originally appeared on RedirectURL, a site I built a while ago.  Find out the history of that [site here]({{< ref "/blog/redirecturl-experiment-is-done" >}})

### Locate Your NGINX Configuration File

We're going to make our changes to the `nginx.conf` file. Depending on your operating system, this might be located in one of many places:

* `/etc/nginx/nginx.conf`
* `/usr/local/nginx/nginx.conf`
* `/usr/local/nginx/conf/nginx.conf`

Note where the file is. We'll make changes to it soon.

### Configuring the Server Redirect

For this example, we’re going to stick with a very common scenario that’s very simple.

We want to redirect **pets.com** to **https://bigboxstore.com/pets**  with a permanent 301 HTTP code.

### Writing the Rule and Placing it Properly

Open the `nginx.conf` file you found in the previous section. You'll need to find the `server` block that matches your site's domain name.

Inside of the `server` block, you can write the following:

`rewrite ^/(.*)$ https://bigboxstore.com/pets permanent;`

Finally, you need to reload your NGINX server after the config changes. Depending on your service install and configuration, you will need to run one of these commands (depending on your operating system):

* `sudo nginx -s reload`
* `sudo /usr/local/nginx/sbin -s reload`
* `sudo /etc/init.d/nginx reload`
