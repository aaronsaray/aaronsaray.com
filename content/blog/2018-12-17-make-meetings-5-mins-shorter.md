---
title: Make Meetings 5 Minutes Shorter
date: 2018-12-17
tag:
- business
---
Having many meetings, one after another, is not only tiring, it's a recipe for memory disaster. You don't have enough time between meetings to finish notes, gather your thoughts or even use the bathroom.  Because of this, I've started doing something different:

<!--more-->

**Make 30 minute meetings 25 minutes long, make 1 hour long meetings 50 minutes.**

For a quick 25 minute meeting, there is enough time to finish taking notes, go to the next meeting room, grab a snack, etc.  With longer meetings, it's important to have a good bit of time between to collect your thoughts.

There are tools to do this built into a lot of common calendar applications as well.

**Google Calendar**

Open up google calendar, then click the gear icon and choose settings.  Under the `Event settings` heading, click `Speedy meetings`.  This will change the defaults to these new values of 25, 50.

**Mac Calendar App**

Open up your terminal application and type the following:

```bash
defaults write com.apple.iCal "Default duration in minutes for new event" -int 25
```

Close the app and re-open it.

This won't change defaults for everything in the drop down for new events - but it creates 25 minute meetings by default.  If you want a 50 minute meeting, you'll have to change that yourself.

**Fantastical Mac App**

Open up your terminal application and type the following:

```bash
defaults write com.flexibits.fantastical2.mac DefaultEventDuration 1500 
```

The amount is in seconds, so 1,500 seconds = 25 minutes.  Close the app and re-open it.

Again, this won't change all of the defaults and make 50 minute options as well. But, when you create a brand new event, it'll default to 25 minutes.
