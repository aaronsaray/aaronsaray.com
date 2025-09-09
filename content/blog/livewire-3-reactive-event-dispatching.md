---
title: "Livewire 3 Reactive Event Dispatching"
date: 2025-09-09
tag:
- laravel
params:
  context:
    - Laravel 12
    - Livewire 3
---
Issuing events with Livewire is a useful way to communicate between components. But, there are some caveats to be aware of - especially if you're coming from something like React or Vue. The majority of this comes from the fact that Livewire treats every component as an island.

This had stumped me a few times in the past. Because of this, I wanted to give a quick example of how you can use Livewire events in a way that you might be more familiar with: with reactivity.

<!--more-->

First, let's just take a quick look at our UI for our experiment.

{{< image src="/uploads/2025/livewire-event.png" alt="Livewire Event Example" >}}


We're building something with a container component and a child component. Each has a variable that is an integer. The container passes its value to the child component as a property.

The child component can update itself which will cause no visible side effects. 

This is for the first demonstration.

Second, we have an option to issue an event instead. Normally, this would issue an event, causing no updates in the source code (as there is no listener - and none is needing to be defined). This will look like the container's number updates, but not the child component (the source of the event!). This is island-behavior, not reactive. 

However, we can fix this by adding the Reactive attribute to an element.  Let's take a look at the source code now.

```php
use Livewire\Attributes\On;
use Livewire\Component;

class EventContainer extends Component
{
  public $containerNumber = 10;

  public function render()
  {
    return view('livewire.event-container');
  }

  #[On('add-something')]
  public function handleAddSomething($amount)
  {
    $this->containerNumber += $amount;
  }
}
```

{{< filename-header "event-container.blade.php" >}}
```html
<div class="border border-gray-800 rounded-lg p-4 space-y-6">
  <h1>I am the container</h1>
  <div class="bg-gray-900 p-2 text-center">
    {{ $containerNumber }}
  </div>
  <livewire:my-emitter :emitter-number="$containerNumber"></livewire:my-emitter>
</div>
```

This is the container code.  The value is set in `$containerNumber` initially. Then, a view is rendered. Note that the `handleAddSomething()` method is
configured to be a listener with the `On` attribute.  This will increase the amount by the passed value.

So far, this is pretty simple.

The blade shows the value is displayed, and then the nested component. The `$emitterNumber` is passed in from the container.

Now, let's take a look at the emitter component.

```php
use Livewire\Attributes\Reactive;
use Livewire\Component;

class MyEmitter extends Component
{
  #[Reactive]
  public $emitterNumber;

  public function render()
  {
    return view('livewire.my-emitter');
  }

  public function add10Directly()
  {
    $this->emitterNumber += 10;
  }

  public function add10ViaEvent()
  {
    $this->dispatch('add-something', amount: 10);
  }
}
```

{{< filename-header "my-emitter.blade.php" >}}
```html
<div class="border border-gray-900 rounded-lg p-4 space-y-6 text-gray-500">
  <h2>I am a component</h2>
  <div class="bg-gray-800 p-2 text-center">
    {{ $emitterNumber }}
  </div>
  <button class="block underline hover:text-white cursor-pointer" wire:click="add10Directly">
    Click to add 10 directly
  </button>
  <button class="block underline hover:text-white cursor-pointer" wire:click="add10ViaEvent">
    Click to add 10 using an event
  </button>
</div>
```

Here you can see the actual functionality being demonstrated.

First, the `add10Directly()` method shows how we can just manipulate our own values.

Executing `add10ViaEvent()` issues an event with the amount parameter. You'll notice that our parent is set up to listen for this.

Now, here's the **magic** - the `Reactive` attribute. This is what tells Livewire that it should consider any update to that property 
from the parent, and re-render this component as well.

If you removed that attribute, the parent container number would update, but the child would not. Now it does, as expected.
