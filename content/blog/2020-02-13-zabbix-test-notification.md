---
title: How to make a Zabbix Test Notification
date: 2020-02-13
tag:
- zabbix
---
A big challenge when setting up a new Zabbix installation is "how do I test my media+action+notification+trigger" setup?  I've come up with a pretty easy way to do this that doesn't require butchering your server or messing with it's historical data.

<!--more-->

First, it's taken me a while to use the right terminology with Zabbix. I searched many times for phrases like "test zabbix notification" but I could never find anything.  What really I am doing here is creating a trigger, which triggers an action, that sends a notification via a media type.  

I've seen suggestions that say create a big file, and you'll trigger a disk space error. Or, change your password over and over and you'll get an alert that `/etc/passwd` is changing a lot. That's fine - if you have those triggers set up on your Zabbix server.  But, what if you don't? Or better yet, what if you don't want to pollute your history with fake errors?

In my example, I've created a trigger that watches for a file in the temp directory. If it exists, it'll create a notification to me.  This way when I want to test it, I can trigger this trigger, see the notification, then immediately delete the file and return it to normal.  Additionally, since this is a fake trigger, I can delete this when I'm done - so not to add more data or pollute my history.

Let's do the steps:

- Go to Zabbix installation and login
- Choose Configuration -> Hosts.
- Find a host you want to build a trigger on, I suggest your Zabbix Server
- Click items on the Zabbix server row
- Click Create Item button
- Type `/tmptest file exists for testing` in the name
- For the key, type `vfs.file.exists[/tmp/test]`
- Keep the rest. Click save.
- Click triggers on the Zabbix server row (or the header on the top)
- Click Create Trigger button
- Name the trigger `/tmp/test exists`
- Choose a severity - I chose Disaster
- Enter an expression - the first part should be the host name of your host: `{zabbix-server:vfs.file.exists[/tmp/test].last()}=1`  This says on the host `zabbix-server`, check the file system for `/tmp/test` and get the last time it was ran - and if it is true(1), trigger.
- Save the trigger

Now you should have your test trigger set up.  Simply ssh to your Zabbix server and run the following command:

`touch /tmp/test`

Then, in one minute, you should get a new triggered alert. Your action to notify you should now fire.

When you're done, delete the file:

`rm /tmp/test`

And you should be back in business.