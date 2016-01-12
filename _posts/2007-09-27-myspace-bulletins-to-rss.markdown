---
author: aaron
comments: true
date: 2007-09-27 15:00:30+00:00
layout: post
slug: myspace-bulletins-to-rss
title: MySpace bulletins to RSS
wordpress_id: 78
categories:
- PHP
tags:
- myspace
- PHP
---

So I'm sick of myspace... or so I say to myself.  So now I log in about half the time as I did before... and this is because I've made the following script.  It logs in and grabs each bulletin from your top bulletins.  Then, it creates an RSS feed from them.

Lets check it out:

<!-- more -->

    
    Skip this Advertisement &raquo;</a>
    
    preg_match("/<a href="\"(.*?)\"">Skip this Advertisement/", $page, $redirpage);
    
    if (isset($redirpage[1])) {
    	curl_setopt($ch, CURLOPT_REFERER,"http://login.myspace.com/index.cfm?fuseaction=login.process&MyToken={$token}");
    	curl_setopt($ch, CURLOPT_URL,$redirpage[1]);
    	curl_setopt($ch, CURLOPT_POST, 0);
    	$page = curl_exec($ch);
    }
    
    //
    // check login error
    //
    if(strpos($page,"You Must Be Logged-In to do That!") !== false){
    // login error
        print 'login error';
        return 2;
    }
    
    
    
    //
    // LOGGED IN, now let's play
    //
    // find edit profile link (with token attached)
    //
    //preg_match("/ id=\"ctl00_Main_ctl00_Welcome1_EditMyProfileHyperLink\" href=\"([^\"]+)\"/",$page,$redirpage);
    //$redirpage = $redirpage[1];
    //
    // go there (edit profile)
    //
    //curl_setopt($ch, CURLOPT_URL, $redirpage);
    //$page = curl_exec($ch);
    //
    //echo $page; // do whatever you need to do
    //
    // clean up
    //
    //curl_close($ch);
    @unlink("/tmp/cookiejar-$randnum");
    
    
    
    //comment this
    //$page = file_get_contents('src.txt');
    
    preg_match('/<h5 class="heading">\s+My Bulletin Space\s+<\/h5>\s+<div style="padding:2px;">(.*?)(<tr>(.*?)<\/tr>\s+)<\/table>(.*?)<\/div>/s', $page, $found);
    
    // cuz i suck
    preg_match_all('/<tr>(.*?)<\/tr>/s', $found[2], $tds);
    array_shift($tds[0]);
    
    
    
    
    $rss = new simpleXMLElement('<rss version="2.0"></rss>');
    
    $channel = $rss->addChild('channel');
    $channel->addChild('title', "Bulletins for Myspace");
    $channel->addChild('description', 'RSS feed for MySpace bulletins');
    $channel->addChild('language', 'en-us');
    $channel->addChild('pubDate', date('r'));
    $channel->addChild('lastBuildDate', date('r'));
    
    sleep(2);
    
    foreach ($tds[0] as $td) {
        sleep(1);
        preg_match('/href=\'(.*?)\'/', $td, $match);
        //$match[1] is the url
    	curl_setopt($ch, CURLOPT_URL,$match[1]);
    	curl_setopt($ch, CURLOPT_POST, 0);
    	$page = curl_exec($ch);
    
    	preg_match('/<table id="betterb">(.*?)<\/table>/s', $page, $bul);
    
    
    	array_shift($bul);
    
    	$bul = preg_replace('/<\/?t[r|d|h].*?>/', '', $bul[0]);
    
    	//build subject
    	preg_match("/Subject:(.*?)Body/s", $bul, $titlematch);
        $title= trim(htmlentities(strip_tags($titlematch[1])));
    
        //build title
    	preg_match("/Date:(.*?)Subject/s", $bul, $datematch);
        $predate= htmlentities(strip_tags($datematch[1]));
        $pubdate = date('r', strtotime($predate));
    
        $item = $channel->addChild('item');
    
    
        $bul = trim($bul);
        $bul = html_entity_decode($bul);
        $bul = html_entity_decode($bul);
        $bul = htmlentities($bul);
    
    
    
    
        $item->addChild('title', "Bulletin from: " . $title);
        $item->addChild('description', $bul);
    	$item->addChild('pubDate', $pubDate);
    
    }
    
    
    $fp = fopen('/yourhosthere/myspace/bulletins.xml', 'w');
    fputs($fp, $rss->asXML());
    fclose($fp);



This code was heavily inspired from another blog posting - but I can't seem to remember their page anymore :(

I'm still having an issue with google reader saying that some of the bulletins are new when they're not.  I'm not sure if it is something in my script yet or if its something on the bulletins themselves... :(  any input would be appreciated.
