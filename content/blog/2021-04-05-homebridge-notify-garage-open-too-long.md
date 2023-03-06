---
title: Homebridge Homekit Notify if Garage Open Too Long
date: 2021-04-05
tags:
- iot
---
With a combination of Homebridge, a plugin, Pushover, and a Homekit compatible garage door opener, I can now receive notifications if my garage door was left open too long. Let's dive into how...

<!--more-->

### Prerequisites

In an [earlier blog entry]({% post_url 2020-10-12-homekit-notify-door-open-too-long %}), I detailed how I can use a sensor to watch for an open door.  But, I was still grasping for a solution for something I set out to do: notify me if my garage door was open longer than 3 minutes.  

You'll need: [Homebridge](https://homebridge.io), the [homebridge-delay-switch plugin](https://www.npmjs.com/package/homebridge-delay-switch), a device you want to control (mine is a switch that triggers a Pushover message, using [this plugin](https://www.npmjs.com/package/homebridge-messenger)), and a garage door opener [like this Insignia one](https://www.bestbuy.com/site/insignia-wi-fi-garage-door-controller-for-apple-homekit-white/5933701.p?skuId=5933701).

### How this works

With the `homebridge-delay-switch`, by default you get a delay switch and a motion sensor.  The reason why we want to keep both is that we'll watch our motion sensor for 'movement' in order to get our notification. The plugin will flip the switch to off after a delay and trigger the motion sensor.  If you flip the switch to off yourself, it won't trigger the motion sensor.

So, this is what you do:

* Configure the switch to have a memorable name in the Homebridge plugin and choose a delay. I chose "Watch Garagedoor Open" as a switch name with 180000 millisecond (3 minute) delay.
* Next, add an automation in the Homekit app to watch for a device being controlled. Choose your garage door opener, with it's "open" status.
* Have that trigger the "Watch Garagedoor Open" switch to On
* Next, create another automation in the Homekit app to watch for a device being controlled.  Choose your garage door opener, with its "closed" status.
* Have that trigger the "Watch Garagedoor Open" switch to Off
* Finally, create another automation in the Homekit app to watch for a sensor detecting something.  Choose your "Watch Garagedoor Open" motion sensor motion begins.
* Have that trigger the item you'd like to notify you if the Garage has been open longer than 3 minutes. I had mine turn on my Pushover notification switch

Remember, you don't need to use Pushover with a plugin. You could also have it where it turns all of your lights in your house red.  Or, you could have it turn on an outlet to a radio or some other device.

But now, you can be alerted if you leave your garage door open too long.