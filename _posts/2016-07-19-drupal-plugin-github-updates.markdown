---
layout: post
title: Drupal Plugin with Github Updates
tags:
- php
---
I'm all for coding standards and rigorous approval processes for software in app stores, I really am.  However, I'm currently responsible for creating a number of different CMS plugins that all share some code.  Unfortunately, that shared library will never follow the coding standards and requirements for all app stores - each has some differences.  That's why I created...

**Github Hosted, Github Updating Drupal 7 Plugin**

I don't claim to be a Drupal expert - so I'm very careful to mention that this plugin and process is for a Drupal 7 plugin I've created. It may be very similar for Drupal 8 - but I haven't yet found a need to create the Drupal 8 plugin so I don't have the experience.

At any rate, here's what I did. Hopefully it will help you out.

**Create Plugin in Git**  
I've done my development in a git project - and have been pushing it to Github.  

**Alter the plugin_name.info file**  
Create a line that begins with `project status url`.  Here, we're going to point to a specific branch (covered later) that will have the proper xml files.  Here's my example:

`project status url = https://raw.githubusercontent.com/aaronsaray/plugin_name/release-history`

**Create an Install Package**  
In order to create the proper install zip package, I've been using `git archive` with the following command:

{% highlight bash %}
cd my_project_root_directory
git archive --prefix plugin_name/ -o plugin_name.zip HEAD
{% endhighlight %}

In this case `plugin_name` stands for the name or slug your plugin is using.  Drupal 7 requires that a zip file has a folder in it named after the plugin name or slug, hence the `--prefix` option.  If you're trying to install a zip file and getting a warning that there is no plugin files, you might have forgotten to make this folder.

**Create a tagged release on Github**  
You should be tagging your releases and creating a release on the releases page.  In addition, upload your `plugin_name.zip` file as the binary.  This is important because this binary is in the proper format that Drupal 7 requires.  By grabbing the source code bundle instead, it will fail.

**Create an empty branch in git and push to Github**  
We want to keep our status url in the same project on Github, so we'll create a new empty branch.  I chose to call mine `release-history` and used the following command:

{% highlight bash %}
cd my_project_root_directory
git checkout --orphan release-history
git rm --cached -r .
{% endhighlight %}

This switches us to the new branch and gets rid of any of the locally cached files (your local version basically) and allows you to start fresh.  *Friendly reminder: don't forget to commit and push to Github or this won't work when we're done!*

**Create a structure in this branch with an update XML file**  
Drupal 7 updater module is looking for a specific structure depending on the plugin name and the Drupal version.  In our root project, create the following file:

`plugin_name/7.x` 

You'll start to see that if you push this to Github, surf to it, and click the `raw` button, the URL structure for the project status url is starting to make sense:

`https://raw.githubusercontent.com/aaronsaray/plugin_name/release-history/plugin_name/7.x`

The content of the file should reflect an XML document indicating the release history.  I've not found a really good source of documentation, but this is an example of the file I'm using currently:

{% highlight xml %}
<?xml version="1.0" encoding="utf-8"?>
<project xmlns:dc="http://purl.org/dc/elements/1.1/">
    <title>plugin_name</title>
    <short_name>plugin_name</short_name>
    <dc:creator>AaronSaray</dc:creator>
    <api_version>7.x</api_version>
    <recommended_major>7</recommended_major>
    <supported_majors>7</supported_majors>
    <default_major>7</default_major>
    <project_status>published</project_status>
    <link>https://github.com/aaronsaray/plugin_name</link>
    <releases>
        <release>
            <name>plugin_name 7.x-2.0</name>
            <version>7.x-2.0</version>
            <tag>7.x-2.0</tag>
            <version_major>2</version_major>
            <version_patch>0</version_patch>
            <status>published</status>
            <release_link>https://github.com/aaronsaray/plugin_name/releases/tag/7.x-2.0</release_link>
            <download_link>https://github.com/aaronsaray/plugin_name/archive/7.x-2.0.zip</download_link>
            <date>1467725923</date>
            <terms>
                <term><name>Release type</name><value>New features</value></term>
                <term><name>Release type</name><value>Bug fixes</value></term>
            </terms>
        </release>
    </releases>
</project>
{% endhighlight %}

In this case, I'm indicating that there is a version 7.x-2.0 available: 2.0 version for the Drupal 7 install.

Now, commit and push everything to Github.

**Congratulations!**  
Now every time you add a new release, upload a new zip and switch to this branch and update the version information.  This will push out update notifications when the Drupal 7 install checks for your plugin.  
