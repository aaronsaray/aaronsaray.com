---
layout: post
title: 'Idea: CMS agnostic cloud storage plugin'
tags:
- Ideas for Websites
---

So I've been looking into cloud storage a bit again - and I decided to do a bit of quick research on the top three CMS in my life: Drupal, Joomla, and Wordpress.  I wanted to see if my idea made sense...

So first, here are the competitors:



### Drupal Cloud Storage


  * [Cloud Files](https://drupal.org/project/cloud_files)


  * [Google Cloud Storage](https://drupal.org/project/google_cloud_storage)


  * [Cloud Zoom](https://drupal.org/project/cloud_zoom)


  * [CDN](https://drupal.org/project/cdn)


  * [Amazon S3](https://drupal.org/project/AmazonS3)


  * [Media Mover](https://drupal.org/project/media_mover)





### Joomla Cloud Storage






  * [Perfect SkyDrive File](http://extensions.joomla.org/extensions/directory-a-documentation/cloud-storage/23933)


  * [FwCdn](http://extensions.joomla.org/extensions/core-enhancements/performance/content-networking/19489)


  * [JA Amazon S3](http://extensions.joomla.org/extensions/core-enhancements/performance/content-networking/14353)


  * [Dropbox Component](http://extensions.joomla.org/extensions/directory-a-documentation/cloud-storage/8712)


  * [jomCDN](http://extensions.joomla.org/extensions/core-enhancements/performance/content-networking/14395)





### Wordpress Cloud Storage






  * [CDN Sync Tool](http://wordpress.org/plugins/cdn-sync-tool/)


  * [WP2Cloud](http://wordpress.org/plugins/wp2cloud-wordpress-to-cloud/)


  * [StorageMadeEasy Multi-Cloud File Download](http://wordpress.org/plugins/multi-cloud-file-download/)


  * [YaDisk Files](http://wordpress.org/plugins/wp-yadisk-files/)


  * [Amazon S3 Uploads](http://wordpress.org/plugins/amazon-s3-uploads/)


  * [BuddyDrive](http://wordpress.org/plugins/buddydrives3/)


  * [Amazon Web Services for WordPress](http://wordpress.org/plugins/aws-for-wp/)


  * [Google Cloud Platform](https://github.com/GoogleCloudPlatform/appengine-wordpress-plugin)



So, here's the idea



### Build the core, add on the plugins



I think a great idea would be for someone to build a core storage system for adding, updating, and retrieving assets using the cloud.  Things like SimpleCloud are a good starting place.  So, make a quick wrapper around this and support a number of cloud storage things.

Here's the kicker: write a plugin for each of the three CMS that uses your core library.  The plugin is different code - a completely separate tool.  It interacts with the actual CMS and then calls methods from your main library.  The plugins could have their own individual features too - like 'migrate existing content.'  

Keeping things modular like this allows the core library to keep updating independent of plugins.  And, when a new version of the CMS comes out, only one plugin needs to be updated  - not the entire suite.
