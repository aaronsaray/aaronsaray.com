---
layout: post
title: Reduce Vagrant code duplication by using functions
tags:
- linux
---
I use [Vagrant](https://vagrantup.com) for most of my server management.  One thing I noticed is that my `Vagrantfile` can get pretty large - especially if I have multiple environments that share the same configuration.

Then it occurred to me - this is just a ruby file!  So, I decided to use a function to limit down some of my configuration.  

I have a lot of duplication around the sections of my file where I configure an [ansible](https://www.ansible.com/) provisioner.

For example, see this configuration:

```ruby
local.vm.provision "ansible" do |ansible|
  ansible.playbook = "ansible/playbook.yml"
  ansible.host_key_checking = true
  ansible.sudo = true
    
  ansible.host_key_checking = false
  ansible.extra_vars = {
    server_name: local.vm.hostname,
    server_env: "development"
  }
end
```

The first three lines in this particular configuration are used for every configuration in my file (in some instances, there are many more files).  So, instead, I decided to create the following method at the top of the configuration block:

```ruby
def shared_ansible_config(ansible)
  ansible.playbook = "ansible/playbook.yml"
  ansible.host_key_checking = true
  ansible.sudo = true
end
```

Then, I called this function while passing in the configuration object to it in my provision statement like so:

```ruby
local.vm.provision "ansible" do |ansible|
  shared_ansible_config ansible
    
  ansible.host_key_checking = false
  ansible.extra_vars = {
    server_name: local.vm.hostname,
    server_env: "development"
  }
end
```

There - less code duplication! :)