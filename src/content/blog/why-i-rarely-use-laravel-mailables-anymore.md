---
title: "Why I rarely use Laravel mailables anymore"
date: "2024-06-26"
tags:
  - laravel
  - email
origin:
  name: Mastering Laravel
  url: "https://masteringlaravel.io/daily/2024-06-26-why-i-rarely-use-laravel-mailables-anymore"
  canonical: true
---

Joel and I were working on a project that had a number of business situations that the owners wanted to know about. They asked
if they could get emails when these things happened. (Like a user flagged an article. Someone's auto-renewal failed. Etc.) There were 
a number of [mailables](https://laravel.com/docs/11.x/mail#generating-mailables) in the project when I joined.

I hissed. I boo'd. Joel asked me why I was being such a cranky boy.

<!--more-->

I think Laravel mailable classes are great for complex emails with sophisticated use cases. But we're not doing that here. So what would I do? The Laravel feature actually is in the name of the solution. We want to notify the owners something happened. Let's use Laravel Notifications.

"What's the difference?!" I've never heard Joel scream before like this. He was rattled. He was mad!

"It'll be ok little buddy - calm down" I said. 

Ok. Maybe it didn't happen like this. Who can remember? But I did get a chance to explain to him - and I'll share it with you now.

Notifications can be configured to send emails. So, the messages the users get from Mailables can be duplicated as a Notification. But, there are two additional benefits.

First, and this is important, it helps us think about the action we're coding as a notification and not an email. It is a notification that just happens to be sent to these users via email. This thought paradigm is important for the next reason.

Second, we're able to customize the delivery of the notification to suit the needs of the recipient without ever having to visit the code generating the notification again. Now, let's say a new person joins the team and they want the notifications via Slack. It's just a quick change in the `via()` method of the notification to retrieve the delivery mechanism of the user to be notified.

Oh and better yet, sometimes as developers we need to keep an eye on the project as well. Since I don't like all of that email noise, I tend to send notifications to my private Slack channel for the project.

Laravel mailable classes are not bad - but are they the right tool for what you're trying to do? Most cases, upgrading to Laravel notifications is the way to go.
