---
title: mod_unique_id Error After Installing mod_security
date: 2009-11-05
tag:
- apache
---
After installing my `mod_security` module for apache, I could not restart my apache server.

<!--more-->

I kept getting the following error:

```txt
[alert] (EAI 2)Name or service not known: mod_unique_id: unable to find IPv4 address of "mn-ws"
```

In this case, `mn-ws` was the host name of my computer.

This is a pretty simple fix, but I'll document it anyway.  The issue was that my host name was not looking up to my server.

First, I executed the hostname command.  This reported back `mn-ws` properly.  Then, I tried to ping `mn-ws` with no reply.  I finally put an entry in the `/etc/hosts` file with the following content:

{{< filename-header "/etc/hosts" >}}
```txt    
127.0.0.1 mn-ws
```

This solved the issue and `mod_security` would now allow the server to start.  Pretty simple.
