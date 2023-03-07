---
title: Create Google Advanced Search String
date: 2007-09-25
tag:
- google
- php
---
I found an interesting article about the parameters of the advanced search URL for google.  Just for fun, I tested out their concepts and they were all true.  I figured maybe there was a reason to do this as a PHP class (I think I was just bored...).

<!--more-->

You can find the code here:

```php
/**
 * Google Utilities Script
 *
 * This file contains the classes for various google utilities.
 *
 * @author Aaron Saray
 */
 
/**
 * Google Parent class
 *
 * Any shared google class items
 */
class google
{}
 
/**
 * Google Search string class
 *
 * This class helps create a google search string
 *
 * Inspired by: 
 * http://www.our-picks.com/archives/2007/01/30/
 * google-search-urls-revealed-or-how-to-create-your-own-search-url/
 */
class google_searchString extends google
{
  /**
   * search terms
   * @var string
   */
  public $searchTerms = null;
 
  /**
   * exclude search terms
   * @var string
   */
  public $excludeSearchTerms = null;
 
  /**
   * or query?
   * @var boolean
   */
  public $isOr = false;
 
  /**
   * same page query?
   *
   * Means the search terms must be found on the same page, 
   * not necessarily next to each other
   * @var boolean
   */
  public $isSamePage = true;
 
  /**
   * phrase query?
   * @var boolean
   */
  public $isPhrase = false;
 
  /**
   * Number results (0 - 100)
   * @var integer
   */
  public $numberResults = 10;
 
  /**
   * Safe search?
   * @var boolean
   */
  public $isSafeSearch = true;
 
  /**
   * Last updated
   * 'y' Year  'm6' 6 months 'm3' 3 months
   * @var string
   */
  public $lastUpdated = null;
 
  /**********************************************************************/
 
  /**
   * constructor
   * Does nothing currently
   */
  public function __construct()
  {}
 
  /**
   * Get output.
   *
   * This will return the google search string.
   * @throws google_searchStringException
   * @return string
   */
  public function getString()
  {
    /** process sanity/check for errors **/
    $this->_sanityCheck();
 
    /** process into an array **/
    $values = $this->_processValues();
 
    /** return the built get string **/
    return "http://www.google.com/search?" . http_build_query($values);
  }
 
  /**********************************************************************/
 
  /**
   * Checks for errors and unset items that could cause 
   * an error for the processing script
   * @throws google_searchStringException
   */
  protected function _sanityCheck()
  {
    /**
     * check for a search term.
     */
    if ($this->searchTerms === NULL) {
      throw new google_searchStringException("Must enter a search term");
    }
 
    /**
     * check if at least but not more than 1 search types
     */
    $isTypes = array('isOr', 'isPhrase', 'isSamePage');
    $count = 0;
    foreach ($isTypes as $type) {
      if ($this->$type) {
        $count++;
      }
    }
    if (count($count) < 1) {
      throw new google_searchStringException("One type of search must be true.");
    }
    else if (count($count) > 1) {
      throw new google_searchStringException("Only one type of search must be true.");
    }
 
    /**
     * check last updated
     */
    if ($this->lastUpdated !== NULL) {
      $upTypes = array('y', 'm6', 'm3');
      if (!in_array($this->lastUpdated, $upTypes)) {
        throw new google_searchStringException(
          "Only the following values are allowed for last updated: " 
          . implode(',', $upTypes)
        );
      }
    }
  }
 
  /**
   * process values and returns them in the form of an array for a get statement
   *
   * @return array
   */
  protected function _processValues()
  {
    $values = array();
 
    /**
     * get our search string into our type
     */
    switch (true) {
      /** yes thats tacky ;) **/
      case $this->isOr:
        $values['as_oq'] = $this->searchTerms;
        break;
 
      case $this->isPhrase:
        $values['as_epq'] = $this->searchTerms;
        break;
 
      case $this->isSamePage:
        $values['as_q'] = $this->searchTerms;
        break;
    }
 
    /**
     * set exclusion
     */
    if ($this->excludeSearchTerms !== NULL) {
      $values['as_eq'] = $this->excludeSearchTerms;
    }
 
    /**
     * set number of results
     */
    $values['num'] = $this->numberResults;
 
    /**
     * set safe search
     */
    $values['safe'] = $this->isSafeSearch;
 
    /**
     * set updated
     */
    if ($this->lastUpdated !== NULL) {
      $values['as_qdr'] = $this->lastUpdated;
    }
 
    /**
     * send it back now
     */
    return $values;
  }
}
 
/**
 * Google Search String Exception
 */
class google_searchStringException extends exception
{}
 
/**
 * test
 */
$search = new google_searchString();
$search->searchTerms = 'test page';
 
print $search->getString();
```
