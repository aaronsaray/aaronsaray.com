---
title: Dig for Windows
date: 2008-05-30
tag:
- windows
---
For those of us who develop on windows, we can sometimes feel linux tool envy.  One particular tool is the `dig` command.  Well, luckily, you can get this to run on windows easily:

<!--more-->

### Download Bind from ISC

Visit the [www.isc.org/sw/bind/index.php](http://www.isc.org/sw/bind/index.php) download page to download the Windows binary version.

### Create folder and Extract necessary Files

Create a folder called `dig` - or just push all the dlls and exe's into your `windows/system32` folder.  Extract the following:
    
    dig.exe
    libbind9.dll
    libdns.dll
    libisc.dll
    libisccfg.dll
    liblwres.dll

### Run Dig

    c:\>dig
    
    ; <<>> DiG 9.4.2 <<>>
    ;; global options:  printcmd
    ;; Got answer:
    ;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 752
    ;; flags: qr rd ra; QUERY: 1, ANSWER: 13, AUTHORITY: 0, ADDITIONAL: 12
    
    ;; QUESTION SECTION:
    ;.                              IN      NS
    
    ;; ANSWER SECTION:
    .                       4060    IN      NS      e.root-servers.net.
    .                       4060    IN      NS      b.root-servers.net.
    .                       4060    IN      NS      f.root-servers.net.
    .                       4060    IN      NS      a.root-servers.net.
    .                       4060    IN      NS      c.root-servers.net.
    .                       4060    IN      NS      i.root-servers.net.
    .                       4060    IN      NS      g.root-servers.net.
    .                       4060    IN      NS      h.root-servers.net.
    .                       4060    IN      NS      m.root-servers.net.
    .                       4060    IN      NS      d.root-servers.net.
    .                       4060    IN      NS      k.root-servers.net.
    .                       4060    IN      NS      l.root-servers.net.
    .                       4060    IN      NS      j.root-servers.net.
    
    ;; ADDITIONAL SECTION:
    e.root-servers.net.     71529   IN      A       192.203.230.10
    b.root-servers.net.     71529   IN      A       192.228.79.201
    f.root-servers.net.     85723   IN      A       192.5.5.241
    a.root-servers.net.     85723   IN      A       198.41.0.4
    c.root-servers.net.     71529   IN      A       192.33.4.12
    i.root-servers.net.     71529   IN      A       192.36.148.17
    g.root-servers.net.     71529   IN      A       192.112.36.4
    h.root-servers.net.     71529   IN      A       128.63.2.53
    m.root-servers.net.     25212   IN      A       202.12.27.33
    d.root-servers.net.     71529   IN      A       128.8.10.90
    k.root-servers.net.     85723   IN      A       193.0.14.129
    j.root-servers.net.     85723   IN      A       192.58.128.30
    
    ;; Query time: 15 msec
    ;; SERVER: 10.30.12.26#53(10.30.12.26)
    ;; WHEN: Tue May 27 10:49:05 2008
    ;; MSG SIZE  rcvd: 433
    
Yay!

Thanks to Todd Keup @ [magnifisites](http://www.magnifisites.com/) for this tip.
