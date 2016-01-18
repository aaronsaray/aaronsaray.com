---
layout: post
title: Convert from VMWare Player to VMWare Server
tags:
- IDE and Web Dev Tools
- windows
---

At superdev, we have a distribution of a gentoo image made with vmware workstation.  This works fine in vmware player - but not the free vmware server - and I wanted to have vmware server running so I could have more than one server running on my windows laptop.  Well, there are two small simple edits I had to do - and it was all good.

**First** of all, I grabbed my [favorite free hex editor](http://www.chmaas.handshake.de/delphi/freeware/xvi32/xvi32.htm) and evilly smiled.  **Open XVI32**.

**Second, edit** the file named **VirtualMachineName.vmx**.  Replace the **virtualHW.version = "6" with virtualHW.version = "4"**.  SAVE.

**Finally, edit** the file named **VirtualMachineName.vmxd**.  If you have more than one (like -1, -2, use the one without the suffix.  Those are the data files, the vmxd is the config).  Once again, replace the **virtualHW.version = "6" with virtualHW.version = "4"**.  SAVE.

**Other things I ran into...**

For whatever reason, my eth0 turned into eth1 once I transferred.  So I had to do that modification.  (Also, my dhcp on my network stopped responding to the vm, but I changed it to NAT anyway - because I wanted it as a local connection anyways.)
