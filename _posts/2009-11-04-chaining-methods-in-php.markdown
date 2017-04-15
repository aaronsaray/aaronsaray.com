---
layout: post
title: chaining methods in PHP
tags:
- PHP
- programming
---
I rarely find myself needing to chain methods in PHP - but its not an altogether bad idea.  The only caveat that is necessary is that your code must be written in such a way that a method can fail, but other methods can still continue.  For example, you couldn't have one method return false... that would break the chain.  You also couldn't have a method depending on the actions of the previous method to be successful if it is allowed to legitimately fail.  There is no intermediate step to check 'is it valid to continue?'

At any rate, here is my test code that PHP method chaining works great:

```php?start_inline=1
class foo
{
    public function bar()
    {
        print 'bar<br></br>';
        return $this;
    }

    public function splat()
    {
        print 'splat!<br></br>';
        return $this;
    }

    public function twin()
    {
        return $this->single();
    }

    public function single()
    {
        print 'single<br></br>';
        return $this;
    }

    public function neato()
    {
        print 'neato';
        return $this;
    }
}

$ohNo = new foo();
$ohNo->bar()->splat();
$ohNo->twin()->neato();
```

As expected, the output is:
    
    bar
    splat!
    single
    neato

Each of these methods are pretty self explanatory.  The only one that is slightly different is the twin()/single() methods.  Note how the twin() method is returning the value of another method directly.  The chain remains solid and connected.
