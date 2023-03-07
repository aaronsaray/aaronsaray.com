---
title: VMWare Script to Toggle VMWare Workstation start/suspend
date: 2013-05-14
tag:
- linux
- scripting
---
Normally I have multiple vm's running for various different projects - all of these are in VMWare Workstation instances I toggle between suspend and started.  I decided to create a script and an Ubuntu launcher icon for toggling the vms back and forth.

<!--more-->

First, check out the launcher I used:

**`/home/aaron/.local/share/applications/vmware-myproject.desktop`**
```
[Desktop Entry]
Name=VMWare MyProject Toggle
GenericName=VMWare MyProject Toggle
Comment=Run VMWare
Exec=/home/aaron/vmware-toggle-myproject.sh
Icon=vmware-workstation
StartupNotify=true
Terminal=false
Type=Application
Categories=Programming;IDE;
```

The bash toggle script checks to see if the current VM is running, and then does the appropriate action depending on if it was found or not.
    
```bash
#!/bin/bash

VM="/home/aaron/vmware/myproject/myproject.vmx"
RUNNING=`vmrun list`

if [[ "$RUNNING" == *"$VM"* ]]
then 
  vmrun suspend "$VM" soft
else
  vmrun start "$VM"
fi
```

So, when I start my day, all I have to do is type the name of my project and hit enter on the launcher.  When the day is done, no need to find the VM's small X on the tab - I just run the toggle again and its suspended.
