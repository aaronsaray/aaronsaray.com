---
layout: post
title: Rewrite or Redirect URL with Apache
tags:
- apache
- misc-web
---
Apache’s` mod_rewrite` module can create redirects with the proper configuration. Let’s dig in.

> This is an article that originally appeared on RedirectURL, a site I built a while ago.  Find out the history of that [site here]({% post_url 2020-XX %})

### Verifying Mod Rewrite is Enabled

You’ll want to verify that you have `mod_rewrite` enabled. Depending on your operating system and Apache version, you can try one of these commands:

* `httpd -M`
* `apachectl -M`
* `apache2ctl -M`

After running any of these commands successfully, you’ll should see `mod_rewrite` in the list. If you do not, you may not have it enabled.

Since there are multiple installs and configurations of Apache, there are multiple ways to enable `mod_rewrite`.

For some installs, it’s as easy as running the following command:

`sudo a2enmod rewrite`

Notice that you must prefix this command with `sudo` as this process requires you to act as a root user.

If your configuration doesn’t have `a2enmod` available, you have to verify and enable Mod Rewrite manually.

To do this, modify your `httpd.conf` file. Depending on your operating system, this might be located in one of many places:

* `/etc/apache2/httpd.conf`
* `/etc/apache2/apache2.conf`
* `/etc/httpd/httpd.conf`
* `/etc/httpd/conf/httpd.conf`

Once you’ve found the file on your filesystem, you can edit it to enable `mod_rewrite`.

Find the line that begins like this:

`#LoadModule rewrite_module ...`

And remove the `#`. Then, restart your version of Apache. The same command you may have used above to list modules can be used to restart Apache. For example, you might run:

`sudo apachectl restart`

You’ll notice that this command required `sudo` in front of it. That’s because restarting Apache requires you to be acting as the root user.

### Configuring the Server Redirect

Since Apache is so flexible, there are a number of ways to configure redirects with `mod_rewrite`. For this example, we’re going to modify the server’s http configuration file. Another popular way to do this is to apply the redirect to the [`.htaccess` file](https://httpd.apache.org/docs/current/howto/htaccess.html).

### Decide What Your Redirect Will Be

For this example, we’re going to stick with a very common scenario that’s very simple.

We want to redirect **pets.com** to **https://bigboxstore.com/pets**  with a permanent 301 HTTP code.

### Writing the Rule and Placing it Properly

So, now it’s time to open up the http configuration file (you may have had to access it above). There may be multiple `<Directory>` declarations. Find the one that has a value pointing to your web files. Basically, this should be the one that matches the `DocumentRoot` declaration you’ll find somewhere else in the file. It probably will have something like `www` or in our case `pets.com` in it somewhere.

Inside of the `<Directory>` declaration, you can write the following:

```
RewriteEngine on
RewriteBase /
RewriteRule (.*) https://bigboxstore.com/pets [R=301,L]
```

Now, you’ll need to restart your Apache server using one of the methods we covered above. You should be all set!