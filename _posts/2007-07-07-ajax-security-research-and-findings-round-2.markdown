---
layout: post
title: AJAX Security Research and Findings - Round 2
tags:
- AJAX
- PHP
- security
---

Round 2, and the final round, is complete! The previous article [here](http://aaronsaray.com/blog/2007/06/27/ajax-security-research-and-findings-round-1/) talked about my initial findings. Well, I was able to try some proofs of concepts on my javascript finding, and I put together our top level recommendations for (”the triangle”). Lets see:

First off...

**Javascript Object**

Well, I had talked about an issue where you could substitute the javascript object across frames. Well I tried this example. Load up javascripttest.html and click the link. Nope, no dice in IE 6 and 7, FF 1.5 and 2. Whew.

**javascripttest.html**

{% highlight html %}
<html>
    <body>
        <script type="text/javascript">
            function Object() {
                this.hacked = 'test2';
            }
            document.Object = Object;
        </script>
        <iframe src="http://release.local/test.html"></iframe>
    </body>
</html>
{% endhighlight %}


**test.html**

{% highlight html %}
<html>
    <body>
        <script type="text/javascript">
            function clicker() {
                var test = {};
                var test2 = new Object();
        
                alert (test.hacked);
                alert (test2.hacked);
            }
        </script>
        <a href="#" onclick="clicker()">bleh</a>
    </body>
</html>
{% endhighlight %}


Yah - not an issue with the main browsers I use. I didn’t try it on other ones though - so it might still be an issue… who knows... I was just curious.

**The recommendations**

I got together a few of my final recommendations (yes, very devoid of anything worthwhile, heh.) This is my own AJAX recommendations I’m going to try to follow too.

My Recommendations

**Data Transfer**

	
  * Data should be sent according to the RFC 2616 in regards to GET and POST.

	
  * Data sent back to the client should be in XML format always except:

	
		
    * In cases where JSON is the overall best solution, a javascript based JSON parser should be implemented. Eval() should NEVER be used.

		
    * Never pass direct dom or javascript commands.

		
    * In order to preserve separation of view and model, try not to pass any html/css pre-formatted data.

	
	
  * AJAX requests should match the security/ssl model of the page they're on. If the page is SSL, the request must be SSL.



**AJAX Processing Script Security**



    
  * An initial token should be initialized and used in every AJAX request. The script should exit immediately if no token is present. A new token does not need to be regenerated each request.

	
  * Any error checking and validation should be done before the script begins actually processing or including any additional files. Due to the frequency of these requests, do not include additional files until all tests have past.

	
		
    * If a test requires an included file to validate the data, it is permissible to skip this step if an error condition already exists. In this case, the error(s) will be returned to the client without the additional validation.

	
	
  * If modifying the PHP session, program around conditions that additional asynchronous requests may be modifying the session as well.



**AJAX Component Initialization**




	
  * Generally, only two AJAX Request objects should be initialized on a page at any time. The general worker object and the immediate response object. Do not initialize the immediate response object if it is not needed.

	
  * All non time critical responses should be added to a cache, and then processed FIFO.

	
  * Time critical responses should create their own object. There shouldnâ‚¬â„¢t be a time where more than one time critical method is executing with proper planning.



**User Interface**



	
  * Always give a visual cue when an AJAX function is activated via a user action. This helps reduce confusion as to why there may be a delay.

	
		
    * Only two states are needed - the init and the end state - to provide cues. It is not necessary to change state for each response/state type.

	
	
  * Plan for remote script timeouts and display user friendly notifications.

	
		
    * If a script times out, every effort to halt the user from invoking that script again should be made. In our environment, most often a timed-out script reflects additional issues that a retry will not fix.

	


**Miscellaneous Notes**



	
  * Javascript Object() overwrite vulnerability existed in certain versions of IE and Firefox but was patched. There appears to still be an issue with Safari. This could be an issue with these AJAX responses. Its been tested on the browsers that we officially support and is not an issue.

	
  * The recommended library to use for AJAX requests and effects is scriptaculous. This library extends prototype. Yahoo UI libraries are a secondary choice at this time.


