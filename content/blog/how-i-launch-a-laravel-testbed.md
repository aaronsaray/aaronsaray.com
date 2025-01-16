---
title: "How I Launch a Laravel Testbed"
date: 2025-01-16T13:28:45-06:00
tag:
- laravel
params:
  context:
    - Laravel 11
---
Sometimes I need to spin up a quick Laravel instance on my Mac to test something out.  With just a couple keystrokes, I can get a brand new Laravel instance running in a Docker container, ready for my IDE and testing. Here's how.

<!--more-->

Why do I even need to do this?  Of course I have a bunch of client projects I could hijack - but I'm a professional and I won't do that. 

I also know that if I don't make this automated, I won't do it. So, I automated the process. Here's how I did it.

### The What

This is what is going to happen.

* Create aliases in the ZSH shell (this will likely work in other shells)
* Use Laravel Sail to control Docker instances
* That's it. It's pretty simple.

Ok - for this example, you must have a Mac and have PHP + Composer installed globally. But then, that's it! Oh. And Docker. But then, that's it!  Also, I'm using Orbstack with Docker.

### The How

First, let's edit our `.zshrc` file to add two aliases.

```shell
alias sail='vendor/bin/sail '

alias new-laravel='composer create-project laravel/laravel '
```

If you're familiar with [Laravel Sail](https://laravel.com/docs/11.x/sail), you'll recognize the first alias. It's actually a more simple version of the suggested one. In their example, they handle when you have the `sail` command installed globally. I don't do this.

So, let's explain.

The first allows us to type `sail` instead of `vendor/bin/sail` whenever we want to run a Laravel Sail command in our project.

The second is a shortcut for creating a new Laravel project. Remember, we will have to specify our name after the command.

**Now, let's get to the real stuff**

Next, we're going to create a project called "donkey" at localhost.  It's really simple, actually.

```shell
new-laravel donkey
cd donkey
php artisan sail:install
sail up -d
```

That's it. Now, you have a Laravel project running at localhost (or whatever you configured in your `.env` file).

Sail is a great temporary development tool. But, make sure to use the exact same configuration of your production system when you're developing something long term.