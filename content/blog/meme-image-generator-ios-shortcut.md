---
title: "Make Meme Image Generator with IOS Shortcuts"
date: 2023-12-25T10:58:29-06:00
tag:
- ios
---
Sometimes you just want to generate a custom meme image but you don't want any attribution or to share it publicly like sites like Imgflip do.  You can do this easily with an iOS shortcut (likely works on MacOS too). Let's find out how.

<!--more-->

## Usage

This meme will be added to your share menu.  Then whenever you're looking at an image, you can share it (choose the share page icon - or long press on it usually) and choose the **Meme** shortcut.

It will prompt you for text at the top and at the bottom. If you don't want to position text in a particular place, don't type anything - just leave it blank.

Finally, it will prompt you to save it (to your photo album) or to copy it (to your clipboard).  

## Creating it

{{< image src="/uploads/2023/meme-shortcut.png" alt="Meme Shortcut" >}}

Let's walk through creating it.

First, go to the info icon when creating your new Shortcut.  Choose "Show in Share sheet" under details.  This will prompt you with the first item.

Limit the images and 18 more - down to just images.  Choose Stop and Respond if there is no input.

Next search 'change case' and configure it to prompt for text, and change to upper case.

Next choose the overlay image option.  Choose the shortcut input and position it at top center offset by 10%.  In Show More - you can choose the styling.  I chose font Impact, font color white, outline black, sizing proportional.

Repeat the process to add text at the bottom.

Next, add the choose from menu item.  Add Copy and Save.

Under the newly created Copy heading, put image with text to clipboard.

Under Save, choose image with text to Recents in the photo album.

## Download it

If you don't want to create this yourself, you can [download it from iCloud here](https://www.icloud.com/shortcuts/e95f0f7b7b88469aa6d80fe499fbe09f)

