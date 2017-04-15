---
layout: post
title: PHP Bitwise User Authorization
tags:
- mysql
- PHP
---

After looking at the Windows model for controlling file access, I realized I could also do that for user authorization control.

The code is pretty self explanatory, but after, you'll find a quick rundown.

```php?start_inline=1
$ADMIN = 1;
$SUPERUSER = 2;
$SECTION1LEADER = 4;
$SECTION2LEADER = 8;
 
$myTestUser = $SUPERUSER + $SECTION1LEADER + $SECTION2LEADER;
 
if ($ADMIN & $myTestUser) {
    print 'got into admin<br />';
}
if ($SECTION1LEADER & $myTestUser) {
    print 'section 1<br />';
}
if ($SECTION2LEADER & $myTestUser) {
    print 'section 2<br />';
}
if ($SUPERUSER & $myTestUser) {
    print 'got into superuser<br />';
}
if ($myTestUser) {
    print 'is normal user.<br />';
}
```


First off, the capital lettered variables are our section permission markers.  These need to expand by the power of 2.  This way, our bitwise operators work out well.

Next, our test user's permissions are the summation of all the sections/permissions that they should have access to.  Its important to note that $ADMIN might be better labeled as $ADMINSECTION to not give the idea of hierarchy, but just access.

Now, when checking access to the sections, we just use the bitwise and operator.  See how we use just one qualifier?  This is nicer coding (because of the access additions earlier) than older code ideas:

```php?start_inline=1
$isADMIN = true;
if ($isADMIN || || $isSuperUser || $section1LeaderAccess) {
    print 'section 1!';
}
```


The one thing that I had to get over was the notion of a hierarchy in the actual values.  Really, the hierarchy is business rule based, so the actual values do not matter.  For example, if the $admin variable is less than the $superuser, I would think that it would mean the $admin was above.  But technically, in our model, we could develop a $superadmin which could be 128 - without having to re-architect the whole system.

The only thing that keeps tripping me up is how to add a new permission, and then auto apply them to each user with so and so setting.  So, for example, every $admin user should also have access to the new $section3leader variable.  Is there a better way to code around this than doing an update query like this?


    
    
    update userPermission set permission = permission+128 where permission & 1 > 0
    



Seems like there would be a better way to do it... any thoughts?
