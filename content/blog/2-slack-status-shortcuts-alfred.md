---
title: 2 Ways to Use Alfred to Set Status on Slack
date: 2018-11-19
tag:
- business
---
I'm a huge fan of [Alfred](https://alfredadd.com) - but I had to upgrade to get the pro version to get workflows.  Because I use Slack a lot, I've been trying to set up status automation and workflows.  When using my phone, I have an automated system that sets my status. You can find that [here](https://github.com/aaronsaray/phone-status).  But, what about using Alfred for some automation?

<!--more-->

## The Slash Command

First, Slack has a built in functionality to set your status from any window you're typing in.  For example, if you wanted to set your status to lunch with a taco icon, you can run the following command:

```txt
/status :taco: I'm at lunch
```

This is great to type, but can we do it even faster?  With Alfred's built in text-completion, it's easy.

Open up your Alfred preferences.  Then, choose Features and select Snippets.  Here you can create a group to organize your snippets, and then create a snippet.  The snippet will watch and auto-expand the text for you.

I named my 'Slack Lunch Status', put the identifier as `!lunch` and the snippet value as `/status :taco: I'm at lunch`.

Now, when I'm in any window for slack, I can type `!lunch` and it posts the status message. I just have to hit enter.

## API Workflow

With workflows, you can make custom actions into an Alfred command.

In this case, I want to be able to type the command and send a status directly to slack.  For example, when I engage Alfred, I want to type the following:

```txt
ss :taco: I'm at lunch
```

To do this, first open Alfred Preferences and go to Workflows.

Then, create a new workflow called Slack Status (I put a slack icon in it as well.)  Now, create a new Input keyword.  Type `ss` as the keyword, check with space, and choose require argument.  You can describe this as the slack status setter.

Next, add a new Action, Run Script.  Choose `/usr/bin/php` from the drop down and paste in the following script:

```php
<?php
// get entire query
$query = trim($argv[1]);

$icon = '';
$status = $query;
if (preg_match('/^(:[\w-]+:)(.+)/', $query, $matches)) {
	$icon = $matches[1];
	$status = trim($matches[2]);
}

$fields = [
  'token' => getenv('slack_token'),
  'profile' => json_encode([
	'status_text' => $status,
	'status_emoji' => $icon
  ])
];

$post = http_build_query($fields);

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, "https://slack.com/api/users.profile.set");
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, $post);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$return = curl_exec($ch);
curl_close ($ch);

// for any debugging
print $something;
```
Don't forget to connect the two items with a connector bar.

Finally, we need to get a Slack web token.  You can get this [from here](https://api.slack.com/custom-integrations/legacy-tokens).  Once you have this, add this to the environment of your Slack workflow.  To do this, click the icon in the top right that looks like an X.  Click the plus icon, type in the name of `slack_token` and enter your legacy app token.

Now you're all set.  Alfred can now set your status.
