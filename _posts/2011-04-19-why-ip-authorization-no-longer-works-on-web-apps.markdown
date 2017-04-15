---
layout: post
title: Why IP Authorization No Longer Works on Web Apps
tags:
- Misc Web Design
- programming
- security
---
The last time someone brought up authorizing certain actions by IP address - or I should say, limiting the amount of actions that can happen by one IP address.  I brushed that off without a second thought.  It didn't occur to me until later that the original owner of that idea may not have known all the reasons why I know this isn't a good idea.  So here's a quick rundown:

**Dial Up**

Dial up users would get a different IP address each time they connect.  They technically could connect and reconnect multiple times within the hour, getting different IP addresses and executing similar commands on the web application.  However, these are usually in the same or neighboring c-block of IP addresses.

**AOL Dial Up Users**

AOL used to do this - they may no longer.  But, some dial up providers use content proxies in order to lower the bandwidth requirements for their users.  This means the same action could come from one IP address on request one, and a different IP address in request 2.  These have been known to be IP addresses in non related c blocks.

**Broadband Users**

Usually, broadband users keep the same DHCP lease for hours, days or even weeks.  This means they could keep the same IP address nearly indefinitely.  However, if their modem is off, reboots, loses its lease, powers down or has maintenance from the ISP, they could potentially get a different IP address.  Once again, there is no real predictor of when this could happen.

**College / Business Users**

College and business users will have a NAT interior to their internet connection.  This means a few to thousands of the internet consumers could be accessing public facing websites using one IP address.  Internal to the network, they would have their own individual private IP addresses, something that the web application is not privy to.

**Starbucks**

People are doing more things from wifi enabled places.  This means that the IP address really doesn't belong to them at all.  Combined with the NAT'ing and the rapid turn over of users, this IP address is really quite used.

**Proxy browsing**

And similarly to issues with AOL style dialup, proxies are used more and more frequently for both business and personal usage.  Doing a simple google [search](https://encrypted.google.com/search?q=proxy+sites) shows tons of results for visitors to apply. 

All in all, I think IP authorization is a very bad practice.  It can be used at the router level to block bad or misbehaving subnets, but should never be used within your own web application anymore.

