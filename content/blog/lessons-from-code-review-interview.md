---
title: What I Learned From Giving a Few Interactive Code Review Interviews
date: 2021-03-15
tag:
- business
---
Never one to be afraid of pointing out my flaws, I think it's time to share what I learned from doing a few interactive code review interviews. It may still be a great idea, but it's much more difficult than I thought.

<!--more-->

### The Idea

I've [learned a lot from doing 200+ interviews]({{< ref "/blog/lessons-from-200-tech-interviews" >}}), and [complained about interactive code challenges]({{< ref "instead-of-coding-interview-do-peer-review" >}}) before.  My suggestion was to have an interactive code review instead.  I wanted the candidate to not have the stress of trying to type in front of me, not to worry if they're "getting it right," and to put them into a situation that's very realistic to how I run most of my development teams: many, many code reviews.  So I put together a plan.

First, I would ask the candidate to specify which language they wanted to be "tested" on for their proficiency exam portion of the interview. I explained that, instead of writing code, we'd be reading and commenting on code together.  So, it just makes sense that they'd we'd use a language they were most comfortable with.

I explained the whole process to them in an email before they even picked the language.  After I got their response and they were scheduled, I waited till about a day before the interview.  I sent them a Github repository that had significant code in it in the language that they requested to review.  I reminded them that neither of us had participated in this code, so you can be as open and honest as you need to be.  I told them to take notes so they remember what to talk about - but not to worry, I won't be asking for the notes. I just want them to be prepared.  I had given them only a day or so because I figured that was enough time to review the code while having a low enough change that they wouldn't farm out the review to someone else.

Finally, I reminded them that I'd be taking notes during the screen share session we'd do where they reviewed the code. I'd be reviewing my findings with another person so that they could help me look for any biases in my assessment.

### How Did It Go?

Let me prefix this by saying that I still think the idea is great, but... um.... 

It went horribly.

Quite worse than I expected.

I asked one of the candidates to share their screen so we could walk through the code. We were using Zoom. For some reason, they were unable to share their screen. They just kept saying they couldn't do it. I asked what does that mean, they said they just couldn't do it - looking confused. I then shared my screen with the code and encouraged them to have me "drive" and go through the code.

Most of the candidates just started out stone faced, staring at the code when I asked them to share.  Then I had to ask questions, most of the time in a leading way, to get them to show me stuff. This was meant to be somewhat of an expository conversation where they shared information and I also asked questions. I found myself each time leading them through, picking areas of interest to me, and asking about it. I had told them in the email that they should find areas where they were impressed, areas where they learned something, and areas where they didn't agree with the way it was done.

I noticed a number of candidates also froze when I asked them some questions regarding the code on their screen that they didn't understand.  In typical technical interview questions, where I was asking the question and we weren't looking at code, people are far more likely to say they don't know.  During this process, they just all seemed to stare.

Most of them would read through the code in a new file to themselves quietly. I wasn't able to determine if they hadn't prepared, were confused, if this was above them, or they weren't good expository sharers.

### What Did I Learn?

My first hope was that I'd be able to limit some of the anxiety of spontaneous code challenges, or rapid-fire technical questions, by introducing this more conversational interview process.  I learned that if someone is going to have anxiety about the process, I don't think any form of interactive interview is going to lower their anxiety.

Lately, I happened to interview a lot of junior developers.  Most seemed to not be prepared for the interview.  They had little feedback on the code I had given them. In hindsight, I have a question, and I learned one thing, too.

First, is the fact that they were unprepared a representation of their lack of experience in the business world or a measurement of their ability to do the job?  And were they really unprepared, or frozen in "fear" is what I wondered too.

The thing I learned is its hard to pick the right "level" of code for someone to review. If they label themselves as mid-level, and I pick a mid-level project, is that the same? That's assuming that we all have the same barometer of skill.  What I learned was that I picked "hard" mid-level projects because I've been working on enterprise level code for so long. I think I picked many projects above the skill-level that the candidate was at. Because of this, it was nearly impossible to get them to give me a good review because the concepts were foreign to them. In a more advanced project, there aren't always little avenues of simpler code. Sometimes the entire project is just complex compared to the candidate's skill level.  

I wonder if I could have asked them to pick a project that they wanted to review? I've been so worried about "take home tests" or letting people have a lot of time before the interview to prepare for too long. I think the amount of people capable of cheating and faking their way through a code review, even if it was code they chose, is probably pretty slim.  They can never know what questions I might ask.

Finally the last thing I learned is that I'm not sure what this methodology was measuring - and if it was appropriate for all positions.  Was I able to measure the ability of someone to code by measuring their ability to review code? Are those actually the same skillset? I would sometimes argue that the latter is actually more important in the teams I've ran. But, if the candidate was going to apply for a position where they were the only coder, wouldn't just the ability be far more apropos to measure?  I can find arguments for each direction and answer to each point.  I guess, what I'm saying is, this mechanism, while different, maybe wasn't the right kind of different.

### Final Thoughts

I still like the idea: have someone walk you through some code.  But, maybe it should be some code they have written they can share. Or maybe I can ask them to find their favorite code repository.  What about the anxiety of it, though? I'm not sure I can fix that with this process.
