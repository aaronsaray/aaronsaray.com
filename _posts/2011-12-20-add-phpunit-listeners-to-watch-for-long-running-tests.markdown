---
layout: post
title: Add PHPUnit Listeners to Watch for Long Running Tests
tags:
- phpunit
- testing
---

One of the under-utilized features of PHPUnit probably is the listeners interface.  You can see the configuration options here: [http://www.phpunit.de/manual/current/en/appendixes.configuration.html](http://www.phpunit.de/manual/current/en/appendixes.configuration.html).  So, I decided that I want to use this to know if a Unit Test takes longer than 2 seconds to run.  That's super over-kill in my opinion, but that's my hard limit.  If it takes longer than 2 seconds to run, something is wrong!  So, I added the following to my configuration:

**excerpt from phpunit.xml**

```xml
<listeners>
    <listener class="Application_Test_TestTimesListener" file="scripts/TestTimesLimitListener.php"></listener>
</listeners>
```

This simply says to invoke the listener from TestTimesLimitListener.php - which class name is Application_test_TestTimesListener.  Here is the code:

```php?start_inline=1
/**
 * Listener Class for test times
 * 
 * @package Tests
 */
class Application_Test_TestTimesListener implements PHPUnit_Framework_TestListener
{
    /**
     * Number of seconds that this test can run
     * @var integer
     */
    const TEST_LIMIT_TIME = 2;
    
    /**
     * called when test is ended - determines if it was long and prints
     * @param PHUnit_Framework_Test $test
     * @param float $length the length of time for the test
     */
    public function endTest(PHPUnit_Framework_Test $test, $length)
    {
        if ($length > self::TEST_LIMIT_TIME) {
            $this->_printError($test->getName() . " ran for {$length} seconds");
        }
    }
    
    /**
     * Used to print error in error colors
     * @param string $error
     */
    protected function _printError($error)
    {
        print "\n\033[41m" . $error . "\033[0m\n";
    }
    
    /**
     * Required for Interface
     * (non-PHPdoc)
     * @see PHPUnit_Framework_TestListener::startTest()
     */
    public function startTest(PHPUnit_Framework_Test $test) {}

    /**
     * Required for Interface
     * (non-PHPdoc)
     * @see PHPUnit_Framework_TestListener::addError()
     */
    public function addError(PHPUnit_Framework_Test $test, Exception $e, $time) {}

    /**
     * Required for Interface
     * (non-PHPdoc)
     * @see PHPUnit_Framework_TestListener::addFailure()
     */
    public function addFailure(PHPUnit_Framework_Test $test, PHPUnit_Framework_AssertionFailedError $e, $time) {}

    /**
     * Required for Interface
     * (non-PHPdoc)
     * @see PHPUnit_Framework_TestListener::addError()
     */
    public function addIncompleteTest(PHPUnit_Framework_Test $test, Exception $e, $time){}

    /**
     * Required for Interface
     * (non-PHPdoc)
     * @see PHPUnit_Framework_TestListener::addSkippedTest()
     */
    public function addSkippedTest(PHPUnit_Framework_Test $test, Exception $e, $time) {}
    
    /**
     * Required for Interface
     * (non-PHPdoc)
     * @see PHPUnit_Framework_TestListener::startTestSuite()
     */
    public function startTestSuite(PHPUnit_Framework_TestSuite $suite) {}
    
    /**
     * Required for Interface
     * (non-PHPdoc)
     * @see PHPUnit_Framework_TestListener::endTestSuite()
     */
    public function endTestSuite(PHPUnit_Framework_TestSuite $suite) {}	
}
```

First of all, the class must implement the PHPUnit_Framework_TestListener interface.  That's why at the end you'll see all the extra empty methods piled on.  Let's dive into the code:

Define a constant of the number of whole seconds.  Next, define the endTest method which will receive a float of how many seconds/milliseconds that test took to run.  If it takes longer than our limit, print an error using the test name.  The _printError() method uses some control characters to change the font color red.  

There you go!  Now, during your normal execution of unit tests, you may see a few warnings for long running tests in red.  Go and correct those to keep your tests running smooth and fast.

Please note: a while ago, I ran into a blog entry about this.  It wasn't clear to me at the time, so I didn't book mark it.  However, I wanted to mention that this isn't 100% only my work.  Credit to where credit is due.

