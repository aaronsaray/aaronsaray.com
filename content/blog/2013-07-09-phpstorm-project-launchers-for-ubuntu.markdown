---
title: PHPStorm Project Launchers for Ubuntu
date: 2013-07-09
tag:
- ide-and-web-dev-tools
- linux
---
PHPStorm has an option to install an icon for your Unity Dash on ubuntu - you can do this through the menu system.  But, if you use this, it always opens to your last project.  I have a number of projects running simultaneously, so this is no good.  I could, of course, stop it from opening the last project, and just display the splash page menu.  But I didn't like that either.  I wanted to be able to type in the lens search box what I wanted.  

<!--more-->

Turns out, with PHPStorm.sh file, the next parameter is the URL for the directory/project to open.  So I made a number of launchers and played them in my applications directory.  Let me show you how:

**`/home/aaron/.local/share/applications/phpstorm-myproject.desktop`**
    
    [Desktop Entry]
    Name=PHP MyProject
    GenericName=PHP My Project
    Comment=Run PHPStorm IDE with MyProject
    Exec=/opt/PhpStorm-129.291/bin/phpstorm.sh ~/sites/myproject
    Icon=/opt/PhpStorm-129.291/bin/webide.png
    StartupNotify=true
    Terminal=false
    Type=Application
    Categories=Programming;IDE;

Now, if you start to type something like "PHP" or "myproje" in the lens, you will be presented with this new icon.  You can launch multiple PHPStorm instances by opening multiple project links like this.  One "nice" thing is if you have the project open currently, it will switch to your instance of PHPStorm in that project instead of launching a new one.
