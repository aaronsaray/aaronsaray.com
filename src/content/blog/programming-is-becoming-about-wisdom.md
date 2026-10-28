---
title: "Programming is becoming about Wisdom"
date: "2026-10-28"
tags:
  - ai
  - business
  - programming
---
Every day I'm seeing more and more postings about how AI is eating the world of programming and developers, and you really don't need to know anything anymore. All you have to do is type and point and click.

Well, as a programmer, maybe you're thinking I'm being defensive when I say that's not entirely true. But the way we're doing programming is changing, and it's becoming more about wisdom and current knowledge. Which... still isn't easy.

<!--more-->

So the other day, I was working on a Laravel project and I ran into an issue where I needed to do some image manipulation. I was surprised that Claude reached for `Imagick` directly instead of using the image manipulation that now ships inside Laravel, built on Intervention Image.

However, the AI agent was so sure that there was no baked-in solution that I almost questioned myself. Then I decided, "No, I think I remember this because I've been trying to keep current." And that's what our job as programmers now is: to see what's new and to be able to guide these AI models. So I pushed a little further. I said, "I think there was something on a website like Laravel News or something like that. I need you to go and research the internet and check for me." It did so, apologized like all good AI models do, and then said, "Yeah, you're right. It is available in Laravel 13, but of course you're on Laravel 12."

So what should I do now? This is where the second part comes in. This is the wisdom of programming. My wisdom has come from doing things many different times and seeing what succeeds and what breaks. Knowledge is one thing, and that's what our AI models now have in spades. But wisdom - that's the key. What is wisdom? Wisdom is simply understanding the knowledge and deciding how to apply it better or appropriately.

Why does this matter in this story? Well, I decided that maybe it's time to upgrade to Laravel 13. I did a couple of different reviews, did some quick checks, and was just about to go through it.  But then, I decided to stop one more time.

Maybe I don't need to go to Laravel 13. Maybe I can use Intervention Image directly. Maybe Laravel 13 is a great choice, but I am trying to expand scope so much, just exactly like AI models sort of allow us to do with our agentic coding.

The wisdom here was to understand to ask the proper question. So I worked with Claude and said, "Let's imagine I wanted to use this package no matter what, whether it's built into Laravel 13, which is not available to me, or Laravel 12 when I install it as a dependency. Does this solve the issue, the uncomfortable feeling that I had about having `Imagick` being used directly?"

The wisdom is choosing to ask the question. The knowledge was that the package would not help me. I was converting TIFF files to PDF, and at the time of writing, Intervention Image doesn't do that. So I stayed on Laravel 12 and used `Imagick` directly after all.

The whole point of the story is that programming is changing, and we're starting to rely more on wisdom and decision-making, on knowing what's new and fresh. I feel deep down that AI agents will become better at searching the internet, be prompted to do that more, and will become more fresh. So I'm not so worried about having to remind them to check; it's the wisdom of knowing the right answer, the other conditions and questions to ask, and also things outside the project's context - understanding the business desires, the company's goals, etc.

So yeah, programmers aren't programming as much anymore, but we're using our wisdom from all this programming experience to make sure that we guide the AI agents correctly. That's what I'm seeing, at least.
