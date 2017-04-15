---
layout: post
title: Use MySQL Gui tools to securely connect to remote database
tags:
- IDE and Web Dev Tools
- SQL
- windows
---
This particular example is going to be based on a connection from Windows XP using Putty, MySQL GUI tools and **Dreamhost**.

_Quick summary of issue:_ I want to use MySQL Query Browser to access my database on my dreamhost account.  The database allows connections from the webserver only - nothing external.  I have an SSH account on the webserver.

_Quick answer: _This requires us to tunnel from our machine to the webserver and connect through this tunnel to the database server.

Lets take a look on how we can accomplish this:

**Get Putty**

[Download Putty Here](http://www.chiark.greenend.org.uk/~sgtatham/putty/download.html).   PuTTY is a free implementation of Telnet and SSH for Win32 and Unix platforms, along with an `xterm` terminal emulator.

**Configure a new SSH connection in Putty**

We need to make a new connection in putty and configure it to do tunneling.

1) [![1.jpg](/uploads/2007/1.thumbnail.jpg)](/uploads/2007/1.jpg){: .thumbnail} Create a connection to your webserver with the SSH protocol and proper port.

In this case, it'll be our server 'dreamhost.server.com' on port 22 using SSH.
	
2) [![4.jpg](/uploads/2007/4.thumbnail.jpg)](/uploads/2007/4.jpg){: .thumbnail} Find the tunnels dialog.  Expand the connection item, expand the SSH item, and click on Tunnels.

We're going to make a tunnel from our local source port to our remote destination port at the server.  Choose a source port number that is not in use on your machine and put it in the source box.  Finally, put the _mysql_ server name, colon, mysql port in the destination box.

In my example, I am using source of 9999, 'local' destination (thats local to the ssh server) of mysql.dreamhost.server.com:3306 (3306 being the standard mysql port).
	
3) Next, click 'Open' (You might want to save the session for future reference), and then log in using your credentials (In the future, you might want to set up a public/private key to remove the need for you to interact with the login - you might also want to set up a new SSH user with no permissions to run any commands to increase security.  They only need to connect!)
	
4) [![3.jpg](/uploads/2007/3.thumbnail.jpg)](/uploads/2007/3.jpg){: .thumbnail} Open MySQL GUI Tool.  In this case, I'm going to use the query browser.

Since we've got our connection open at port 9999 on our local machine, we need to change the server to 'localhost' and our port to 9999.  This will make the connection over the tunnel.

Finally, enter your normal credentials and click 'OK'
