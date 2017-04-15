---
layout: post
title: How to Use the Same Method for Add/Update in a Doctrine App
tags:
- php
---
I'm a huge fan of the service architecture paradigm - and that means that I use services in my controllers to handle persistence.  I wanted to abstract the add and update methods from my services and put them into an abstract class.  In addition, I didn't want to have to specify the exact method - I just wanted to call `save` on the entity.  Finally, I wanted to log it properly and verbosely.

So, this is what I did (I'll explain afterward):

**`src/Entity/EntityInterface.php`**  
```php?start_inline=1
namespace app\Entity;

interface EntityInterface
{}
```

**`src/Service/AbstractService.php`**  
```php?start_inline=1
namespace app\Service;

abstract class AbstractService
{
  public function __construct(
    Doctrine\ORM\EntityManager $entityManager, 
    Psr\Log\LoggerInterface $logger
  ) {
    $this->entityManager = $entityManager;
    $this->logger = $logger;
  }
     
  public function save(Entity\EntityInterface $entity)
  {
    $status = $this->entityManager->contains($entity) ? 'Updated' : 'Added';
    $this->entityManager->persist($entity);
    $this->entityManager->flush($entity);
    $this->logger->info(
      sprintf('%s entity %s', $status, get_class($entity)), 
      ['entity' => $entity]
    );
    
    return $this;
  }
}
```

So, first of all, just to make sure our `save()` method was working on an entity, I made sure all entities use the `EntityInterface` interface.  That's pretty simple and the easiest way to kind of guarantee that the incoming object *could* be an entity that doctrine manages.

Next, a call to `EntityManager::contains()` which determines if the current entity is managed by doctrine.  If it is, that means that we're working with an entity that needs to be updated.  If it doesn't contain it, chances are that the object does not represent an existing entity in the system. (One caveat - it could be a detached entity but I rarely work with those in my application so I didn't check for that.)  Then, it calls `persist()` and `flush()` just on that entity.  Finally, the logging message is programmatically created: Added/Updated entity "entity name" - so for example: `Added entity myApp\Entity\User` - and the context logged is the actual entity.