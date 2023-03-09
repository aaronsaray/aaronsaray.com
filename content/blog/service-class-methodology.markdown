---
title: Service Class Methodology
date: 2011-08-09
tag:
- programming
- zend-framework
---
There has been a lot of discussion on forums and throughout the object oriented PHP programming community about service classes.  This is just intensified by the Zend Framework model of development coupled with the changes in their design/architecture and vocal spokespeople.  I thought I'd throw my hat in the ring for this.

<!--more-->

_Disclaimer: I have been programming PHP for a decade.  I have been programming in general for nearly 2 decades now.  I am not a comp-sci university graduate, however._

First, its important to understand the basis of what I'm calling a service class.  When I develop, I consider a service class as something that takes an object and manipulates it.  So, its important to understand that a typical 'model' should be a business object.  For example, a User is a business object.  This user may have different traits: name, email, role, etc.  This object is dumb, however. It should only know about itself.  It can have logic: it might have a method called createFullName() which means it understands the relationships of its firstName and lastName variables and can combine them intelligently.  However, beyond that, it does nothing else special except have identity.

The service class can be somewhat coupled to the business object.  So, I might have a UserService class.  This is bound to the User object.  This service class understands how to create User objects, how to edit them, etc.  This service class understands the origin of the object - for example, the database.  It is responsible for formulating a business object out of data it retrieves.  (This gets into a very in-depth discussion.  In this example, I'm going to just have my service classes have one method of retrieving data.  However, the retrieve data method could have many adapters including database, web service, memory/cache, etc).  So, this service is responsible for the object, so that the object doesn't have to be.

The service handles the object from initialization through all manipulations up until interpretation.  This is to say that the service class has the functionality to retrieve the data to create the User object, can manipulate it, can save it, and then finally can present it to a display layer to show results.  One thing that can be confusing is what should happen when something is directly coupled with this User object.  So, if a change happens to the user, and then this triggers another change that should happen to it, the user object (business object) should never be given up.  It shouldn't be exported.  Instead, adapters and strategy patterns should be implemented.  That isn't to say that the user object can't be available for query - say to get status or name - but it shouldn't be passed on.  The service class should handle one whole business process.  If this process changes, changes can be applied through adapters, different strategy or even observers. There should never be a time when a whole process that effects one object with change requires two services to handle the object.  Don't get this confused with one whole process requiring more than one service however.  And these services can even query the object, they just can't retrieve/transfer it or change it.

The real life example of this could come in the form of a Zend Framework example.  Let's say I have users on my website which are mapped to the `user` MySQL table.

First, for Zend Framework, I'm going to make a connection using ZF's database services.  This will be used later for loose-coupling in the service:

```php
class Application_Model_DbTable_User extends Zend_Db_Table_Abstract
{
  protected $_name = 'user';
}
```

Next, I'm going to create a `User` object.  (You may notice some examples make the business object extend `Zend_Db_Table_Rowset` or similar classes.  This is coupling our object way too tightly to this particular data retrieval.  Our business object model shouldn't know about that!)

```php
class Application_Model_User
{
  public $id = 0;
  public $firstName = '';
  public $lastName = '';

  public function getFullName()
  {
    return $this->firstName . ' ' . $this->lastName;
  }
}
```
    
In this example, I've added some business logic - creating a full name.

Finally the service class would be needed to be created.  In our example, I'm going to demonstrate retrieving user row `#100`
    
```php
class Application_Model_UserService
{
  public function getUserById($id)
  {
    $table = new Application_Model_DbTable_User();
    $resultArray = $table->find($id)->current()->toArray();
    $user = new Application_Model_User();
    foreach ($resultArray as $key=>$val) {
      $user->$key = $val;
    }
    return $user;
  }
}
```

Of course, as you add more functionality to this service class, some of this logic an be removed to re-usable functions with your standard refactoring methods.  (For example, caching the instance of the dbtable, etc).  This example also doesn't handle issues where maybe that value isn't handled.

The point of this example is simple: See how the service class handles creating the user object, handles getting the data, and assigning it?  This means that the data can come from a different source at any time (we could create a complex adapter system so it could easily be swapped out).  Also, the user object could be created from any data set, not just a table request, because it doesn't know any better.

_Through trial and error, these are my thoughts on Service classes.  Have any input? Would love to hear how you work._
