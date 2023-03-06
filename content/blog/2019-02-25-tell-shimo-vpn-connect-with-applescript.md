---
title: Tell Shimo VPN to Connect with Applescript
date: 2019-02-25
tags:
- macos
---
For some clients, I have to VPN before I can push to their git repositories.  I've been using a few VPN clients, but I finally settled on one.  I'm a huge fan of [Shimo](https://www.shimovpn.com/) but one thing that bothered me was that I still had to click and remember to be on VPN when I wanted to push my changes.

<!--more-->

So, with some pointers from the great support team at Shimo/Mailbutler, I came up with the following solution: Create an applescript that checks to see if the VPN is connected, THEN push the changes.

I've installed the following bash script in my local path:

**`vpn-git-push`**
```bash
#!/bin/sh
osascript ~/utils/client-shimo-pre-push.scpt
git push $@
```

And the `scpt` AppleScript file contains the following (where `vpn.client.com` is the name of the account in my Shimo connection manager.)

**`~/utils/client-shimo-pre-push.scpt`**
```
tell application "Shimo"
set p to account "vpn.client.com"
if p is not connected then
  connect account p
end if
end tell
```

Then, when I'm working with this client, I do `vpn-git-push` instead of `git push` and I'm saved from knowing/remembering if my VPN is connected. 
The only problem is remembering now to use `vpn-git-push`. I tried to put in a pre-push git hook, but unfortunately, the first step in the process is to update the remote refs.  _Then_, it runs your hook.  So, this fails, because our VPN is not connected.  If you have better solutions, I'd love to hear them!