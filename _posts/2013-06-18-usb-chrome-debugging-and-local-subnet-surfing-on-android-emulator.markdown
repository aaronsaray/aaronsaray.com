---
layout: post
title: USB Chrome Debugging and Local subnet surfing on Android Emulator
tags:
- android
- linux
- mobile
- scripting
---

[![android](/uploads/2013/android.png)](/uploads/2013/android.png){: .thumbnail}

Most of the development I do that needs to be tested on android is on a local subnet.  Generally, this is because I am running the servers in virtual machines that mimic the production environment.  When I want to test these websites via the android emulator, it would be nice to be able to surf to them locally (without putting them in a public QA environment) - as well as have the ability to use Android Chrome's USB Debugging.  (If you're not familiar with Chrome USB debugging, its the process where you connect your phone via USB to your computer, and then you can use your computer's Chrome development tools to inspect and alter items on the mobile chrome.  We can do this on the emulator too!)

### The Steps for the Emulator

First, make sure to install your [Android Emulator](http://developer.android.com/sdk/index.html).  Once you have installed the emulator and the packages you want, you can create an instance of an AVD file for your chosen android version.  In this example, Chrome that I'm providing works only with Android 4.1 and above.  Next, make sure you select the **shared GPU** setting on the device setup, and choose **Arm emulation** from the type.  For me, the x86 version made the emulator much faster - but this Chrome I have won't work (note: you can't easily get Google Chrome on the emulator... not sure why).  If you do not use shared GPU, chrome will render white pages instead of your websites.

Once this is working, download this [chrome APK](/uploads/2013/chrome.apk).  With your emulator running, you want to push the file and install it on your emulator.  Do the following:
    
    adb remount
    adb install chrome.apk

If you haven't already added **adb** to your path, you may need to directly link to it from the platform-tools folder in your android emulator sdk download folder.  At any rate, this installs Chrome.

Next, on your emulator, enable USB debugging on the device:

  1. Go to the applications tray

  2. Click Settings

  3. Scroll down and click Developer options

  4. Click the checkbox next to Enable USB Debugging

Almost done with the emulator - last step is to open Chrome and enable the USB Debugging there.

  1. Open Chrome

  2. Click the Menu button

  3. Go to Advanced Settings

  4. Check the USB Debugging checkbox

### Steps for Scripting the Chrome Debugger and Host File

Next step was to create a hosts file that I could push to my android device.  My project is on a local domain on a subnet created by VMWare.  Here is an example of what this hosts file looks like (note: this is NOT the same file I use on my local ubuntu machine).

**filename: hosts**
    
    192.168.2.34 myproject.local assets.myproject.local

Finally, we'll create the following script that will start the emulator, wait for it to boot, and then push the hosts file and enable usb debugging port forwarding.  Note, I am using Ubuntu, so you may have to change 'notify-send' to something else - whatever alert system you use on your own system.  Or, you can remove it entirely.
    
    #!/bin/bash
    ~/android-sdk-linux/tools/emulator -avd android4.2 -partition-size 290 &
    notify-send -i ~/android/android.png "Android Emulator" "Loading... hosts unavailable: waiting 60 seconds"
    sleep 60
    REMOUNT=$(~/android-sdk-linux/platform-tools/adb remount)
    ~/android-sdk-linux/platform-tools/adb push ~/android/hosts /system/etc
    notify-send -i ~/android/android.png "Android Emulator" "$REMOUNT"
    ~/android-sdk-linux/platform-tools/adb forward tcp:9222 localabstract:chrome_devtools_remote
    notify-send -i ~/android/android.png "Android Emulator" "Set up Chrome USB Debugging"

Oh - and if you'd like, the icon I used is at the top of this blog entry. :)

Basically, this script starts the emulator, increases the partition to handle the file I'm going to push to it, and then waits 60 seconds.  Next, it pushes the host file over and then enables port forwarding for chrome debugging.

To see your available Chrome debugging items now, you can simply visit http://localhost:9222 and you can access the debug tools from there.

Simple? :)  Hope this helps you out.
