---
title: Forcing UTF-8 in Zend Framework with PDO
date: 2011-06-28
tag:
- zend-framework
---
For some reason, I just had the most horrible time making sure that my connection from my Zend Framework code was speaking UTF8 at my database.  Here are the key things to remember that I learned:

<!--more-->

  * Make sure to have a collation of UTF8 on your database

  * Set your default charset on your table is UTF8

  * Zend Framework `Zend_Db_Mysql` uses PDO - so use PDO commands when you create your connection to force UTF8

Ok first thing's first.  Create the database with the proper collation:
    
```sql
CREATE SCHEMA `mydatabasename` DEFAULT CHARACTER SET utf8;
```

Next, define your tables with UTF8 charset:
    
```sql
CREATE TABLE `mynewtable` (`a` INT NULL ,`b` INT NULL) 
                          ENGINE = InnoDB DEFAULT CHARACTER SET = utf8;
```

Finally, if configuring your PDO/MySQL connection in `application.ini`, after defining the connection parameters, as I have, add the last two lines
    
```ini
resources.db.adapter = "pdo_mysql"
resources.db.params.host = "localhost"
resources.db.params.username = "user"
resources.db.params.password = "password"
resources.db.params.dbname = "mynewtable"
resources.db.isDefaultTableAdapter = true
resources.db.params.charset = "utf8"
resources.db.params.driver_options.1002 = "SET NAMES utf8;"
```
    
I never had a chance to track down the reasons "why" this was happening - so if anyone has any input, that would be great.  But now I add this to all of my projects just to force it.
