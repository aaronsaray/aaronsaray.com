---
layout: post
title: Ansible Installation of Postfix with No Prompts
tags:
- ansible
- scripting
- server
---

Using an Ansible configuration, I wanted to use postfix on ubuntu to send out mail.  However, I couldn't seem to figure out exactly how to get it to stop asking for input during the **apt-get install postfix** process.  Turns out, you can use **debconf** to set the values that are necessary for the install.  

Here's what you're looking for:
[Ansible debconf module](http://docs.ansible.com/debconf_module.html), and questions to answer: **postfix/mailname** and **postfix/main_mailer_type**.

Here's an excerpt of the Ansible file.


    
```yaml
---
- name: Set Postfix option hostname
  debconf: name=postifx question="postfix/mailname" value="sandbox" vtype="string"

- name: Set Postfix option type as internet site
  debconf: name=postfix question="postfix/main_mailer_type" value="'Internet Site'" vtype="string"

- name: install postfix
  apt: name=postfix state=present
```


Of course, remember to copy over your required **postfix/main.cnf** file after you're done, too.
