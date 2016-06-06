---
layout: post
title: Sync BitBucket and GitHub
tags:
- git
---
At my current job, we keep both a private copy of the code in BitBucket (where all of our code resides), and make a few repos public on GitHub.  (Wish I didn't have to do that, but really, GitHub is the premier place to get your code it seems these days.)  So, I decided to come up with a solution to keep both repos up to date as I do my development.

First, I did not want to trust this to an online service.  Next, I wanted to make BitBucket my authoritative repo - so I want to work there, and sync to GitHub.  Finally, I wasn't a huge fan of using post-commit hooks or anything like that.

Turns out, since my workflow is almost 100% from the same laptop, a simple edit to my `.git/config` file is all it takes.  

**Did you know about the config option pushURL?** Now you will!

I've decided to do this to keep my copies in sync: Add a pushURL for both BitBucket and GitHub.

**.git/config** (before)   
    
    [remote "origin"]
        url = git@bitbucket.org:account/wordpress-plugin.git
        
and now add a pushURL for both your repos.

**.git/config** (after)  
    
    [remote "origin"]
        url = git@bitbucket.org:account/wordpress-plugin.git
        pushURL = git@bitbucket.org:account/wordpress-plugin.git
        pushURL = git@github.com:account/wordpress-plugin.git
        
And there you have it - when you do a git push - now you should see it go to both repos.  This solution may not be the best for your workflow, but it certainly has saved *me* a lot of time.