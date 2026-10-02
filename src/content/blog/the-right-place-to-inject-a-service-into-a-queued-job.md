---
title: "The right place to inject a service into a queued job"
date: "2026-09-15"
tags:
  - laravel
  - testing
origin:
  name: Mastering Laravel
  url: "https://masteringlaravel.io/daily/2026-09-15-the-right-place-to-inject-a-service-into-a-queued-job"
  canonical: true
---

Let's take a look at this job:

<!--more-->

```php
class ProcessElectionResults implements ShouldQueue
{
  use Queueable;

  private ElectionResultsService $resultsService;

  public function __construct()
  {
    $this->resultsService = new ElectionResultsService();
  }

  public function handle(): void
  {
    if (Carbon::now()->isWeekend()) {
      $this->resultsService->deferToStartOfNextWeek();
      return;
    }

    $this->resultsService->processNow();
  }
}
```

This job works perfectly fine as written.
If it's the weekend, defer our processing until next week.
Any other day, start the processing.
And since it's using `Carbon`, testing this should be easy.
I can fake time and my job tests will be pretty small.

But, unfortunately, I hit a snag.
My `ElectionResultsService` is really expensive to boot up and has dependencies on the database and third parties.
That's a lot of setup just to test a little bit of date logic.

I'd rather mock out the service and assert which method was called based on my date.
I can't do that with the `new` keyword though.
Joel ran into a similar situation when he [made Cashier easier to test](https://masteringlaravel.io/daily/2025-03-12-another-benefit-of-my-approach-to-testing-cashier).
Sometimes the difficulty in testing is telling you that your architectural design is flawed.

The flaw?
This job isn't using dependency injection.

Since Laravel has amazing DI, I went with my first instinct: constructor injection with promotion.

```php
public function __construct(private ElectionResultsService $resultsService) {}
```

This doesn't work, though, because of the way we dispatch jobs: `ProcessElectionResults::dispatch()`.
The constructor doesn't run through the DI container that way.
So now every place that dispatches this job has to also pass in the service.
This is worse.
And to top it off, items passed into the constructor are serialized into the queue payload.
So you're potentially carrying some massive weight here.

Instead, the solution is the `handle()` method.

```php
public function handle(ElectionResultsService $resultsService): void
{
  if (Carbon::now()->isWeekend()) {
    $resultsService->deferToStartOfNextWeek();
    return;
  }

  $resultsService->processNow();
}
```

No more private variable.
Laravel calls `handle()` through the container so it resolves and injects whatever I've type-hinted.
Awesome.

And now the date logic is testable on its own with the mocked service.

```php
Carbon::setTestNow('2026-09-05'); // a Saturday

$this->mock(ElectionResultsService::class, function (MockInterface $mock) {
  $mock->shouldReceive('deferToStartOfNextWeek')->once();
  $mock->shouldNotReceive('processNow');
});

ProcessElectionResults::dispatchSync();
```

A test that targets only my date logic, with dependency injection and minimal changes to the job, is a win to me.
