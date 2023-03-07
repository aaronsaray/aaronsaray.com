---
title: Leave Current Zoom Meeting with Alfred App AppleScript
date: 2020-05-26
tag:
- macos
- scripting
---
You've been there. The Zoom meeting is over and then everyone looks awkward at the bottom corner of the screen as they desperately try to leave. [Nikki Glaser](https://youtu.be/2DPw5xIupvc?t=148) will show you what I'm talking about if you don't know.  Now, if you're using [Alfred](https://www.alfredapp.com/) (like you should be on Mac), you can easily leave the meeting.

<!--more-->

**tldr;** Download [this workflow](/uploads/2020/LeaveZoom.1.0.0.alfredworkflow) and type `lz` in Alfred to leave the current meeting. It will end the meeting if you're the host.

### How It Works

To get started, we're using some AppleScript to control the current version of Zoom on MacOS.  For this workflow, I'm using Zoom 5.0.2.  I'm not great at AppleScript, but this is what I put together:

```applescript
tell application "zoom.us"
	activate
	tell application "System Events"
		keystroke "w" using {command down}
	end tell
	tell application "System Events"
		tell front window of (first application process whose frontmost is true)
			click button 1
		end tell
	end tell
end tell
```

This will activate the Zoom app, and use `Command+W` to execute the shortcut to close the window.  If you're not in a meeting, it will just close the hanging around Zoom window.  If you're in a meeting, it'll close that window.

Now, if you're hosting the meeting, it'll pop up Leave meeting, End Meeting for All, etc.  That's what we're doing with the next block. Taking the front window, which is now focused and clicking the first 'button' it can find. This luckily is the `End Meeting for All` button.

If you don't have Alfred (what??), you can create your own Application shortcut key with Automator.

Next, create an Alfred workflow.  Follow these steps:

* Make new blank workflow
* Add an `Input > Keyword` and choose `lz` for leave zoom. You can add in any detail you want.
* Add an `Action > Run NSAppleScript` and paste in the above AppleScript where the placeholder indicates you should.
* Connect these two

You're good to go!

Don't want to do this by hand? Download [this workflow](/uploads/2020/LeaveZoom.1.0.0.alfredworkflow) 

