---
title: Website Up Web Scenario Template for Zabbix
date: 2020-10-10
tag:
- zabbix
---
I was pretty excited that [Zabbix 5.0 LTS](https://www.zabbix.com/whats_new_5_0) came out, so I decided to redo my whole install. One of the main reasons I use Zabbix is to monitor website homepage up or down status.  This time, I decided to make a template.  Below I'll detail how and what I did so you can make your own template for your own websites.

<!--more-->

But before that, here's my [Web Scenario Template to Download](/uploads/2020/zabbix-template-web-scenario.xml) so you can import it if you'd like to instead of following these steps.

### Steps to Make Website Up Web Scenario Template

* Click **Configuration** and choose **Templates**
* Click **Add New**
* For template name, type `Template Website Up`, for Groups select `Templates`.  You can put a description as well. I put `Template adds website scenario down trigger and graphs`
* Click **Add**
* You'll have to find it in the list again, and then click it so you can configure it.
* Click the **Web Scenarios** tab, then click **Create web scenario** button.
* For the name, enter `Check Homepage` and leave the rest alone.
* Click the **Steps** tab
* Click the link labeled **add**.  Type `Visit home page` for the name.
* For the URL type `https://{HOST.NAME}`.  Use http or https depending on what your host supports.  The `{HOST.NAME}` variable will come from the name of the host when you create it and the template is assigned to it.
* Click the **Add** button at the bottom of the screen.  Then click the **Add** button below the steps list.
* Click the **Triggers** tab and then click **Create trigger**
* In the Name, type `Homepage failed 2+ times`
* For severity, choose `Disaster`
* In the expression, type `{Template Website Up:web.test.fail[Check Homepage].min(#2)}>0` (this checks for the last two results, and if the minimum of either of those is above 0 - which is a failure - it triggers the problem. This is how we don't have false positives of the website down if it misses one time. It does delay our notifications to 2 minutes, though, which seems acceptable)
* Click **Add**
* Click the **Graphs** tab and click **Create Graph**
* Type `Speed and Failure` for the name.
* Uncheck Show Triggers (we will include data that makes the trigger values obvious)
* Under **items** click **Add**  Choose **Download speed for "Check Homepage"**.  Choose **Filled Region** for draw style and make sure the Y axis is left.
* Click **Add** again.  Choose **Failed step of scenario "Check Homepage"**  Make sure the draw style is line and choose **right** for the Y axis.
* Click the **Add** button at the bottom.

Now your template is done and ready to be assigned to hosts.

You can create individual web scenarios, or you can create hosts that you apply our template to.  I did the latter because I want to be able to represent my web scenarios as 'hosts' even though they're not physical computers I have.  This allows me to create a map or a list of problem "hosts" that are my website outages easily.

Here's how I created a host for a website using this template.

### Make a Host that Uses the Template

* Click **Configuration** and choose **Hosts**
* Click **Create Host**
* Fill in the host name.  This would be the base domain name of your host.  So, if I'm going to monitor `https://aaronsaray.com` I'd put in here `aaronsaray.com`
* In the group field, I typed `Websites` and allowed it to create a new group for me.
* Then, click the **Templates** tab
* In the link new template area, type `Template Website Up`
* Click **Add**

Now you've created your new hosts!

You have the homepage monitoring going on, checking every minute, triggering a problem of Disaster severity if its missed two times in a row. In addition, you have a graph of that host available that shows average response time of the home page with an indicator showing missed homepage retrievals.