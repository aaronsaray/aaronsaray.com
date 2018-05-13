---
layout: post
title: Easy MCrypt encryption class
tags:
- php
- security
---
For whatever reason, I can never remember the exact coding of MCrypt.  And maybe that is a good thing - so I stop doing so much code duplication and start using a class I wrote.  For this reason, I'll save you the same frustrations and share how I do my encryption.

**`easyMcrypt.php`**
```php?start_inline=1
class easyMcrypt
{
  protected static $_openModules = array();

  public static function encrypt($string, $key, $type, $mode)
  {
    $module = self::_getModule($type, $mode);
    $iv = self::_alt_mcrypt_create_iv(mcrypt_enc_get_iv_size($module), MCRYPT_RAND);
    mcrypt_generic_init($module, $key, $iv);
    $data = mcrypt_generic($module, $string);
    mcrypt_generic_deinit($module);
    return $data;
  }

  public static function decrypt($string, $key, $type, $mode)
  {
    $module = self::_getModule($type, $mode);
    $iv = self::_alt_mcrypt_create_iv(mcrypt_enc_get_iv_size($module), MCRYPT_RAND);
    mcrypt_generic_init($module, $key, $iv);
    $data = trim(mdecrypt_generic($module, $string));
    mcrypt_generic_deinit($module);
    return $data;
  }

  protected static function _getModule($type, $mode)
  {
    if (!isset(self::$_openModules[$type][$mode])) {
      if (
        in_array($type, mcrypt_list_algorithms()) 
        && 
        in_array($mode, mcrypt_list_modes())
      ) {
        self::$_openModules[$type][$mode] = mcrypt_module_open($type, '', $mode, '');
      }
      else {
        throw new exception("{$type} is not a valid algorithm");
      }
    }

    return self::$_openModules[$type][$mode];
  }

  /** from http://www.php.net/manual/en/function.mcrypt-create-iv.php#54925 **/
  protected static function _alt_mcrypt_create_iv($size)
  {
    $iv = '';
    for($i = 0; $i < $size; $i++) {
      $iv .= chr(rand(0,255));
    }
    return $iv;
  }
}
```

This will be invoked by using the static functions `encrypt()` and `decrypt()`.  It is very rare that I will use both encrypt and decrypt on the same program flow, but I may end up using `encrypt()` twice or more.  This is the reason why I do some caching in the class.  Notice, both the encrypt and decrypt methods will get the module from the protected `_getModule()` method.  This sends in the type and the mode.  This method checks to see if we've already set this module open.  If so, we don't need to open it again - just return it from the protected cache.  Otherwise, a check is done to make sure that the type and mode exist.  If so, it is stored in the cache.  Finally the stored module is returned.  If it does not exist, an exception is thrown.  I did this check - even though it seems a little redundant because why would you check to see if you're using say...tripledes - you should just know - I did it because I had some instances where a non found mode/type just returned a NULL result.  The code executed fine. Bah!

At any rate then, a new Initialization Vector is generated.  In this case, I used one of the functions I found on the PHP manual page.  I was running into the delay on some OS's / versions of PHP with the mcrypt version of `IV_CREATE`.  Then, the module is init'd, the data is either encrypted or decrypted, and the module is de-init'd.  The data is then returned (note: the decryption one trims spaces at the end that can sometimes happen).

For an example of how this is used:
    
```php?start_inline=1
$string = 'Please encrypt me';
$key = 'this is my encryption key';
$type = 'tripledes';
$mode = 'ecb';

$encrypted = easyMcrypt::encrypt($string, $key, $type, $mode);
var_dump($encrypted);

$decrypted = easyMcrypt::decrypt($encrypted, $key, $type, $mode);
var_dump($decrypted);
```
