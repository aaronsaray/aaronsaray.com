---
layout: post
title: Government Website Idea
tags:
- business
---
I find it very difficult to find out information about my local elected officials.  Even the federal website for congress mentions that there is no central database of email addresses and contact information for their members - which is just crazy to me.  

Any way, I came up with this website that one might call MyGovernment.io.  The goal is simple - to put this data into digestible formats.  There is very little useful information unless you're willing to search really deep and take notes.

**Mission:** Our mission is to increase the transparency of our elected officials.  
**Vision:** Our vision is to see a society of informed electorates.

I'd start with a very simple location based solution.  Basically, we're going to use google maps to show your location and draw districts on your screen.  Then, on the right hand side, there are more details about your representatives.

First, we'd get the location from the browser.  If that didn't work, we'd also focus on the IP address location.  Finally, there would be a search field to find a location - more specifically, using the [Places Searchbox](https://developers.google.com/maps/documentation/javascript/examples/places-searchbox)

Then, it's time to get the congressional districts.  [Data.gov](http://data.gov) has some really useful resources.  I found the [2014 Cartography Source File](http://catalog.data.gov/dataset/2014-cartographic-boundary-file-state-congressional-district-for-united-states-1-20000000) for the US here.  Download this and convert it to a KML file.

Next, you can load the current location (or thereabouts) KML onto the map using the [KML Google Maps feature](https://developers.google.com/maps/documentation/javascript/examples/layer-kml).

Finally, you can start to build your list of representatives from [this list](http://www.house.gov/representatives/) at the house.gov website.  

But this is only the start.  After this, you can easily add more data to these locations.  I really think there is a big need for searching for our elected officials in this manner than the old-school ways that are out there right now.
