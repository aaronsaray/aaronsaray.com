---
title: Generate the Ford Explorer 2020-2024 Manuals as PDF
date: 2024-12-08
tag:
- misc-web
---
Thanks to the [foexplorer](https://foexplorer.com) website, we have the manuals for 2020-2024 Ford Explorers online. After working with my mechanic brother on mine, it became clear that we need printable versions of these for some people. So I created a system to make them printable.

<!--more-->

## Open Source Software

To get started, know that this is open source software. This means that I choose to publish it and license it freely to anyone who wants to use it. This does not mean I have any copyright claim on the content or the usage of it in this way.

That being said, I think this falls within acceptable use. We want to print out the manual for our vehicle. Easily.

So, I created these PHP scripts to scrape the website and generate a PDF of both the owners manual and the service manual.

## Car Guy Question: How Do I Do This?

You can check out the [GitHub](https://github.com/aaronsaray/ford-explorer-owners-manual) project, the `README.md` file has all of the instructions to download the software and get it running.

I am not distributing the PDFs themselves. The owners manual is large, but the service manual is 7000+ pages coming in at 1/2GB. Perhaps the good people at [ExplorerST.org](https://www.explorerst.org/) may be able to help you out.

## Programmer Question: How does the code work?

It's a pretty simple process.  Let me give the high level bullet points.

* Download the repo
* Run Composer install
* Run one/both of the command line scripts
* Wait forEVER

So, I made a list at the time of publishing of the URLS of both the owners and service manuals. Those belong with each class for the type of manual.

Then, there is a loop that goes through and loads all of the content of the page from the URLs. The PDF is rendered with that content.

The PDF has some extra CSS added to hide specific values on the print media version that we don't need... like navigation.

Finally, there is some string manipulation to replace the title and get rid of some other HTML that I couldn't target with CSS supported by MPDF.

Oh... and yeah, don't ever set the values like I did for memory and time limits. I was able to run it on a machine with nothing else going on with 32GB of RAM.
