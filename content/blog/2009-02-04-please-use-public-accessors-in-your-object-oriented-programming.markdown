---
title: Please Use Public Accessors in your Object Oriented Programming
date: 2009-02-04
tag:
- php
- programming
---
I really hate to see people accessing and designing objects with public attributes.  So many times I've seen this backfire.  Lets take a few examples and see why this matters:

<!--more-->

### The Simple Book Class

Well first, lets say we're dealing with books.  We need to know the title, author and the page count.  We want to store this in an object.  So, we create an instance of the book, and then want to print out the information about it.  In this example, we're just hard setting the values - not actually performing a query.

**Bad Example**

```php
class Book
{
  public $title;
  public $author;
  public $pageCount;

  public function __construct()
  {
    //for testing, populate
    $this->title = 'PHP Design and Programming';
    $this->author = 'Aaron Saray';
    $this->pageCount = 333;
  }
}

$book = new Book();
print $book->title . ' was written by ' . $book->author
      . ' and has ' . $book->pageCount . ' pages';
```

This works fine and outputs our information.  However, this is not good practice.  You should be using public accessors.

### The Book Class with Accessors

I used to think that was stupid to write an accessor for every variable.  I mean, if I have `$title`, why do I have to write a function called `getTitle()`?  Well, what if the way title is retrieved is changed?  Anyways, lets look at the proper way to write this class:

**Book Done Right**

```php
class BookWithAccessors
{
  protected $title;
  protected $author;
  protected $pageCount;

  public function __construct()
  {
    //for testing, populate
    $this->title = 'PHP Design and Programming';
    $this->author = 'Aaron Saray';
    $this->pageCount = 333;
  }

  public function getTitle()
  {
    return $this->title;
  }

  public function getAuthor()
  {
    return $this->author;
  }

  public function getPageCount()
  {
    return $this->pageCount;
  }
}

$book = new BookWithAccessors();
print $book->getTitle() . ' was written by ' . $book->getAuthor()
      . ' and has ' . $book->getPageCount() . ' pages';
```

Ok - so far still seems like a lot more code for the same results.  You'll notice I added the public methods and changed the public attributes to protected.

### Proof that it was a good idea

Ok, so imagine this scenario:  other programmers have been tasked to make the Author into a class.  There is additional information about authors that we need to do, so storing it in an object.  Additionally, we need to add padding onto the page count for white pages for all books.

Note, in this example, the code to print out the details about the book does not change.  The only changes are within the class itself.  So, the printing code may be used in many different places, but you only have to change the class once.  (For demonstration, I did change the name of the class though. Normally, you would not have to do this.)

**New Features**

```php
class Author
{
  protected $firstName;
  protected $lastName;

  public function __construct()
  {
    //for testing, populate
    $this->firstName = 'Aaron';
    $this->lastName = 'Saray';
  }

  public function getFullName()
  {
    return $this->firstName . ' ' . $this->lastName;
  }
}

class BookProvesMyPoint
{
  protected $title;
  protected $author;
  protected $pageCount;
  const WHITE_PAGES = 10;

  public function __construct()
  {
    //for testing, populate
    $this->title = 'PHP Design and Programming';
    $this->author = new Author();
    $this->pageCount = 333;
  }

  public function getTitle()
  {
    return $this->title;
  }

  public function getAuthor()
  {
    return $this->author->getFullName();
  }

  public function getPageCount()
  {
    return $this->pageCount + self::WHITE_PAGES;
  }
}

$book = new BookProvesMyPoint();

print $book->getTitle() . ' was written by ' . $book->getAuthor()
      . ' and has ' . $book->getPageCount() . ' pages';
```

So, the point is - use good OO habit by using public accessors!
