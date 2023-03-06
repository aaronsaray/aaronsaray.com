---
title: Disable PiHole from iPhone 1-click
date: 2021-06-07
tags:
- ios
---
If you're running [PiHole](https://pi-hole.net/) as your DNS, you might run into situations where you want to disable it quickly. By making a shortcut on my iPhone, I can quickly disable (or re-enable) PiHole.  Let me show you how.

<!--more-->

First, make sure you know what the IP or hostname of your PiHole install is. On my network, mine is `pihole.local` - yours mine be something else.  Make sure your iPhone is on your same network and can surf to that domain.  If so, then you're good to go.

Next, get your API token from PiHole.  To do this, access the **Settings** menu after logging into your admin portal of your PiHole.  Then click the **API/Web Interface** tab and click the **Show API Token** button towards the bottom.  Grab the raw text API token here.  (If you've shared your clipboard through iCloud, you can copy this on your mac and paste it when you're using your iPhone.)

Now, open your iPhone's Shortcut App and click the plus sign to create a new shortcut.

[![Screenshot](/uploads/2021/disable-pihole-1.png)](/uploads/2021/disable-pihole-1.png){: .thumbnail}{: .inline}

Click the three dots to change the icon and the name. I've chosen a relevant name and a different color/icon.

[![Screenshot](/uploads/2021/disable-pihole-2.png)](/uploads/2021/disable-pihole-2.png){: .thumbnail}{: .inline}

Click the **Add action** button and search for Text.

[![Screenshot](/uploads/2021/disable-pihole-3.png)](/uploads/2021/disable-pihole-3.png){: .thumbnail}{: .inline}

Place your API key in the text field all by itself (make sure there's no extra spaces or no letters mistakenly capitalized).

[![Screenshot](/uploads/2021/disable-pihole-4.png)](/uploads/2021/disable-pihole-4.png){: .thumbnail}{: .inline}

Click the **Plus** again and search for "Get contents" to find the **Get Contents of URL** action.  Select this.

[![Screenshot](/uploads/2021/disable-pihole-5.png)](/uploads/2021/disable-pihole-5.png){: .thumbnail}{: .inline}

[![Screenshot](/uploads/2021/disable-pihole-6.png)](/uploads/2021/disable-pihole-6.png){: .thumbnail}{: .inline}

Type the following URL into your Network action: `http://pihole.local/admin/api.php?disable&auth=` where `pihole.local` is your local PiHole.  The `=` should then have the **Text** placeholder after it. This will insert your api key.

I also opted to add a "show notification" action to confirm the action has completed.

[![Screenshot](/uploads/2021/disable-pihole-7.png)](/uploads/2021/disable-pihole-7.png){: .thumbnail}{: .inline}

Now you have an action that you can click to execute with one click. You can put this in one of your iOS widgets if you'd like.  

[![Screenshot](/uploads/2021/disable-pihole-8.png)](/uploads/2021/disable-pihole-8.png){: .thumbnail}{: .inline}

A couple things...

When you run it the first time, it might prompt you for permission to access the internet.  You should allow this shortcut to do that.  It says 'internet' but really it's referring to your local server on your network.

You can also create a re-enable functionality by changing the `disable` to `enable` in the URL.  Everything else would function the same.
