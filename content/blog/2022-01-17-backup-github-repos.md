---
title: Backup All Your Github Repos Script
date: 2022-01-17
tag:
- github
- nodejs
---
I had a nightmare that someone had access to my Github account and was deleting every repo I had before my eyes. I couldn't figure out how to stop them and invalidate the proper token.  I woke up and decided that I am not ok with this one point-of-failure of my historical work. So I wrote a script to back it up.

<!--more-->

You can find the script on my [Github repo](https://github.com/aaronsaray/github-backup) (the irony is not escaping me). But this is basically what I thought:

* I want to backup my Github repos that I own - not the ones that I belong to - once every 6 months. There might be some duplicate backups but that's ok.  This is a nice mix for the size of my repos compared to the amount / frequency of new ones.
* I will put that in my iCloud drive so it will back up to icloud. I also use Backblaze so it will backup there as well
* I will run it every 6 months with a reminder in Things3 using an Alfred workflow
* I will zip the file myself (even though I could build that in).

So, to do that, I created the script, the reminders, the Alfred workflow, etc.

To call it, I simply run `FOLDER=/home/aaron/ghbackups GHTOKEN=myAccessTokenHere node run-backup.js` and then it runs for me.

There is an output with the progress bar. It updates each repo I'm checking out.  Pretty simple.

Let's take a quick look at the Node code:

```javascript
const { Octokit } = require("@octokit/rest");
const cliProgress = require('cli-progress');
const { mkdirSync } = require('fs');
const path = require('path');
const { execSync } = require('child_process');

process.env.GHTOKEN || (() => {throw new Error('The GHTOKEN env var is missing.')})();
process.env.FOLDER || (() => {throw new Error('The FOLDER env var is missing.')})();

(async () => {
  const octokit = new Octokit({
    auth: process.env.GHTOKEN
  });

  console.info('Loading up on repos...');

  const repos = await octokit.paginate("GET /user/repos", {
    affiliation: "owner",
    sort: "full_name",
    per_page: 100
  });

  const total = repos.length;

  console.info(`Retrieved all repos - there are ${total} of them.`);

  const rootFolder = path.join(
    process.env.FOLDER, 
    (new Date()).toISOString().substring(0, 10)
  );

  console.info(`Beginning to write them to folder ${rootFolder}`);

  mkdirSync(rootFolder);

  const progress = new cliProgress.SingleBar({
    format: '[{bar}] {percentage}% | ETA: {eta}s | {value}/{total} | {repo}'
  }, cliProgress.Presets.shades_classic);

  progress.start(total, 0, {
    repo: ""
  });

  let count = 0;

  repos.forEach(repo => {
    execSync(`git clone ${repo.ssh_url} --quiet`, {
      cwd: rootFolder
    });

    progress.update(++count, { repo: repo.full_name });
  });

  progress.stop();

  console.info('We are done!');
})();
```

Let's go through it real quick.

First, bring in the `@octokit/rest` and `cli-progress` libs.  Grab the `path`, `child_process.execSync` and `fs.mkdir` modules from Node.

Then, make sure we have the `GHTOKEN` and `FOLDER` environment variables. These could be set in your environment in general, or passed on the CLI like I showed above.

Then, it's a self-executing closure so that I can use `await` at the 'top level' of the script.

We create an Octokit instance with the token, and then paginate the results of all of the repos owned by the token's user into a variable.  This is sorted by
`full_name` just for ease of following the progress output.  I create a directory based on the current date. It's important to note that this will crash if
the directory already exists. That's unintentionally by design and should stop duplicating backups.  I create a progress bar with the total amount and a custom formatter.  The custom formatter is
because I want to show the repository's full name on every update.  That way if something breaks, or if I'm just curious, I know what I'm cloning at the moment.

Then, looping over each repository, spawning a sync child exec process that git clones via SSH quietly into the date-named folder.  And progressing the progress bar.

There you go - simple as that.  Feel free to use this to back up your own repos - or - to build off of!
