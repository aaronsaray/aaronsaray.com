---
title: 'Elgg Plugin: Generate Groups'
date: 2009-05-04
tag:
- php
---
The [Elgg Generate Users Plugin](http://community.elgg.org/pg/plugins/aszepeshazi/read/20275/generate-users-updated) made me wonder why there was no group functionality... So...

<!--more-->

## Enter the Elgg Group Generation Plugin

This plugin has the following functionality:

  * Creates Groups

  * Adds Group Images

  * Joins existing members to groups

  * Fills in some group descriptions

More about this after the file download:
[Elgg Generate Groups](/uploads/2009/oht_elgggengroups15.zip)

### Creates Groups

Since I didn't see any easy way to create a massive amount of groups, this plugin does it.  Specify how many groups to create and that's all.

### Adds Group Images

Normally, you can specify a group image or leave it blank.  If you choose to have group images added to your automatically created groups, 2 out of 3 groups will have one of the random avatars as their group image.

### Join Existing Members To Group

After a successful group creation, the plugin will join a random amount of unique members of that site to each group.

### Fill in some group information

Other group information like short description and description are automatically filled in - along with group name.  These are random bits of information.  For any other hook that is associated with the group, there is an option to enable or disable it for the group generation - just like normal creation.  There is another feature called mixed/random which chooses one of the previous two choices randomly for each group.
