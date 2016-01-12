---
author: aaron
comments: true
date: 2007-07-06 23:52:53+00:00
layout: post
slug: real-world-stories-of-a-prepared-statement
title: Real world stories of a prepared statement
wordpress_id: 38
categories:
- PHP
- SQL
tags:
- PHP
- SQL
---

A couple months ago, I was out in Rochester MN at IBM for a multi-day meeting about communication between the iSeries(system-i, i5, as400, whatever its called now a days) and PHP/Apache.  One of the things we talked about was our use of ODBC at ("the triangle") currently to which they asked a good question - Are we using prepared statements over odbc?  Well, right now, we're not, but I think we should.  As always, its up to me to show why we should be doing this.  Lets explore:

<!-- more --> Prepared statements have two benefits: 1) speed - they only require the statement to be compiled once and 2) security - after compilation, when parameters are bound to the statement, there is no chance for sql injection.  While #2 was a no-brainer, I still needed to be sure about #1.  I decided to write some tests.

**First, test mysql prepared statements (using PDO).**

I wanted to get a working good proof on a sql connection and language I was most familiar with - so I made the test initially in mysql.  I used PHP and the PDO extension to prepare the statements.  (In hindsight, I suppose if I really wanted to test this properly with mysql only, I could use the benchmark() function of mysql... but thats not the goal of our test.)  I have a local database, local connection, and two tables I wanted joined.  Additionally, I needed to pass a parameter to show off that #2 skill, so I made mysql determine where the ID was greater than 100.  I did the test 100 times, both prepared and unprepared statements.  For a proper speed measurement, I included the preparation time of the statement in the count (however, we only have to do it one time, so it shouldn't make that huge of a difference).

Here is my test code:

    
    
    set_time_limit(0);
    
    define('USERID', 'root');
    define('PASSWORD', 'password');
    define('DATABASE', 'jemdiary3dev');
    
    define('TEST_VALUE', "100");
    
    define ('TEST_UNPREPARED_SQL', "SELECT t.*, u.* FROM tinterests t inner join tuser u on t.IID=u.userID WHERE IID > " . TEST_VALUE . "");
    define ('TEST_PREPARED_SQL', "SELECT t.*, u.* FROM tinterests t inner join tuser u on t.IID=u.userID WHERE IID > ?");
    
    define ('REPEAT_NUMBER', 100);
    
    $db = new PDO("mysql:dbname=" . DATABASE . ";host=localhost",
    								 USERID,
    								 PASSWORD,
    								 array(PDO::ATTR_ERRMODE=>PDO::ERRMODE_EXCEPTION)
    								 );
    
    $timerUnpreparedStart = microtime(true);
    for ($i=0; $i<=REPEAT_NUMBER; $i++) {
        $db->query(TEST_UNPREPARED_SQL);
    }
    $timerUnpreparedStop = microtime(true);
    $timeUnprepared = $timerUnpreparedStop - $timerUnpreparedStart;
    
    $timerPreparedStart = microtime(true);
    $stmt = $db->prepare(TEST_PREPARED_SQL);
    for ($i=0; $i<=REPEAT_NUMBER; $i++) {
        $stmt->execute(array(TEST_VALUE));
    }
    $timerPreparedStop = microtime(true);
    $timePrepared = $timerPreparedStop - $timerPreparedStart;
    
    print '<strong>Results for test</strong>';
    
    print '<fieldset>Un-PreparedStatement: ' . TEST_UNPREPARED_SQL . "Time: " . $timeUnprepared . "";
    print "<fieldset><legend>Prepared</legend>Statement: " . TEST_PREPARED_SQL . "Time: " . $timePrepared . "</fieldset>";
    ?>


The output I got was last than exciting - actually quite disappointing.  I ran the tests a few times, but got relatively the same numbers:

**Un-PreparedStatement:** SELECT t.*, u.* FROM tinterests t inner join tuser u on t.IID=u.userID WHERE IID > 100
**Time:** 1.5614490509033

**PreparedStatement:** SELECT t.*, u.* FROM tinterests t inner join tuser u on t.IID=u.userID WHERE IID > ?
**Time:** 1.5006070137024

Ok, not that exciting.  I even pushed up the repeat value to 1000 instead of 100 - and it basically just multiplied the totals by 10.  Not so great.

_Maybe am I not doing a proper test?_  If anyone has any input, please let me know. :)

**Next, testing on ODBC**

I do plan on testing the odbc prep statements at ("the triangle") too.  This is what I'm going to use to test the performance (as usual, some of the specific business information has been removed).

    
    
    /**
     * Test for prepared statements on odbc
     */
    
    define('DSN', 'DRIVER={iSeries Access ODBC Driver};SYSTEM=10.1.1.1;');
    define('USERID', 'TESTUSER');
    define('PASSWORD', 'PUTTHEPASSWORDHERE');
    define('FILE_LIBRARY', 'TEST');
    
    define ('TEST_VALUE', 100000);
    define ('TEST_UNPREPARED_SQL', "SELECT * FROM " . FILE_LIBRARY . ".FILENAME WHERE FIELD > " . TEST_VALUE);
    define ('TEST_PREPARED_SQL', "SELECT * FROM " . FILE_LIBRARY . ".FILENAME WHERE FIELD > ?");
    
    define ('REPEAT_NUMBER', 100);
    
    $db = odbc_connect(DSN, USERID, PASSWORD);
    
    $timerUnpreparedStart = microtime(true);
    for ($i=0; $i<=REPEAT_NUMBER; $i++) {
        odbc_exxec($db, TEST_UNPREPARED_SQL); //mis-spelled on purpose cuz of wp issue
    }
    $timerUnpreparedStop = microtime(true);
    $timeUnprepared = $timerUnpreparedStop - $timerUnpreparedStart;
    
    $timerPreparedStart = microtime(true);
    $stmt = odbc_prepare($db, TEST_PREPARED_SQL);
    for ($i=0; $i<=REPEAT_NUMBER; $i++) {
        odbc_execute($stmt, array(TEST_VALUE));
    }
    $timerPreparedStop = microtime(true);
    $timePrepared = $timerPreparedStop - $timerPreparedStart;
    
    print "<strong>Results for ODBC test</strong>";
    
    print "<fieldset><legend>Un-Prepared</legend>Statement: " . TEST_UNPREPARED_SQL . "Time: " . $timeUnprepared . "</fieldset>";
    print "<fieldset><legend>Prepared</legend>Statement: " . TEST_PREPARED_SQL . "Time: " . $timePrepared . "</fieldset>";
    



I'll post the results when I have a chance to test it on the test data.
