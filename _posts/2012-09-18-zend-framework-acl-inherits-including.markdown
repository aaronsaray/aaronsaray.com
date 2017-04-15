---
layout: post
title: 'Zend Framework ACL: Inherits Including'
wordpress_id: 1259
tags:
- zend framework
---
So one of the things that really bothered me about the Zend ACL implementation in 1.x was the inherits() method.  It simply would test to see if the current role inherited the roles you were testing against.  Well, what if the role WAS the tested role?  Then it would fail.  So, to fix that, in my own Application_Model_Acl implementation, I wrote inheritsIncluding().  

**`Acl.php`**
```php
<?php
class Application_Model_Acl extends Zend_Acl
{
 // snippy
    public function inheritsRoleIncluding($role, $inherit, $onlyParents = false)
    {
        $inherits = $this->inheritsRole($role, $inherit, $onlyParents);
        if (!$inherits) {
            $inherits = $role == $inherit;
        }
        return $inherits;
    }  
}
```

This simply calls the parent inheritsRole() method passing in all required parameters.  If that is false, the last test is to see if the role actually is equal to the tested role.  $inherits is false, but then is set to the calculation of whether the roles are equal or not.
