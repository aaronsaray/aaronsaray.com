---
author: aaron
comments: true
date: 2007-09-20 04:14:53+00:00
layout: post
slug: add-event-viewer-to-my-computer-right-click
title: Add Event Viewer to My Computer Right-Click
wordpress_id: 76
categories:
- windows
tags:
- windows
---

Just wanted to note this awesome registry change that you could apply to get a right-click menu on my computer that allows direct access to the event viewer in windows xp.

eventviewer.reg

    
    <code>Windows Registry Editor Version 5.00
    
    ;Adds Add/Remove to right click of MY Computer
    [HKEY_CLASSES_ROOT\CLSID\{20D04FE0-3AEA-1069-A2D8-08002B30309D}\shell\Event Viewer\command]
    @="eventvwr"
    </code>
