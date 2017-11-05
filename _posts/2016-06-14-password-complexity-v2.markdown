---
layout: post
title: Password Complexity v2
tags:
- PHP
- user experience
---
Every year, they come out with a list of the top 20 most used passwords and it makes me wonder... how many users on any one of my websites are using those passwords?  

So my first thought is to go the route of using password complexity meters - maybe check to see that there is one letter, one number, there is a special symbol, a capital letter, etc... You've seen these.

But, user's HATE these.

And, when they're picking a password, chances are this is one of the first times you're interacting with them - so it should be nice and easy.

So instead of doing that normal password complexity calculation, I've decided to relax my rules a little bit.  Instead, I've built a list based on the last few years of common passwords and will not allow a user to create a password with that.  With all the computing power out there, if someone wants to guess a password, or hack one, it's pretty easy.  I just want to make sure that they don't pick something that basically is so easy to guess anyone could type it in.

I've developed the following list that I test against when user's are creating a password.  If it matches any of these (or matches their email or username), I reject it and mention that they should pick a more secure password.  Not perfect, but certainly a better experience than some password complexity indicators or restrictions - and I think gets me about 80% of the way there anyway.

    test
    pass
    secret
    god
    testuser
    admin
    administrator
    manager
    demo
    demouser
    password
    passw0rd
    password1
    password123
    qwerty
    test123
    letmein
    12345
    123456
    1234567
    12345678
    123456789
    welcome
    abc123
    111111
    1qaz2wsx
    master
    login
    asdf
    asdfasdf