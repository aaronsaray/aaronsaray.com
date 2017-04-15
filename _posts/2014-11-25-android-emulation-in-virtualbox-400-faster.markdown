---
layout: post
title: Android Emulation - in VirtualBox - 400% faster!
tags:
- android
---

I've been working with my QA department to determine a faster, better way to test our pages in android browsers.  The android emulator just seems to take a long time to load, to render pages, and is clunky to use.  (True, I may not have learned about all of the options in the emulator, and I may be able to squeak a little bit of performance out of it.)  

Turns out, the project [Android-86](http://www.android-x86.org) exists - download Android images and install into virtualbox!  Yay!

### What we need

Our websites list the following android OS and screen size combinations as the top 5 visitors.  

**4.4**

  * 360x640

  * 360x592

  * 720x1280

**4.3**

  * 720x1280

  * 360x640

So, using this information, I decided to download Android 4.4 and 4.3.

Mount the ISO to a new VM, choose linux, other linux, 32bit, give it 6gb of space fixed, and boot it up.  (you can find installation instructions here: http://www.android-x86.org/documents/installhowto )

By default, it is a tablet-ish size.  Instead, I want to push some other sizes into the virtualbox, so I'll use vboxmanage to tell the virtual machine that I have some custom video modes available.
    
    ~ $ vboxmanage setextradata "Android 4.4" "CustomVideoMode1" "360x640x16"
    ~ $ vboxmanage setextradata "Android 4.4" "CustomVideoMode2" "360x592x16"
    
And so on for the rest of your sizes.

The last step is to add these entry items to GRUB.  On boot, choose the second option, the debug menu item, which will take you to the single user prompt.  Then, mount the directory and modify the grub.lst file.
    
    mkdir /boot
    mount /dev/sda1 /boot
    vi /boot/grub/menu.lst
    
Copy the first three lines and name them to reflect the video size.  Next, find the kernel line and scroll over til you find video=-16.  After this, add 

    UVESA_MODE=360x640 
    
Or whatever corresponds with your size.

Save the file, unmount boot and rmdir it, and then reboot.

Now you should see sizes in your list!

Yay

PS: bonus tip - want these to honor your system hosts file?  try this:

    vboxmanage modifyvm "Android 4.4" --natdnshostresolver1 on
    
PPS: Also, try making your grub menu.lst delay 30 instead of 6 - so you have enough time to pick the right menu perhaps?
