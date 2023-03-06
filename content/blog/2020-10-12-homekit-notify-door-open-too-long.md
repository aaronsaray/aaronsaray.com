---
title: Homekit Notify If Door Open Too Long
date: 2020-10-12
tags:
- iot
---
I've finally come up with a couple of solutions to get a notification if a door has been open too long in my house. In
Homekit, the automations are extended with Shortcuts, and that's what we'll use.

<!--more-->

So, to preface, I didn't really investigate into the Shortcuts option in Homekit automations until recently. I thought 
it was just allowing me to create a Shortcut that allowed me to do home automation.  Turns out, while that's possible,
its more for scripting and making the automations much stronger.

Finally, before we get into this, I want to clarify what "notify" means in this context.  It means to trigger something
else in your home automation setup.  So, for example, if you're using [Homebridge](https://homebridge.io/) and say [Pushover](https://pushover.net),
you might use a plugin like [homebridge-messenger](https://www.npmjs.com/package/homebridge-messenger).  If you're not using
one of these things, you can still accomplish this with other actions.  For example:

* Turn on an outlet connected to a radio. If that radio comes on, you know something is amiss
* Turn on a special red light - or maybe a scene where all your lights in your house turn on red
* Use the shortcuts functionality to hit a webhook of your choosing to do any notification you'd like

In my example, I'm using the Homebridge Messenger plugin, so my example will trigger that built-in switch.

Let's get down to it.

### Planning

First, decide what you want to monitor. In this example, I'm going to monitor an [Eve Door and Window Sensor](https://www.evehome.com/en-us/eve-door-window).  I've tried to monitor
my Garage Door opener, but the way its registered, it's a device, and not a sensor.  So, it doesn't seem to consistently share its status (and that makes sense, its not a sensor),
as well as it doesn't trigger if I don't trigger it through the Home app (versus hitting the button on the wall).  So, to get this to work for your garage,
I'm sure you could get a garage opener that has a sensor - or add a sensor as well.

Second, decide how long you want to wait.  I'm going to wait 30 seconds.  If the door is still open after 30 seconds, something is up, and I'd like to know.

Finally, decide what you'd want to happen. Like I said, you could trigger a scene, an outlet or a switch. I'm going to trigger my pre-configured switch which sends the pushover notification.

### Let's Do It.

* Open the Home App and choose **Automations**
* Click the **+** to create a New Automation
* Choose **A Sensor Detects Something**
* Choose your door sensor. I'm choosing one called **Eve Man Door**. Tap **Next**
* Here you can choose your state. Tap **Opens** and tap **Next**
* Now, scroll down till you can see, and then tap on **Convert to Shortcut**
* Remove the existing options that are auto-populated for you
* Click the **Add Action** and choose the **Wait** suggestion
* Tap **1 Second** and plus this up to 30
* Click the **+** and choose the **If** suggestion
* Delete the **Otherwise** option
* Tap the **Input** option on the if and choose **Select a Home Accessory**
* Choose that same sensor in the list. Click **Done**
* Tap **Name** or whatever the next option is and choose **Contact Sensor State** (these options might be different for you if you're doing something different)
* Tap **Condition** and choose **is**
* Tap **Choose** and choose **Open**
* Tap the **+** to add a new action
* Select **Control My Home** from the list of suggestions
* Tap on **Scenes and Accessories** and then choose the switch (or other item) you want. Mine is a switch called **Garage Left Open** Tap click **Next**
* On this screen, make sure to adjust the accessory to how you want it. I tapped my switch to turn it on. Tap **Done**
* Hold and Drag that item in between the **If** and **End If**
* Click **Next** and then finally click **Done**

I've included some pictures below to give you an idea of my setup as well.

[![Example image](/uploads/2020/homekit-shortcut-1.png)](/uploads/2020/homekit-shortcut-1.png){: .thumbnail}{: .inline}

[![Example image](/uploads/2020/homekit-shortcut-2.png)](/uploads/2020/homekit-shortcut-2.png){: .thumbnail}{: .inline}

### End Notes

I'm still not ok with not being able to monitor my Garage Door yet. I could put a sensor on it, but I think I'll look for something else. I know that homebridge
has some plugins for delayed switches, so maybe I can take advantage of one of those.