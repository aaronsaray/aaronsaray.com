---
author: aaron
comments: true
date: 2007-11-17 23:54:57+00:00
layout: post
slug: apd-post-processing-wrapper
title: APD post processing wrapper
wordpress_id: 85
categories:
- Misc Web Design
- PHP
- scripting
- Test Driven Development
tags:
- performance
- PHP
- Test Driven Development
---

A while ago, I discovered the 'joys' of APD... and then moreso, the 'joys' of not being able to make heads or tails out of the output script.  After digging deeper, I saw that the original directory already had some PHP scripts to parse the output.  I ran those and wasn't very impressed.  Even more important, my boss wouldn't be impressed.  I needed to be able to make something that could be useful to integrate into a table (I finally used dojo to create a table...)

At any rate, I thought I might save anyone some time by posting the code here:

<!-- more -->

This is the main APD parsing class.  As you can see, it has configurations that were local to my machine.  You'll need to edit these yourself if you plan to use the script... otherwise just learn from the main processing methods.


    
    sourceFile = self::WINSOURCEDIRECTORY . '\\' . $file;
            }
            /** handles the uploaded file **/
            elseif (is_file($file)) {
                $this->sourceFile = $file;
            }
            else {
                throw new exception("The file ". $file . ' does not exist.');
            }
        }
    
    
        /**
         * Processing Function
         *
         * This is the main processing function for all of the logic.
         */
        public function process()
        {
            /** populate our parsed file **/
            $this->parseFile();
    
            /** create sections **/
            $this->createSections();
    
        }
    
        /**
         * returns the script name from the apd trace
         *
         * @return string script name
         */
        public function getScriptName()
        {
            return str_replace('Trace for ', '', $this->summaryLines[0]);
        }
    
        /**
         * returns an array of script types keyed by their meaning
         *
         * @return array times
         */
        public function getScriptTimes()
        {
            $return = array();
    
            $return['elapsed'] = str_replace('Total Elapsed Time = ', '', $this->summaryLines[1]);
    
            $return['system'] = str_replace('Total System Time  =', '', $this->summaryLines[2]);
    
            $return['user'] = str_replace('Total User Time    = ', '', $this->summaryLines[3]);
    
            return $return;
        }
    
        /**
         * this function returns an array of the function times
         * in an array
         *
         * @return array function times
         */
        public function getFunctionTimes()
        {
            $return = array();
    
            foreach ($this->timesLines as $line) {
                /** only one space separator **/
                $line = preg_replace('/\s+/', ' ', $line);
    
                $parts = explode(' ', $line);
    
                /**
                 * determine our values off of this formula:
                 * 0 - % time
                 * 1 - real (excl)
                 * 2 - real (cumm)
                 * 3 - user (excl)
                 * 4 - user (cumm)
                 * 5 - system (excl)
                 * 6 - system (cumm)
                 * 7 - # calls
                 * 8 - seconds per call
                 * 9 - cumm seconds per call
                 * 10 - memory usage
                 * 11 - name
                 */
                $return[]= array(
                    'percentage'    =>    $parts[0],
                    'real_excl'     =>    $parts[1],
                    'real_cumm'     =>    $parts[2],
                    'user_excl'     =>    $parts[3],
                    'user_cumm'     =>    $parts[4],
                    'system_excl'   =>    $parts[5],
                    'system_cumm'   =>    $parts[6],
                    'number_calls'  =>    $parts[7],
                    'secs_call'     =>    $parts[8],
                    'cumm_secs_call'=>    $parts[9],
                    'memory'        =>    $parts[10],
                    'name'          =>    $parts[11]
                );
    
            }
    
            return $return;
        }
    
    
        /**
         * this function returns a multidimentional tree of functions that were called
         */
        public function getFunctionTree()
        {
            $return = array();
    
            /**
             * to protect our data from our sloppy function, assign to temp variable
             */
            $a = $this->functionLines;
    
            $return = $this->recursiveFunctionTree($a);
    
            return $return;
        }
    
        private function recursiveFunctionTree(&$functions, $spaces = 0)
        {
            $return = array();
    
            while ($function = array_shift($functions)) {
    
                $cnt = count_chars($function, 1);
    
    
                if (!isset($cnt[32])) {
                    $cnt[32] = 0;
                }
    
                if ($cnt[32] == $spaces) {
                    /** this means we're on the same level, so add on to our array **/
                    $return[] = $function;
                }
                else {
                    /**
                     * we must go recursive
                     */
                    if ($cnt[32] < $spaces) {
                        array_unshift($functions, $function);
                        return $return;
                    }
                    else {
                        array_unshift($functions, $function);
                        $return[] = $this->recursiveFunctionTree($functions, $spaces + 2);
                    }
                }
    
            }
    
            return $return;
        }
    
    
        /**
         * Create functions from parsed data
         *
         * This function goes through our data and creates functional sections
         */
        private function createSections()
        {
    
            /**
             * create an array for each of the sections that we'll use to populate
             */
            $functions  = array();
            $summary    = array();
            $times      = array();
    
            /**
             * set our loop control here - its also used to access the array
             */
            $control = 'functions';
    
            /**
             * loop through with reference, so we don't copy the array
             */
            foreach ($this->parsedAPD as $key=>&$line) {
                /**
                 * handle new line
                 */
                if (trim($line) == '') {
                    switch ($control) {
                        case 'functions':
                            $control = 'summary';
                            break;
    
                        case 'summary':
                            /**
                             * there is two blank lines here, so lets make sure we don't
                             * prematurely switch.
                             */
                            if (trim($this->parsedAPD[$key + 1]) != '') {
                                $control = 'times';
                            }
                            break;
    
                    }
                }
                else {
                    /**
                     * it has a value so lets put it into our array
                     */
                    array_push($$control, $line);
                }
            }
    
            /**
             * now, memory clean up, unset our parsed apd variable
             */
            unset($this->parsedAPD);
    
            /**
             * clean up our times array
             * 0, 1 and 2 are bs stuff
             */
            array_shift($times);
            array_shift($times);
            array_shift($times);
    
            /**
             * assign our next class attributes
             */
            $this->functionLines = $functions;
            $this->summaryLines  = $summary;
            $this->timesLines    = $times;
    
        }
    
    
    
    
    
        /**
         * Parse the raw APD file
         *
         * This function reads in the file, and calls our file parsing routine against it
         * and stores its values in the class.
         */
        private function parseFile()
        {
            /**
             * create the call to the system
             */
            if (stripos(PHP_OS, 'win')!== false) {
                $systemCall = self::WINPPROFCALL;
            }
            else {
                $systemCall = self::LINUXPPROFCALL;
            }
    
            $systemCall .= escapeshellarg($this->sourceFile);
    
            /**
             * call the system command and save the results
             */
            exec($systemCall, $this->parsedAPD);
        }
    
        /**
         * Get Source APD Files
         *
         * This static function reads in the directory of our apd source files,
         * gets valid files into an array, and returns a listing of the files
         * in an array keyed by their creation time ordered from newest to
         * oldest.
         *
         * @return array Filenames
         */
        public static function getSourceFiles()
        {
            $return = array();
    
            try {
                $dir = new DirectoryIterator(self::WINSOURCEDIRECTORY);
    
    	        foreach ($dir as $file) {
    	            if (!$file->isDot()) {
    	                $return[$file->getCTime()] = $file->getFilename();
    	            }
    	        }
    
    	        krsort($return);
            }
            catch (exception $e) {
                // do nothing
            }
    
            return $return;
        }
    
    }
    ?>
