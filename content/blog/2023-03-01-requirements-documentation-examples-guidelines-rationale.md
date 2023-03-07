---
title: Requirements Documentation Examples Guidelines and Rationale
date: 2023-03-01T10:00:00
tag:
- business
---
Creating a requirements document for a project can seem daunting. Where do I start? What sections are required? How do I capture everything and keep scope limited?

<!--more-->

There are no perfect "right" answers as each situation is different. However, the purpose of this page is to give you some guidance about what a requirements document and wireframe might look like. I’ve created a fake company called **Fizzle Stix** which wants to create an app called **Mass Status for Slack**.

If you’re a developer or consultant, you can use this as a set of guidelines or an example of how you might create your own wireframe and requirements document.

If you’re a prospective business client, this will show you a very simple, contrived example of the type of work you can expect out of a requirements gathering engagement.

### What Should I Create?

There are many different levels of detail you might include in the process of gathering requirements. Some would say that you should include as much detail as possible so you can quote and build things accurately. Others that preach an agile approach say that requirements are a waste of time because project needs change to quickly.

I tend to fall somewhere in the middle. Requirements documents and wireframes give a good start to a project. They develop a communication process and a shared vocabulary between two parties. They help get a vision out of the head of the business owner. They allow a developer to confirm that they understand that vision. But, they are not the Bible; they can and should change and be updated.

With this in mind, I tend to create a semi-detailed requirements document and a relatively detailed wireframe. On a detail level from least at 1 to most at 10, I do a 5 for a requirements document and an 8 for a wireframe.

#### What is a requirements document?

Generally a requirements document contains business goals and details mixed with technical specs. It is a written version of the functionality of the project. It may also detail both how and why of each feature to provide context. I tend to use Pages or Microsoft Word and then export as a PDF.

Requirements documents may contain assumptions, concerns, and features so that all members of the team are on board. Nothing’s worse than finding out 3 months into the project that “we just assumed that you would do xyz…” - so that’s where this document really shines. You think something should or may happen? Write it down. Do you plan to do something? Write it down.

#### What is a wireframe?

There are two forms of visual representation for projects: wireframes and mockups. Wireframes tend to be more sketch-like and not have as much visual detail. Their job is to help visually describe functionality without getting bogged down on stylistic choices. They are useful to show workflows. I tend to use Balsamiq or PencilApp to create the wireframes and export them as a PDF.

Mockups tend to be more stylistically filled in versions of mockups. Therefore they take longer. Depending on the needs of your project, you may have both wireframes or mockups. I tend to believe that wireframes are part of the defining stage of a project, and mockups are part of the designing / building stage.

### tldr; Show Me Examples

I’ve included two files here. The first is the requirements document and the second is the wireframe.

[![Mass Status for Slack - Requirements PDF](/uploads/2023/requirements-doc-thumbnail.png) Requirements PDF](/uploads/2023/Fizzle Stix - Mass Status for Slack - Requirements.pdf){: .thumbnail}{: .inline}

[![Mass Status for Slack - Wireframe PDF](/uploads/2023/wireframe-thumbnail.png) Wireframe PDF](/uploads/2023/Fizzle Stix - Mass Status for Slack - Wireframe.pdf){: .thumbnail}{: .inline}

You may decide to just download these and synthesize your own thoughts from them. But, if you want to learn more of the rationale, continue on below!

### Requirements Document

The sections I’ve added here are just examples of how I start out my requirements document. Sometimes I end up expanding the sections or removing them entirely. Let’s take a look at the sections.

* **Executive Summary** This is what it sounds like - just a quick few paragraphs that say what this project is and who its for. Don’t get bogged down in technology or deliverability: just who is it and what do they want.
* **Problem** Here is where you define the problem that this project is trying to solve. This is important because this context helps all understand what the point is. If everyone understands “the point” they can make better autonomous decisions throughout the project.
* **Assumptions** This section is a great place to list all of the things that you assume are the case. That is to say, what you find reasonable or “obvious” may not be the same for every stakeholder. List those things here. For example, in the tech world we may never do XYZ thing, but business people might not know that. That should be explicitly listed here.
* **Risks / Concerns** There are risks and concerns in any project. This is a great place to list things that are risks or perhaps things out of your control that may affect the project. Especially when relationships need to be created or third parties control some of the success of the project, this section should be used.
* **Technical Requirements** Most of the document has been for the business side of the project. This section is the open section for your the technical people that are part of the project. Throughout the research of the project, you may have found out specific technical challenges or services that need to be used. It’s also a great place to just very much detail the functionality and features. Nothing here in this section can be too detailed.
* **Out of Scope** In the same vein as assumptions, out of scope is a place to write down things that you “know” but should still be documented. What features were maybe talked about that didn’t make it into this final project? What adjacent things could you touch, but you’re not going to?
* **Milestones** We’re not going too far down the project management rabbit hole in this section, but we are sharing some milestones. Consider these checkpoints or logical progressions of a project. Sometimes these are useful to indicate when partial payment might happen for those who bill this way. I find it useful to help keep everyone on the same page when it comes to schedule and the linear parts of the project. Stakeholders know how far along they are in the project and what’s next.

Your requirements document may have all of these sections, or more, or less. These are just an example of sections I’ve found useful over time creating many of these documents.

### Wireframe

Each wireframe will be different for each project obviously. Some may be more detailed and some less. Here are a few thoughts I have when considering creating a wireframe.

* **Same Size Viewport** Make the wireframes use all the same size of view port. That is to say, if you’re making a browser window, make sure all of them are the size of a browser window. Same thing with app. When you swap back and forth between sizes, it can be confusing then if this is a mobile view of something, or a browser, or a zoomed in part, or the entire screen.
* **Demonstrate workflow** When possible, make elements clickable and anchor them to other places in the wireframe. This helps more visible people navigate workflow and wrap their head around it.
* **Annotate when necessary** Most of the screen should be self-explanatory. However, when certain things are necessary to know behind the scenes (like, this will not show if they’re not an admin), use annotations to explain that
* **Refrain from colors** Sometimes colors are ok, but try to stay in grayscale and do very little shading. The point of the wireframe is to imitate a napkin sketch, not a photoshop file.
* **Don’t fret over icons** Don’t worry if your wireframe tool doesn’t offer the exact UI or icons you want. Just get your point across. Designers can put a great polish on this during mockups.

I’ve had wireframes that were a fraction of the requirements document, and I’ve had ones that were twenty times more pages. It just depends on what is the best and easiest ways to describe your requirements for each unique project.

### The End

Requirement documentation is a hard process, but it’s worth it. You learn a lot about the project, develop a shared vocabulary, and can build a project plan throughout the process. Wireframes help with those who are more visual or in situations where a visual representation is more efficient and effective.

These documents have multiple parts that are a bit mix and match. Don’t worry too much about if you’ve built them correctly with the right sections - this comes with practice. It’s just about getting it all out of everyone’s heads and down on paper.

I hope this page has helped explain my rationale and given you an example or guideline to follow. If you have any questions, please let me know. If you want some more guidance on what questions to ask during the [requirements gathering]({{< ref "/blog/2023-03-01-requirements-gathering-questions-to-ask" >}}) phase, please check out my entry outlining [the best questions to ask during requirements gathering]({{< ref "2023-03-01-requirements-gathering-questions-to-ask" >}}).