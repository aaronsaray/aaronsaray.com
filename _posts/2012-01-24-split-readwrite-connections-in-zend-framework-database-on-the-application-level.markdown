---
author: aaron
comments: true
date: 2012-01-24 15:40:41+00:00
layout: post
slug: split-readwrite-connections-in-zend-framework-database-on-the-application-level
title: Split Read/Write Connections in Zend Framework Database on the Application
  Level
wordpress_id: 1044
categories:
- mysql
- zend framework
tags:
- mysql
- zend framework
---

I'm no sys admin, so I can't be sure, but I've seen lots of issues with using things like MySQL Proxy to fully separate the write and read queries in an application.  Maybe it works, I don't know... but I do know that if I can separate the connections in my code, that saves my Admin time... it doesn't appear to give that much of a hit to performance either!  Do keep in mind that this is only working at the table level in Zend Framework.  If you use their database system, this should do the trick.  If you do a lot of getting the adapter yourself, this won't help you at all!

First thing to know, when you define your database settings in the application.ini file, the default settings that the bootstrap would read in ... you know: 

    
    
    resources.db.adapter = "pdo_mysql"
    resources.db.params.host = "localhost"
    resources.db.params.username = "xx"
    resources.db.params.password = "xx"
    resources.db.params.dbname = "xx"
    


Let that be the read connection.

Next, create a method in your bootstrap called _initWriteConnection() or something like that.  Create the write connection in there (a separate instance of the Zend_Db connection...).  Store that into the Zend_Registry.

Finally, time to extend the Zend_Db_Table_Abstract


    
    
    class Application_Model_SplitReadWriteDatabaseConnection extends Zend_Db_Table_Abstract
    {
    	/**
             * temporary storage of the read only adapter
    	 */
    	protected $_readDB = null;
    	
    	/**
    	 * invokes the read/write connection
    	 * @see Db/Table/Zend_Db_Table_Abstract::insert()
    	 */
    	public function insert(array $data)
    	{
    		$this->_preWrite();
    		$return = parent::insert($data);
    		$this->_postWrite();
    		return $return;
    	}
    	
    	/**
    	 * Invokes the read/write connection
    	 * @see Db/Table/Zend_Db_Table_Abstract::update()
    	 */
    	public function update(array $data, $where)
    	{
            $this->_preWrite();
            $return = parent::update($data, $where);
            $this->_postWrite();
            return $return;
    	}
    	
    	/**
    	 * Stores the read adapter and sets the write adapter
    	 */
    	protected function _preWrite()
    	{
    		$this->_readDB = $this->getAdapter();
    		$this->_setAdapter(Zend_Registry::get('DbWriteConnection'));
    	}
    	
    	/**
    	 * Sets the read adapter back and clears the temporary storage
    	 */
    	public function _postWrite()
    	{
    		$this->_setAdapter($this->_readDB);
    		$this->_readDB = null;
    	}
    }
    



This is pretty simple.  It overrides the insert and update commands of the Zend_Db_Table_Abstract class.  With that, it calls preWrite to set the adapter to the write version, and store the 'current' one (the read one).  After the parent is called, it restores the database connection.

**This isn't fully tested or complete!**

I'm trying to find ways to make this better.  Here are things/problems (err... Opportunities?) I see...




  * If you use the getAdapter() method against a table, it will return the read connection.  You have to use the Zend_Db_Table methods only for this to work.


  * If an exception happens during the write methods, it may not return the connection to the read database.  I believe it will exit this code and continue using the write connection (even if more read queries are called).



Any other ways that I can make this better?

PS, if you'd like to test this, but don't actually have two different database credential connections (but want to be ready for later), make the _initWriteConnection() method contain the following code:


    
    
            $this->bootstrap('db');
            $db = $this->getResource('db');
            Zend_Registry::set('DbWriteConnection', $db);
            return $db;
    



This way, it gets the existing read connection and stores it as the 'write' version as well.  Remember, only do this until you have both connections.

