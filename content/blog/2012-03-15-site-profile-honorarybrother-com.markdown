---
title: 'Site Profile: honorarybrother.com'
date: 2012-03-15
tag:
- archived-projects
- business
- misc-web
---
Goal: to create a site serving females that felt a specific male in their life deserved positive recognition.  Then, to monetize the recipient from one of two targeted ads.

<!--more-->

Technology:

Zend Framework

This project was one of my first Zend Framework projects.  I did this as a proof of concept that this framework was far superior to the framework I had developed myself.  (Like they always say, PHP programmers program procedural, then OO, then create their own framework, and finally settle on an industry framework.)  I used 1.9.5 (Yah, I didn't mess with it in the pre-1.8 era.   That was just nasty.)

The process was simple.  It would prompt the girl for the "brother's" name and email as well as her own.  It would then craft an email on her behalf with a custom URL for the 'brother.'  This generated a splash page with a link.  Then it was possible to view a printable design.

From a database point of view, I used my favorite layer: PDO. :)  I just really like the prepared statement idea of making sure there is no sql injection.

Another real cool thing was that the certificates were created with AJAX requests.  I used `Zend_Json` to send back messages.

This was also one of the first applications that I used the test email feature I've blogged about before.  If the application_env was 'development', I put 'his email' after my email username with a + sign.

For this project, I also used the "Simple Modal" overlay plugin with jQuery integration.

Lessons Learned

Whenever you send an email from a server but change the 'from' address to not match (ie, to replace the real from address with the senders), you deal with potential spam issues.  I did.

From a SEO point of view, I wasn't really aware of the types of things that these girls would search, or even if they would.  I should have done a lot more research on this.

From a market point of view, I think it was potentially a risky area to enter.  Markets where 'emotion' are concerned are not my specialty.  I'm a programmer!

[![](/uploads/2012/Screenshot-at-2012-03-14-185705-150x150.png)](/uploads/2012/Screenshot-at-2012-03-14-185705.png){: .thumbnail}
[![](/uploads/2012/Screenshot-at-2012-03-14-185713-150x150.png)](/uploads/2012/Screenshot-at-2012-03-14-185713.png){: .thumbnail}
[![](/uploads/2012/Screenshot-at-2012-03-14-185842-150x150.png)](/uploads/2012/Screenshot-at-2012-03-14-185842.png){: .thumbnail}
[![](/uploads/2012/Screenshot-at-2012-03-14-190442-150x150.png)](/uploads/2012/Screenshot-at-2012-03-14-190442.png){: .thumbnail}
