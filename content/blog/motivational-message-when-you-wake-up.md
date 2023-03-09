---
title: Get a Motivational Message You Set on iPhone to Wake Up
date: 2020-11-30
tag:
- ios
---
With the Shortcuts app on your iOS device, it's easy to create a motivational message for after your alarm.

<!--more-->

## What's The Point?

I've been looking around for a way to play an alarm on my iPhone that talks to me. I wanted to experiment with a motivational message. (I've also searched for this functionality on Amazon Echo but haven't found what I really need yet.)  Basically, before I go to bed for the night, I want to write down some things to remind me to get up and at-em in the morning.

Turns out you can do this with Siri and Shortcuts.  There are time of day automations (and now finally the ability to run things at scheduled times without prompting).  However, I think I want to play my alarm first, then when I turn that off, have Siri speak to me.

## How You Could Do It

You could create a note in the Notes app titled something like "Time to wake up!" and then type your message in that note.  Then, create a personal automation to run after your alarm which will grab the note body from the note which has a name that contains Time to wake up. Then you can read that. I think I might do this from now on.

But, I did it a little bit different to get started.

First, open the **Shortcuts app** and tap **Automation** at the bottom.

{{< image src="/uploads/2020/iosalarm1.png" alt="Helpful image" >}}

{{< image src="/uploads/2020/iosalarm2.png" alt="Helpful image" >}}

Tap **Create Personal Automation** and choose **Alarm**.

{{< image src="/uploads/2020/iosalarm3.png" alt="Helpful image" >}}

You can choose existing alarm options here.  I just have one alarm so I left it at **Any** and clicked **Next**

{{< image src="/uploads/2020/iosalarm4.png" alt="Helpful image" >}}

Next, I'm going to turn the volume all the way up. I don't know what I was doing the last time I used my phone.

Then, tap **Add Action**,  search for **Volume** and tap **Set Volume**.

Tap the **50%** and slide it all to the right.

{{< image src="/uploads/2020/iosalarm5.png" alt="Helpful image" >}}

Next, tap **the plus sign**, search for **Text** and tap **Text**.

Next, you can type in whatever you want Siri to say in the morning.

Tap **the plus sign**, search for **speak** and tap **Speak Text**.

{{< image src="/uploads/2020/iosalarm6.png" alt="Helpful image" >}}

You can click the **Play button** if you'd like to preview your work.

Click **Next** and then **turn off Ask Before Running** (this way it won't prompt you, it'll just start talking after you turn off your alarm).

Click **Done**.

And there you go.

{{< image src="/uploads/2020/iosalarm7.png" alt="Helpful image" >}}
