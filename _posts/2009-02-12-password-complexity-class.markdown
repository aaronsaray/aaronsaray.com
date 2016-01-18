---
layout: post
title: Password Complexity Class
tags:
- PHP
- security
---

After many times of coding relatively the same thing, it becomes prudent to have a standard library for certain sets of processes.  Of course - that is why there are things like frameworks!  At any rate, one of the biggest things I run into is password complexity.  Each website has its own requirement for the security they want to implement.  So, let's talk about the requirements and then look at the code:


#### The Requirements


There are many different requirements that I've come across, but lets focus on the ones that I have defined in this class:




  * Minimum Password Length


  * Maximum Password Length


  * Require a Lowercase/Uppercase/Mixed case


  * Require a number


  * Require a special character


  * Require a password that is different than the last one


  * A password that does not contain a username


  * A password that has enough unique characters



Those are all of the needs I plan to address.  Additionally, there are some features like getting the standard password settings (which is max/min length, an upper a lower and a number) and the strict setting which is all of the requirements.

**Those of you who look at performance** might notice a few things that are not super efficient - such as having multiple calls to preg_match instead of combining them into a single function and using reflection and call_user_func_array instead of hardcoding the function names.  In most reusable libraries, performance should be king.  However, in this particular module, I think its used far less than most other bits of code, so I optimized for easy maintenance and upkeep.



#### The Code



Well, lets take a look at the class:

{% highlight PHP %}
<?php
class Password
{
    /** constants - are arbritrary numbers - but used for bitwise **/
    const REQUIRE_MIN         = 1;
    const REQUIRE_MAX         = 2;
    const REQUIRE_LOWERCASE   = 4;
    const REQUIRE_UPPERCASE   = 8;
    const REQUIRE_NUMBER      = 16;
    const REQUIRE_SPECIALCHAR = 32;
    const REQUIRE_DIFFPASS    = 64;
    const REQUIRE_DIFFUSER    = 128;
    const REQUIRE_UNIQUE      = 256;

    protected $_passwordMinLength = 6;
    protected $_passwordMaxLength = 32;
    protected $_passwordDiffLevel = 3;
    protected $_uniqueChrRequired = 4;
    protected $_complexityLevel = 0;
    protected $_issues = array();

    /**
     * returns the standard options
     * @return integer
     */
    public function getComplexityStandard()
    {
        return self::REQUIRE_MIN + self::REQUIRE_MAX + self::REQUIRE_LOWERCASE + self::REQUIRE_UPPERCASE + self::REQUIRE_NUMBER;
    }

    /**
     *returns all of the options
     *@return integer
     */
    public function getComplexityStrict()
    {
        $r = new ReflectionClass($this);
        $complexity = 0;
        foreach ($r->getConstants() as $constant) {
            $complexity += $constant;
        }
        return $complexity;
    }

    public function setComplexity($complexityLevel)
    {
        $this->_complexityLevel=$complexityLevel;
    }

    /**
     * checks for complexity level. If returns false, it has populated the _issues array
     */
    public function complexEnough($newPass, $oldPass, $username)
    {
        $enough = TRUE;

        $r = new ReflectionClass($this);
        foreach ($r->getConstants() as $name=>$constant) {

            /** means we have to check that type then **/
            if ($this->_complexityLevel & $constant) {

                /** REQUIRE_MIN becomes _requireMin() **/
                $parts = explode('_', $name, 2);
                $funcName = "_{$parts[0]}" . ucwords($parts[1]);

                $result = call_user_func_array(array($this, $funcName), array($newPass, $oldPass, $username));
                if ($result !== TRUE) {
                    $enough = FALSE;
                    $this->_issues[] = $result;
                }
            }
        }

        return $enough;
    }

    public function getPasswordIssues()
    {
        return $this->_issues;
    }

    protected function _requireMin($newPass)
    {
        if (strlen($newPass) < $this->_passwordMinLength) {
            return 'Password is not long enough.';
        }
        return true;
    }

    protected function _requireMax($newPass)
    {
        if (strlen($newPass) > $this->_passwordMaxLength) {
            return 'Password is too long.';
        }
        return true;
    }

    protected function _requireLowercase($newPass)
    {
        if (!preg_match('/[a-z]/', $newPass)) {
            return 'Password requires a lowercase letter.';
        }
        return true;
    }

    protected function _requireUppercase($newPass)
    {
        if (!preg_match('/[A-Z]/', $newPass)) {
            return 'Password requires an uppercase letter.';
        }
        return true;
    }

    protected function _requireNumber($newPass)
    {
        if (!preg_match('/[0-9]/', $newPass)) {
            return 'Password requires a number.';
        }
        return true;
    }

    protected function _requireSpecialChar($newPass)
    {
        if (!preg_match('/[^a-zA-Z0-9]/', $newPass)) {
            return 'Password requires a special character.';
        }
        return true;
    }

    protected function _requireDiffpass($newPass, $oldPass)
    {
        if (strlen($newPass) - similar_text($oldPass,$newPass) < $this->_passwordDiffLevel || stripos($newPass, $oldPass) !== FALSE) {
            return 'Password must be a bit more different than the last password.';
        }
        return true;
    }

    protected function _requireDiffuser($newPass, $oldPass, $username)
    {
        if (stripos($newPass, $username) !== FALSE) {
            return 'Password should not contain your username.';
        }
        return true;
    }

    protected function _requireUnique($newPass)
    {
        $uniques = array_unique(str_split($newPass));
        if (count($uniques) < $this->_uniqueChrRequired) {
            return 'Password must contain more unique characters.';
        }
        return true;
    }
}
{% endhighlight %}

Most of this code is pretty self explanatory.  And an example of how we might use this:

{% highlight PHP %}
<?php
$newPass = 'Turk3y*';
$oldPass = 'monkeyS3!';
$username = 'aaronsaray';

$PASSWORD = new Password();
$PASSWORD->setComplexity($PASSWORD->getComplexityStrict());
if ($PASSWORD->complexEnough($newPass, $oldPass, $username)) {
    print 'Going to change your password.';
}
else {
    print 'Cannot change your password because:<ul>';
    foreach ($PASSWORD->getPasswordIssues() as $issue) {
        print "<li>{$issue}</li>";
    }
    print '</ul>';
}
{% endhighlight %}


You might also try using the getComplexityStandard() method or creating your own complexity setting.  For example, if you wanted to create a site that was really lax and only required min/max and lower and uppercase, you could call the complexity routine like this:


{% highlight PHP %}
<?php
/** not recommended!! **/
$PASSWORD->setComplexity(Password::REQUIRE_MIN + Password::REQUIRE_MAX + Password::REQUIRE_LOWERCASE + Password::REQUIRE_UPPERCASE);
{% endhighlight %}
    
