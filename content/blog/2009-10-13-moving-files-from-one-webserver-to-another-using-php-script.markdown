---
title: Moving files from one webserver to another using PHP script
date: 2009-10-13
tag:
- php
---
A while back, a colleague mentioned to me that he was moving his site from one webserver to another.  He hated having to FTP everything down, then reupload it.  Invariably, we've all done this - and forgot to apply proper file permissions, etc.

<!--more-->

### Enter The Single PHP Script

As a proof of concept, I developed the following PHP script.  Currently, the ftp credentials and path are hardset.  It simply grabs all the files in the specified directory including child directories, opens an FTP connection and puts them up there.  It finishes by applying the proper file permissions.  Without further rambling, here is the code:

```php
/**
 * PHP Migrate Site
 * Proof of Concept
 *
 * This class is used to migrate files including their permissions from one server
 * to another via FTP
 *
 * @author Aaron Saray (http://aaronsaray.com)
 */
class php_migrate_site
{
  /**
   * @var string the full filename of this file
   */
  protected $_self;
 
  /**
   * @var string The base directory of our files to move
   */
  protected $_basedir;
 
  /**
   * @var array the array of SPLFileInfo objects from self::$_basedir
   */
  protected $_files = array();
 
  /**
   * @var resource The connection to the ftp server for the new files
   */
  protected $_ftpConnection;
 
  /**
   * Constructor sets time limit, gets self, sets credentials
   */
  public function __construct()
  {
    set_time_limit(0);

    $this->_self = __FILE__;

    $this->_basedir = 'C:/DEVELOPMENT/local';
    $this->_ftp = array('username'=>'test', 'password'=>'', 'hostname'=>'localhost');
  }
        
  /**
   * main public method to launch process
   */
  public function go()
  {
    $this->_loadFiles();
    $this->_makeFTPConnection();
    $this->_copyFiles();
  }

  /**
   * Loads all of the files from basedir using a 
   * recursive directory iterator from SPL
   */
  protected function _loadFiles()
  {
    $this->_files = new RecursiveIteratorIterator(
      new RecursiveDirectoryIterator($this->_basedir),
      RecursiveIteratorIterator::SELF_FIRST
    );
  }

  /**
   * Connects to ftp server and stores connection to self::$_ftpConnection
   */
  protected function _makeFTPConnection()
  {
    $this->_ftpConnection = ftp_connect($this->_ftp['hostname']) 
                          or die('could not connect');
    ftp_login(
      $this->_ftpConnection, 
      $this->_ftp['username'], 
      $this->_ftp['password']
    );
  }

  /**
   * Copies files from local to ftp - applies permissions to them.
   */
  protected function _copyFiles()
  {
    foreach ($this->_files as $file) {
      $localFileName = $file->getPath() . DIRECTORY_SEPARATOR . $file->getFilename();
      $remoteFileName = str_ireplace($this->_basedir, '', $localFileName);

      /** don't move self **/
      if ($localFileName == $this->_self) continue;

      if ($file->isDir()) {
        ftp_mkdir($this->_ftpConnection, $remoteFileName);
      }
      else {
        ftp_put($this->_ftpConnection, $remoteFileName, $localFileName, FTP_BINARY);
      }

      $chmod = substr(sprintf('%o', $file->getPerms()), -4);
      ftp_chmod($this->_ftpConnection, $chmod, $remoteFileName);
    }
  }
}

/** create new instance and run php_migrate_site::go() method **/
$migrate = new php_migrate_site();
$migrate->go();
```

### How it can be better

There are a number of ways to make this better - in case anyone has the time to do it!

#### User Friendly

The first obvious thing is user friendly interface options.  The script should present a form and ask for the credentials. It should submit to itself to start the verification process.

#### Error Checking

It should check to make sure PHP has the FTP module enabled.  It should also connect to the ftp server first to verify credentials.

#### More FTP Options

The passive and active options should be able to be set.  It should also allow for the target destination to be in a subfolder.  Some hosts require it to be in `public_html` - so you'd have to chdir there first.

#### Database

Well of course!  It would also be cool to have it migrate the database.  I know this can be done but I didn't even try to do a proof of concept with this.  There are a number of different types of connections for MySQL servers - so it could be difficult to find the proper way to do this.

All in all, I'm happy.  Thought it would be a great addition to the open source software section of my blog if I got around to it!
