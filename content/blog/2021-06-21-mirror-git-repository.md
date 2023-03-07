---
title: Mirror a Git Repository Without Forking
date: 2021-06-21
tag:
- git
---
I had a need to mirror a git repository on Github, but I wasn't allowed to fork the repository. Luckily, there is a mirror option built into git.

<!--more-->

### Why Mirror a Repository

My particular use case was that I have purchased access to a specific repository and I have a license for it, but I'm afraid it might go away. I've built significant infrastructure around this third-party library, and since its controlled by one single entity, that's a pretty big risk as well.  I'm sure there are many other reasons. 

There are other options as well. You could download the distribution package of the library and keep it in your project yourself. I just have chosen to install it as a remote, authenticated package instead. Living life dangerously I guess.

### How to Mirror the Repository

In this example, we need this setup - or prerequisite:

* You have a repository called `OwnerName/RepoName` - in my example, I'm going to use one on Github
* You have your own bare repository with no history waiting for the mirror. In Github, this happens when you create a new repository under your account, but do not commit anything.  In this example, that's `YourUserName/YourBackupRepo`
* A local install of git that you can use
* Authentication to each of the repositories (permission to read the source or origin, permission to write to the destination or copy)

Here's how you do it:

```
git clone --mirror git@github.com:OwnerName/RepoName.git
cd RepoName.git
git remote add destination git@github.com:YourUserName/YourBackupRepo.git
git push destination --mirror
```

And to keep it up to date:

```
cd YourBackupRepo.git
git remote update
git push destination --mirror
```

If you somehow have removed the local copy of your bare repository, you can run the first set of commands again and it should be fine.

### How This Works

I'm sure you're not reading this - you got what you need. But just in case, here's how this works:

First, you're going to clone the repository you want to mirror to your local system with the `--mirror` option.  This basically is short for "create a bare repository, then get all of the refs to commits, branches and tags, and track them here."

Then, you change into the directory that you just cloned a bare repo into.

Then, you add a remote called `destination` that points to your new copy location.

Finally, you can push to the remote called `destination` with the `--mirror` option again.  That basically says push all of my references to this remote.