---
title: Highlight Laravel Logs in PHPStorm
date: 2022-01-12
tag:
- phpstorm
- laravel
---
I'd like to say I don't ever have tons of error logs in my Laravel projects - but, sometimes it happens. With a sea of text, how can you see what you need to see easily? Enter JetBrain's idealog plugin in PHPStorm.

<!--more-->

The [idealog](https://plugins.jetbrains.com/plugin/9746-ideolog) plugin allows you to highlight logs in your PHPStorm editor.  The [wiki](https://github.com/jetbrains/ideolog/wiki) gives some insight into how to configure this with some standard log formats. I wanted to use it for my Laravel project, but I couldn't get it right.  I almost gave up - but then... 

I figured it out - and I wanted to share what I learned with you - and you can determine if its useful for you. I'm still torn on whether it's useful to me.

#### Laravel Log Configuration

First of all, I'm using a standard Laravel logging configuration.  In the `config/logging.php` file, I have default configured to `stack` which is currently only the `single` log.  This would work with `daily` as well.

#### An error or three to review

I generated an info and a warning error.  I also threw a `RuntimeException` so I could get some errors. I generated these twice.  Here's what this looks like normally in my editor:

[![Before highlight](/uploads/2022/highlight-logs-1-thumb.jpg)](/uploads/2022/highlight-logs-1.jpg){: .thumbnail}

#### Configure Highlighting

First, make sure the [Idealog](https://plugins.jetbrains.com/plugin/9746-ideolog) plugin is installed. 

Then, go to your PHPStorm preferences, then **Editor** -> **Log Highlighting (Idealog)**.  There is a section to display heatmaps or highlight code references - and log formats.  That's not part of this - you can uncheck all of those if you want.  I'm focusing on the highlighting section below.

You may have existing ones there. I made all of mine fresh.  Here are the settings I used:
* `^(Stack|\#\d)` - `Highlight line` - Foreground: `#AA5582`
* `^[^.]+\.(ERROR):` - `Highlight line` - Bold - Foreground: `#DA4848` - Show on stripe 
* `^[^.]+\.(WARNING):` - `Highlight line` - Bold - Foreground: `#C5C600` - Show on stripe

Show on stripe means that it shows on the right hand scroll bar tray so you can find it easier.  If this is full of other colors, you may need to uncheck "Display heat map on error stripe/scrollbar"

[![After highlight](/uploads/2022/highlight-logs-2-thumb.jpg)](/uploads/2022/highlight-logs-2.jpg){: .thumbnail}

Now, my logs are highlighted.

#### End Notes

I haven't yet decided if I want to use this long term - also if my color choices are any good!  And there is more in this plugin - like highlighting sections and allowing for click throughs to code (if you do your mapping properly I suppose).  It might be worth checking out.
