---
layout: post
title: Ansible Reboot Only If Required
tags:
- linux
- misc-web
---
This quick tip will help you issue a reboot command during your Ansible playbook if a reboot is required.

This has only been tested on Ansible 2.9.13 for a debian-based host system.

For my scenario, I wanted to do a complete dist upgrade as the first thing for this virtual machine (I normally would recommend against this much of a drastic upgrade, but this is for a throw-away implementation).

After the upgrade, a lot of times a reboot is required.  Luckily Ansible has the [reboot](https://docs.ansible.com/ansible/latest/collections/ansible/builtin/reboot_module.html) method built in.  Now, all you have to do is check if a reboot is required.  (The best thing about this method is that Ansible is in control of the reboot so it won't just timeout future commands).

Let's take a look at some tasks with this implemented: 

**`tasks.yml`**
```yaml
---
- name: Update apt-cache and do dist upgrade
  apt:
    update_cache: yes
    cache_valid_time: 3600
    upgrade: dist

- name: Check if reboot required
  stat:
    path: /var/run/reboot-required
  register: reboot_required_file

- name: Reboot if required
  reboot:
  when: reboot_required_file.stat.exists == true
  
- name: Install snapd
  apt:
    name: snapd
    state: present
```

The first step is to update apt-cache and do a dist upgrade.  Then, ansible will register if the `/var/run/reboot-required` file exists. (This is also what motd uses I think to tell you a reboot is required.)  Then, if that stats true, reboot is called.  After that, we continue with our playbook.  In my example, installing `snapd`.