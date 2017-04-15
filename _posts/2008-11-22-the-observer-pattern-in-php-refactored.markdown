---
layout: post
title: 'The Observer Pattern in PHP: Refactored'
tags:
- PHP
---
You may remember the article I wrote about the observer pattern in php - but it lacked some of PHP's advanced features.

In this next example, I'm not going to explain the logic as much - read the original post for more - but I did comment it pretty thoroughly.  Here are the things that I added, however:
	
  * Type hinting in functions
	
  * Abstract classes
	
  * Interfaces
	
  * A registry of observers

So, here is the code:

```php?start_inline=1
/**
 * twitter transport from "library" - on successful tweet will print it out
 */
class twitterTransport
{
    public function __construct()
    { /** logic here **/ }
 
    public function tweet(twitterMessage $object)
    { /** logic here **/  print $object->message . ' was just tweeted'; }
}

/**
 * url shortener from "library" - just replaces [url] with [u] in a string
 */
class urlShortener
{
    public function shorten($message)
    {
        return str_replace('[url]', '[u]', (string) $message);
    }
}

/**
 * twitter message class - very simple - just holds the message inside itself as a string
 */
class twitterMessage
{
    public $message = '';

    public function __construct($message)
    {
        $this->message = (string) $message;
    }
}

/**
 * Observer for shortening URLs
 *
 * This class gets envoked when there is a PREPOST action, and invokes
 * the urlShortener::shorten() against it
 * @see iObserver
 */
class urlShortenerObserver implements iObserver
{
    /**
     * Tells the type of observing this will do
     * @return string
     */
    public static function getType()
    {
        return 'PREPOST';
    }

    /**
     * The notification method - is called when a PREPOST is done. shortens url
     * @param twitterMessage $object
     */
    public function notify($object)
    {
        $urlShortener = new urlShortener();
        $object->message = $urlShortener->shorten($object->message);
    }
}

/**
 * The twitter message sender, is observable, sends a message with the postMessage
 * function
 * @see observable
 */
class twitterTransportObservable extends observable
{
    /**
     * post a message to twitter, notifying any observers
     * @param twitterMessage $object
     * @see twitterTransport
     */
    public function postMessage(twitterMessage $object)
    {
        $this->_notify('PREPOST', $object);

        $sender = new twitterTransport();
        $sender->tweet($object);

        $this->_notify('POSTED', $sender);
    }
}

/**
 * abstract observable class - extended for all observable items, contains the array
 * of observers, the register and the notify commands
 */
abstract class observable
{
    /**
     * @var array the observer classes
     */
    protected $_observers = array();

    /**
     * used for registering observers, or adding them to the array
     *
     * Keep in mind, this adds them in the same order as they're added to
     * the array, so that may affect the final outcome
     *
     * @param string $type The type of observer, hook name
     * @param object $observer The observer class
     */
    public function registerObserver($type, iObserver $observer)
    {
        if (empty($type)) throw new exception("type was empty when registering " . get_class($observer));
        if (!isset($this->_observers[$type])) $this->_observers[$type] = array();
        $this->_observers[$type][] = $observer;
    }

    /**
     * used to notify self of actions of a certain type, launches observers
     *
     * @param string $type The Type of observer, the hook
     * @param object $object The observer object
     */
    protected function _notify($type, $object)
    {
        if (isset($this->_observers[$type])) {
            foreach ($this->_observers[$type] as $observer) {
                $observer->notify($object);
            }
        }
    }
}

/**
 * interface for any observer classes
 */
interface iObserver
{
    public function notify($object);
    public static function getType();
}

/**
 * launching code
 */

/**
 * global observers is an array of items which are shared in all launching software
 * tells which observers are associated with with observable
 */
$globalObservers = array('twitterTransportObservable'=>array('urlShortenerObserver'));

$tweeter = new twitterTransportObservable();

/**
 * assign all observers from our globalObservers
 */
if (isset($globalObservers['twitterTransportObservable'])) {
    foreach ($globalObservers['twitterTransportObservable'] as $observer) {
        $tweeter->registerObserver(call_user_func(array($observer, 'getType')), new $observer);
    }
}

$message = new twitterMessage("this is my message [url]");

$tweeter->postMessage($message);
```
