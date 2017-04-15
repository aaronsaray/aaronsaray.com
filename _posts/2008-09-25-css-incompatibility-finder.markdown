---
layout: post
title: CSS incompatibility finder
tags:
- CSS
- PHP
---

This is more of a proof of concept than anything else - as most of my scripts are ;)  But, lets say you have some files that have css in them, either external stylesheets, internal one with style tags or even style attributes - and you need to update the browser support.  Wouldn't it be great to have a tool that could look through these files and point out that there are incompatibilities?

Well here is such a script!

```php?start_inline=1
/**
 * CSS Compat class
 * @author Aaron D Saray
 */
class cssCompat
{
    /**
     * used for determing type of file passed in
     * @var integer
     */
    const CSS_FILE = 1;

    /**
     * used for determining type of file passed in
     * @var integer
     */
    const MIXED_FILE = 2;

    /**
     * whether to print out files that are compatible?
     * @var boolean
     */
    const PRINT_OK_FILES = FALSE;

    /**
     * called multiple times tracker?
     * @var integer
     */
    protected $_timesProcessed = 0;

    /**
     * global tracker of incompats
     * @var integer
     */
    protected $_incompatCount = 0;

    /**
     * Available versions of browsers
     * @var array
     */
    protected $_available = array(
                                    'ff'=>array(2,3),
                                    'ie'=>array(6,7)
                                 );

    /**
     * The current browser version of the imported css
     * @var array
     */
    protected $_current = array('browser'=>NULL, 'version'=>NULL);

    /**
     * The target version of the CSS to test for
     * @var array
     */
    protected $_target = array('browser'=>NULL, 'version'=>NULL);

    /**
     * the source css file to read in
     * @var string
     */
    protected $_sourceFile = '';

    /**
     * The type of file we're reading
     * @var integer
     */
    protected $_sourceFileType = 0;

    /**
     * The content to parse
     * @var mixed
     */
    protected $_content = FALSE;

    /**
     * css parts array of all the definitions
     * @var array
     */
    protected $_cssParts = array();


    /**
     * supported attributes - used for array diffing to find the items
     * list the items that are diff between the available versions
     * not a GREAT way to do this but...
     * @var array
     */
    protected $_supportedAttributes = array(
                                    'opacity'       => array('ff2', 'ff3'),
                                    '-moz-border'   => array('ff2', 'ff3'),
                                    'behavior'      => array('ie6', 'ie7'),
                                    'min-height'    => array('ff2', 'ff3'),
                                    'min-width'     => array('ff2', 'ff3'),
                                    'max-height'    => array('ff2', 'ff3'),
                                    'max-width'     => array('ff2', 'ff3')
                                  );



    ###########################################################################     ########################################################################### 

    /**
     * empty constructor...
     */
    public function __construct()
    {}

    /**
     * if more than one time, print the # of times called
     */
    public function __destruct()
    {
        if ($this->_timesProcessed > 1) {
            print "=============\nTotal Incompatibilities: {$this->_incompatCount}\n";
        }
    }

    /**
     * used to set the current browser version of the css
     * @param string $browser
     * @param integer $version
     */
    public function setCurrent($browser, $version)
    {
        if ($this->_isValidVersion($browser, $version)) {
            $this->_current['browser'] = $browser;
            $this->_current['version'] = $version;
            print "Setting current version to: {$browser} {$version}\n";
        }
    }

    /**
     * used to set the target browser version of the css
     * @param string $browser
     * @param integer $version
     */
    public function setTarget($browser, $version)
    {
        if ($this->_isValidVersion($browser, $version)) {
            $this->_target['browser'] = $browser;
            $this->_target['version'] = $version;
            print "Setting target version to: {$browser} {$version}\n";
        }
    }

    /**
     * set the source css file
     * @param string $file
     */
    public function setSourceFile($file)
    {
        if (is_readable($file)) {
            $this->_sourceFile = $file;

            $ext = '';
            $location = strrpos($file, '.');
            if ($location !== FALSE) {
                $ext = substr($file, $location+1);
            }
            if ($ext == 'css') {
                $this->setFileType(cssCompat::CSS_FILE);
            }
            else {
                $this->setFileType(cssCompat::MIXED_FILE);
            }

            $this->_content = file_get_contents($file);
            if ($this->_content === FALSE) {
                throw new exception("Unable to get contents of file: {$file}");
            }
        }
        else {
            throw new exception("{$file} is not readable.");
        }
    }

    /**
     * sets the file type to a css or non
     * @param integer $type The type of file
     */
    public function setFileType($type)
    {
        if ($type == self::CSS_FILE || $type == self::MIXED_FILE) {
            $this->_sourceFileType = $type;
        }
        else {
            throw new exception("Type {$type} is not a proper file type.");
        }
    }

    /**
     * starts processing the comparison
     */
    public function process()
    {
        $this->_timesProcessed++;

        $this->_checkProcessSanity();

        $this->_search();
    }

    ###########################################################################     ########################################################################### 


    /**
     * quick string searching alg for finding unsupported content
     */
    protected function _search()
    {
        $current = $this->_buildArray($this->_current['browser'], $this->_current['version']);
        $target = $this->_buildArray($this->_target['browser'], $this->_target['version']);

        $searchItems = array_diff($current, $target);

        $output = "Searching {$this->_sourceFile} (";
        switch ($this->_sourceFileType) {
            case self::CSS_FILE:
                $output .= "css";
                break;
            case self::MIXED_FILE:
                $output .= "mixed content";
                break;
        }
        $output .= " file)\n";

        $incompats = 0;

        $contentArray = $this->_getContent();

        foreach ($searchItems as $item) {
            $times = 0;
            foreach ($contentArray as $content) {
                $times += substr_count($content, $item);
            }
            if ($times) {
                $incompats += $times;
                $output .= "{$item} was found {$times} time" . ($times > 1 ? 's' : '') . "\n";
            }
        }

        if ($incompats || self::PRINT_OK_FILES) {
            print $output;
            print "Incompatibilities found: {$incompats}\n\n";
        }

        $this->_incompatCount += $incompats;
    }

    protected function _getContent()
    {
        if ($this->_sourceFileType == cssCompat::CSS_FILE) {
            return array($this->_content);
        }
 
        /**
         * must be a mixed file type - so parse out the content of style tags
         */
        $return = array();
        preg_match_all("%<style\b[^>]*>(.*?)</style>|style\w*=['|\"](.*?)['|\"]%si", $this->_content, $matches);
 
        /** <style> **/
        if(isset($matches[1])) {
            foreach ($matches[1] as $content) {
                if (trim($content)) $return[] = trim($content);
            }
        }
 
        /** style="" **/
        if(isset($matches[2])) {
            foreach ($matches[2] as $content) {
                if (trim($content)) $return[] = trim($content);
            }
        }
 
        return $return;
    }
 
    /**
     * build an array of features for the requested browser/version
     * @param string $browser The browser
     * @param integer $version The version of the browser
     * @return array The combined array format
     */
    protected function _buildArray($browser, $version)
    {
        $key = $browser . $version;
        $return = array();
        foreach ($this->_supportedAttributes as $attribute=>$vals) {
            if (in_array($key, $vals)) {
                $return[] = $attribute;
            }
        }
 
        return $return;
    }
 
 
    /**
     * makes sure required items are set before continuing.
     */
    protected function _checkProcessSanity()
    {
        if (is_null($this->_current['browser']) || is_null($this->_current['version'])) {
            throw new exception("Current browser information needs to be set.");
        }
        if (is_null($this->_target['browser']) || is_null($this->_target['version'])) {
            throw new exception("Target browser information needs to be set.");
        }
        if ($this->_content === FALSE) {
            throw new exception("No content has been set.");
        }
    }
 
    /**
     * verifies that the browser / version are in the available list
     *
     * @param string $browser
     * @param integer $version
     * @return boolean
     */
    protected function _isValidVersion($browser, $version)
    {
        $b = strtolower($browser);
        if (!isset($this->_available[$b])) {
            throw new exception("{$browser} is not an available browser.");
            return false;
        }
 
        if (!in_array((int) $version, $this->_available[$b])) {
            throw new exception("{$version} is not a valid version of {$browser}");
            return false;
        }
 
        return true;
    }
}
 
try {
    /** file exts to allow **/
    $exts = array('css', 'html', 'htm', 'php', 'phtml', 'inc');
 
    /** ignore svn **/
    $ignore = '.svn';
 
    /** where to start **/
    $path = '/office';
 
    $css = new cssCompat();
 
    /** current and targets **/
    $css->setCurrent('ff', 2);
    $css->setTarget('ie', 7);
 
    /** now we do the loop **/
    $files = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($path));
    foreach($files as $name => $file) {
        if (strpos($name, $ignore) === false) {
            $parts = explode('.', $name);
            $ext = $parts[count($parts)-1];
            if (in_array($ext, $exts)) {
                $css->setSourceFile($name);
                $css->process();
            }
        }
 
    }
}
catch (exception $e) {
    print $e->getMessage();
}
```

Ok – thats the class and an example how to use it. I would be lying if I didn’t say the actual attribute searching is horrible! hahaha. But it could be expanded.

Off the top of my head, here are some todos:

    @todo support selector differences
    @todo support attribute/value combo inequalities
    @todo could break out into a css locator and a compatibility checker
    @todo could make a class to do directory iteration and check for files
    @todo output could be formatted/csv or anything
    @todo point to the actual incompatibility
    @todo handle multiple version compares
    @todo add in many more supported attributes


