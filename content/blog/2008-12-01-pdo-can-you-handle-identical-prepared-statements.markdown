---
title: PDO - can you handle identical prepared statements?
date: 2008-12-01
tag:
- mysql
- php
---
I've been wondering if I should be concerned about re-preparing a prepared statement when using PDO.  Right now, I use code like this when preparing a statement:

<!--more-->

```php
public function prep($statement)
{
  if ($statement != $this->_lastPrepared) {
    /**
     * Store our clear text statement, and then our object
     */
    $this->_lastPrepared = $statement;
    $this->_ps = $this->db->prepare($statement);
  }
}
```

I end up storing the last statement and do a quick compare.  My concern comes from [MySQL's admission](http://dev.mysql.com/doc/refman/5.0/en/sql-syntax-prepared-statements.html) of this:
"If a prepared statement with the given name already exists, it is deallocated implicitly before the new statement is prepared."

So, not knowing the internal workings of PDO, I wonder how they handle it.  Do they...
	
  * Create each prepared statement with the same name, causing them to be deallocated each time
	
  * Create each one with a random name, so that there are never any deallocations unless you unset the statement?

Anyone have any insight?
