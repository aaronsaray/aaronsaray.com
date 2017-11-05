---
layout: post
title: Doctrine Database Connection Fails in Gearman Worker
tags:
- PHP
- doctrine
- gearman
---
One of the things that was really bothering me when I first started using [Gearman](http://gearman.org/) was my consistently failing [doctrine database](http://www.doctrine-project.org/) connection.

At first it seemed like it was randomly dropping the connection.  Then, I noticed that it was after the gearman job had been running for a while.  This makes sense - and I also decided that I don't want to keep a database connection connected the entire time of my job either (entire time == forever basically).  Oh - and finally - my entire application bootstrap consisted of connecting to the database on each request - and that bootstrap was used in my gearman worker.

So - since I was using Doctrine, I had some helpers from their DBAL. I made the following function:

```php?start_inline=1
/** @var \Doctrine\ORM\EntityManager $em */
$em = $container['em'];

$dbWakeUp = function() use ($em) {
  try {
    if (!$em->getConnection()->ping()) {
      $em->getConnection()->close();
      $em->getConnection()->connect();
    }
  }
  catch (\PDOException $pe) {
    $em->getConnection()->close();
    $em->getConnection()->connect();
    if (!$em->getConnection()->ping()) {
      throw $pe;
    }
  }
};
```

This function takes the entity manager into the current context.  It's very simple - it does a try-catch against pinging the database to verify a database connection.  If this fails or throws an exception, close the connection (which is more of an internal state than an actual connection) - then connect.  Now, if it fails, we do the same thing again and try a ping again.  If that fails, then we know something's wrong with the database and we'll throw the exception.

Now, let's see how this is actually used.  The following code is in my gearman-worker.php file which is one of the workers that is registered with gearman.

```php?start_inline=1
$worker = new GearmanWorker();

$worker->addFunction('send-message', function(GearmanJob $job) use ($messageService) {
  $dbWakeUp();
  $messageService->sendById($job->workload());
});
```

This way - every time that this job is ran, the first thing it does is validate that the database is connected and responding. 