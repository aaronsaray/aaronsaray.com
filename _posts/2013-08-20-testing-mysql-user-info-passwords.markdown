---
layout: post
title: Testing MySQL User Info Passwords
tags:
- mysql
- security
---

Out of some sheer boredom, I started looking at the top 25 used passwords (from articles [here](http://www.welivesecurity.com/2012/06/07/passwords-and-pins-the-worst-choices/) and [here](http://www.cbsnews.com/8301-205_162-57539366/the-25-most-common-passwords-of-2012/)).  

I decided to test one of my applications using six common ones:

    password, 123456, 12345678, qwerty, abc123, letmein

First, I had an application that I tested that was not salting passwords and was only using md5.  I thought it would be interesting to get the md5's and then write a quick query against them.

```mysql
select md5('password'), md5('123456'), md5('12345678'), md5('qwerty'), md5('abc123'), md5('letmein');

select id from user where `password` in (
'5f4dcc3b5aa765d61d8327deb882cf99', 'e10adc3949ba59abbe56e057f20f883e', '25d55ad283aa400af464c76d713c07ad', 'd8578edf8458ce06fbc5bb76a58c5ca4', 'e99a18c428cb38d5f260853678922e03', '0d107d09f5bbe40cade3de5c71e9e9b7'
);
```

Found some good results.  

Then, I decided to move on to my sha1 salted application.  First, I just thought I'd want to see if there any users that matched.  Surely, there wouldn't be, right?

```mysql
select * from user where password in (
    sha1(concat('password', passwordSalt)), 
    sha1(concat('123456', passwordSalt)), 
    sha1(concat('12345678', passwordSalt)), 
    sha1(concat('qwerty', passwordSalt)), 
    sha1(concat('abc123', passwordSalt)), 
    sha1(concat('letmein', passwordSalt))
);
```

Drat, there were some.  So curiosity got the best of me... I want to know who is who now...
  
```mysql
select 'password', user.* from user where password = sha1(concat('password', passwordSalt))
union
select '123456', user.* from user where password = sha1(concat('123456', passwordSalt))
union
select '12345678', user.* from user where password = sha1(concat('12345678', passwordSalt))
union
select 'qwerty', user.* from user where password = sha1(concat('qwerty', passwordSalt))
union
select 'abc123', user.* from user where password = sha1(concat('abc123', passwordSalt))
union
select 'letmein', user.* from user where password = sha1(concat('letmein', passwordSalt))
```

Yup, found the culprits and their passwords.  

Just a little fun... maybe it would be fun to create a stored procedure for this?
