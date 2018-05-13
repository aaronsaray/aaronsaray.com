---
layout: post
title: 'Vagrant / Ansible config: change to /vagrant on login'
tags:
- linux
---
While those familiar with the specifics of linux and bash are probably very familiar with the various login sequence files, this might help someone!

If you'd like to save some keystrokes after a `vagrant ssh` - you might want to add this line to your ansible config.  This will automatically change directory to the /vagrant folder when you log in.

```yaml
tasks:
  - name: Create redirect for bash login
    lineinfile: 
      dest=/home/vagrant/.bash_login 
      line="cd /vagrant" 
      state=present 
      create=yes
```

This simply puts a `.bash_login` file in the vagrant user home directory with one line: to change to the `/vagrant` directory.  

You could make this even more dynamic by making the mapped folder root in vagrant a variable, and then pass that to the ansible `extra_vars` if you wanted.
