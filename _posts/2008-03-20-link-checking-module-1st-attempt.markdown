---
layout: post
title: Link Checking Module - 1st attempt
tags:
- PHP
---
So I wrote some code the other day.  It sat in my code repository and I never tested it.  I was pretty certain it was going to be some good code, though.

A few weeks later I came back to it and looked through it - and laughed!!  Anyone figure out where ALL the holes are in this code?

```php?start_inline=1
class linkChecker
{
  protected $_links = array();
 
  protected $_sites = array();
 
  public function __construct()
  {}
 
  public function addSite($site)
  {
    if (in_array($site, $this->_sites)) {
      throw new linkException("Site already in list");
    }
 
    $this->_sites[] = $site;
  }
 
  public function processSites()
  {
    foreach ($this->_sites as $site) {
      $this->_processLinks($site);
    }
  }
 
  protected function _processLinks($url)
  {
    $this->_addLink($url, $url);
    $d = new DomDocument;
    @$d->loadHTMLFile($url);
    foreach ($d->getElementsByTagName('a') as $link) {
      $this->_addLink($link->getAttribute('href'), $url);
    }
    unset($d);
  }
 
  protected function _addLink($link, $url)
  {
    $l = new checkableLink($link, $url);
    if (!isset($this->_links[$l->url])) {
      $this->_checkLink($l);
      $this->_links[$l->url] = $l;
    }
    unset($l);
  }
 
  protected function _checkLink(checkableLink &amp;$checkableLink)
  {
    $d = new DomDocument;
    $d->loadHTMLFile($checkableLink->url) or $checkableLink->valid = false;
  }
}
 
class checkableLink
{
  public $host = null;
 
  public $url = null;
 
  public $checked = false;
 
  public $valid = true;
 
  public function __construct($link = null, $url = null)
  {
    if (stripos($link, '/') === 0) {
      $this->url = $url . $link;
    }
    else {
      $this->url = $url;
    }
  }
}
 
class linkException extends exception
{}
```
