---
title: "New Typesetter Release and How AI Helped and Hurt"
date: "2026-10-12"
tags:
  - ai
  - programming
---
I just released an updated, brand new 1.0 release of my [Typesetter](https://typesetter.io) library. It's a 
library with some helpful wrappers for creating PDFs from markdown. It comes with a CLI and is a Laravel app.

I started to question the work, though. Was this still my hobby? A useful project? Did I understand what I was 'writing' anymore? Did I need to do this?

<!--more-->

[![Typesetter.io](/uploads/2026/typesetter-2x.png)](https://typesetter.io)

Typesetter has really helped in the past create some of the ebooks I'm most proud of.

There were a number of things I wanted to update and change, so now felt like the perfect time.  And, I used AI
to assist me.

## What Did I Do

First, let's talk about what I did. The [TypesetterIO](https://typesetter.io) library had a few open issues - so did the CLI.

I decided it was time to finish these, bring these up to date with best practices, and close any documentation holes.

Now, the library supports PHP 8.4+, has a Docker and regular CLI you can install, handles the newest Tempest markdown highlighting,
and offers you hooks to customize it.

The observers are updated to confirm their interfaces are honored, it has a proper release notes and changelog, and more.

Overall, I solved any open issues, and polished everything.  At time of writing, even Dependabot is clear.

And I reviewed every single line of code, but I didn't physically write any new code.

And I'm still processing how I feel about this process - coming from a traditional software background as a programmer.

## How Did I Do It

I used AI - specifically Claude Code - to fix all of my issues and update to best practices.

I feel pretty good about this - because - contrary to the big commotion going on in AI/Tech, this was not pure
vibe-coding. I actually looked at the code, and understand what was written.

But I didn't write every line of code.  And that's ok.  I use libraries all the time where I didn't write that code.

In a perfect world, I'd look at all of the composer package source code and assess each before I bring them into my project, but I don't.  So, isn't this what I'm getting from my AI assistant, too?

So, I do trust the code, but I do read it and analyze it as well. I asked questions of new sessions of Claude, and got different answers, and the combination of those things helped me direct it better.

But, is it still my project?  Is it still worth having it if I'm not really coding on it?

## Is It Still Worth Having This Project

This was a bit of a hobby project at first.  I wanted to use mPDF to create my ebooks, but there was a lot of things I needed to
customize. Some were the limitations of the mPDF library (and what it understood of CSS) - and others were just nice-to-haves that made creating ebooks easier.

I used it extensively to learn more about PDFs and mPDF. But now, I don't really use mPDF anymore in any of my projects. I use Gotenberg. So I'm not really getting the benefit anymore from learning a technology that I'm not really using still.

And was I learning from this project now? There's an argument to say that 'code review' of a project isn't really learning it - and that's what we're doing with AI (or at least what I'm doing).

Without the library, though, another user would have to learn all of this stuff by hand. Or, AI would have to recreate it.
You wouldn't benefit from all of the gotchas that I discovered and fixed - but maybe you wouldn't have those either.

The library will give an AI agent something to use though, so it makes up less stuff - and concentrates on the project, not the mechanics. So I think there's still benefit to it.

## Is an AI-Coded Project ... a Project?

This was a hobby and I really enjoyed building it out. But, honestly, I felt like the updates to 1.0 - while absolutely necessary - weren't necessarily fun or something I wanted to do. I just felt a drive to get this done - especially since I have the toolset available now.

But is this still a project I'm proud of? Yes. But only if I toe the line and keep paying attention to the code. And I can tell you, sometime between the 'this is fun - I'm making more progress on my hobby project' - and - 'I just have one more todo that Claude can wrap before I can fall asleep' - I started questioning how long I could keep going.  Will I continue to want to look at all of the code? Is it necessary? 

But, as of right now, I'm proud to announce a fully-1.0 best practice project, [TypesetterIO](https://typesetter.io) - built over years, updated recently with AI, and ready for your ebook publishing needs.
