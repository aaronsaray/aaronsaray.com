---
author: aaron
comments: true
date: 2007-09-25 17:16:20+00:00
layout: post
slug: create-google-advanced-search-string
title: Create Google Advanced Search String
wordpress_id: 77
categories:
- PHP
tags:
- google
- PHP
---

I found an interesting article about the parameters of the advanced search URL for google.  Just for fun, I tested out their concepts and they were all true.  I figured maybe there was a reason to do this as a PHP class (I think I was just bored...).

You can find the code here:

<!-- more -->

    
    _sanityCheck();
    
    	    /** process into an array **/
    	    $values = $this->_processValues();
    
    	    /** return the built get string **/
    	    return "http://www.google.com/search?" . http_build_query($values);
    	}
    
    
    
    	/**********************************************************************************************/
    
    
    	/**
    	 * Checks for errors and unset items that could cause an error for the processing script
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
        	        throw new google_searchStringException("Only the following values are allowed for last updated: " . implode(',', $upTypes));
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
    
