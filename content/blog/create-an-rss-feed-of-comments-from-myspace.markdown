---
title: Create an RSS feed of comments from myspace
date: 2007-09-08
tag:
- misc-web
- php
- scripting
---
Lately, I've been trying to find ways to reduce the amount of time I spend on stupid sites like myspace (nevermind the fact that the time it took to reduce this amount took me enough time to visit myspace 1x a day for another month – heh). At any rate, I've been using Google Reader a lot more (I'm up to 180 or so feeds) and I thought: Why don't I make an RSS feed o my comments – then I don't have to go back to the site when someone sends me a comment. 

<!--more-->

(Mind you, myspace does send you an e-mail when you receive a comment, but doesn't include the content. JEMDiary does, however ;)) I searched the internet and found a few sites that are doing that for a service, and one guy who was giving away a regular expression. So, I took his idea and wrote my own php script for cron. Check it out here:

You can take this script and modify the URL variable and run it on a PHP5 compatible host. You might also have to change the URL for your xml file. Then, just schedule the script to run every hour and feed the xml file URL to your reader. Do keep in mind that this will increase your profile views 1 for every hour (I myself don't really care...)

```php
/**
 * get a list of your comments on myspace
 * and then make an rss feed out of them
 *
 * @author Aaron Saray
 */
 
/***********************************************************************************
 * Editable content here:
 **********************************************************************************/
 
/**
 * set url:  most likely
 * www.myspace.com/username
 */
$URL = 'http://www.myspace.com/yourusername';
 
/***********************************************************************************
 * END Editable content here:
 **********************************************************************************/
 
/**
 * class to parse out the comments and create to rss
 */
class myspaceCommentToRSS
{
  /**
   * the URL of the page
   *
   * @var string
   */
  protected $_URL = '';
 
  /**
   * The commentee's username
   *
   * @var string
   */
  protected $_username = '';
 
  /**
   * the simplexml object
   * @var object
   */
  protected $_rss = null;
 
  /**
   * the myspace details
   * @var array
   */
  protected $_mySpaceData = array();
 
  /**
   * output file
   */
  protected $_outputFile = '';
 
  /**
   * constructor takes in the URL
   *
   * @param string $url
   */
  public function __construct($url)
  {
    /** set url **/
    $this->_URL = $url;
 
    /** create output filename **/
    $this->_outputFile = $_SERVER['DOCUMENT_ROOT'] . '/myspace/newestcomments.xml';
  }
 
  /**
   * output the xml
   */
  public function outputXML()
  {
    /** make sure we can get the data even **/
    $this->_parseMySpaceData();
 
    /** build the rss element **/
    $this->_buildXML();
 
    /** deposit it **/
    $this->_writeXML();
  }
 
  /**
   * parses out all of our data from my space that we'll need
   */
  protected function _parseMySpaceData()
  {
    /** get the host/url/nick out of here, this is done very programmatically **/
    $parts = explode('/', substr($this->_URL, strpos($this->_URL, '/')+2));
    $this->_username = $parts[count($parts)-1];
 
    /** open our connection **/
    $fp = fsockopen($parts[0], 80, $errno, $errstr, 30);
 
    if (!$fp) {
      die(print "Unable to open host");
    } else {
      /** make our request **/
      $out = "GET /{$parts[1]} HTTP/1.1rn";
      $out .= "Host: {$parts[0]}rn";
      $out .= "Connection: Closernrn";
      fwrite($fp, $out);

      /** gather our respsonses **/
      $f = '';
      while (!feof($fp)) {
        $f .= fgets($fp, 128);
      }

      /** close and be done **/
      fclose($fp);
    }
    
    /**
     * $f now contains the response, so match out all the data
     *
     * Thanks to makedatamakesense.com for this regular expression - saved me
     * some time
     */
    preg_match_all($REPLACEMESEEBOTTOM, $f, $matches, PREG_SET_ORDER);

    /** now sort out the data nicely **/
    foreach ($matches as $match) {
      /**
       * notes:
       * 0 = the full match
       * 1 = posters profile link
       * 2 = posters current nick
       * 3 = posters current profile pic
       * 4 = posted date
       * 5 = post content
       *
       * Double htmlentities because I don't want to include a huge entity file
       * Finally, a hardset replace so i can get normal line breaks
       */
      $this->_mySpaceData[] = array(
        'title' => htmlentities(
          htmlentities(trim($match[2]) . ' - ' . trim($match[4]), ENT_NOQUOTES), 
          ENT_NOQUOTES
        ),
        'description' => str_replace(
          '<br />', 
          '', 
          htmlentities(htmlentities(trim($match[5]), ENT_NOQUOTES), ENT_NOQUOTES)
        )
      );
    }
  }
 
  /**
   * builds our xml element
   */
  protected function _buildXML()
  {
    /** create new rss element **/
    $this->_rss = new simpleXMLElement('<rss version="2.0"></rss>');
 
    /** add our child and then add the standard identifiers to it **/
    $channel = $this->_rss->addChild('channel');
    $channel->addChild('title', "Comments for " . $this->_username);
    $channel->addChild('link', $this->_URL);
    $channel->addChild('description', 'RSS feed for MySpace comments');
    $channel->addChild('language', 'en-us');
    $channel->addChild('pubDate', date('r'));
    $channel->addChild('lastBuildDate', date('r'));

    /** loop through each myspace data array item and add an item for each **/
    foreach ($this->_mySpaceData as $data) {
      $item = $channel->addChild('item');
      $item->addChild('title', $data['title']);
      $item->addChild('description', $data['description']);
    }
  }
 
  /**
   * writes our xml document
   */
  protected function _writeXML()
  {
    $fp = fopen($this->_outputFile, 'w');
    fputs($fp, $this->_rss->asXML());
    fclose($fp);
  }
}
 
/** new instance **/
$rss = new myspaceCommentToRss($URL);
 
/** output the xml for the rss feed **/
$rss->outputXML();
```

Legacy note: 

Replace the regular expression variable with this:

```txt
#<tr>[^<]*?<td[^>]*?>[^<]*?<a href="([^"]*?)">([^<]*?)</a>[^<]*?<br />[^<]*?<br />[^<]*?<a[^>]*?>[^<]*<img src="([^"]*?)"[^>]*?>[^<]*?</a>.*?</td>[^<]*?<td[^>]*?>[^<]*<span[^>]*?>([^<]*?)</span>[^<]*<br />[^<]*<br />(.*?)</td>[^<]*?</tr>#is
```
