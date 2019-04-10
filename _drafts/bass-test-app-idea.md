---
layout: post
title: Bass Test App/Website
tags:
- business
- javascript
---
I was calibrating my speakers the other day, so I searched and found a Bass Test YouTube video. Later on, I was thinking about the presentation I saw where some guys made a DJ system with [Tone.js](https://tonejs.github.io/) and I wondered if it made sense to make a bass test website and/or app.

Now, I started down the path of making one myself. Then, I realized this was a very clever way of procrastinating. I think the idea still has merit to explore, but I'll just share the idea and what I thought of so far.  I don't think it makes sense for me to try to waste time building it.

You'd have a website like basetest.app where you could load up a javascript app.  You could use Tone.js I suppose.  But, you might even be able to get away with something simpler.  I'm talking about just using [AudioContext](https://developer.mozilla.org/en-US/docs/Web/API/AudioContext) in Javascript yourself.  

You could create some tones, make a rising or falling sweep, etc.  I think it'd be fun to use CSS to [shake](https://css-tricks.com/snippets/css/shake-css-keyframe-animation/) a picture of a subwoofer - possibly change the amount per the actual frequency choice as well.

And, as a brain dump, here is something I was working with just to make tones by Javascript itself:

```javascript
function doIt() {
  var context = new AudioContext();

  function playSound(arr) {
    var buf = new Float32Array(arr.length);
    for (var i = 0; i < arr.length; i++) buf[i] = arr[i];
    var buffer = context.createBuffer(1, buf.length, context.sampleRate);
    buffer.copyToChannel(buf, 0);
    var source = context.createBufferSource();
    source.buffer = buffer;
    source.connect(context.destination);
    source.start(0);
  }

  function sineWaveAt(sampleNumber, tone) {
    var sampleFreq = context.sampleRate / tone;
    return Math.sin(sampleNumber / (sampleFreq / (Math.PI * 2)));
  }

  var arr = [],
    volume = 0.2,
    seconds = 0.5,
    tone = 100;

  for (var i = 0; i < context.sampleRate * seconds; i++) {
    arr.push(sineWaveAt(i, tone) * volume);
  }
  for (var i = 0; i < context.sampleRate * seconds; i++) {
    arr.push(sineWaveAt(i, tone) * volume);
  }

  playSound(arr);
}
```

I found some code like this on StackOverflow and modified it.  Just be sure that you start the audio context by a user action - otherwise it won't work:

```html
<a href="#" onclick="doIt()">bass</a>
```
