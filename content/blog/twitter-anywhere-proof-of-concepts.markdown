---
title: Twitter @anywhere proof of concepts
date: 2010-05-13
tag:
- javascript
- twitter
---
First off, let me just remind you to not be an idiot like I was.  I simply found the documentation <a href="http://dev.twitter.com/anywhere/begin">here</a> and <a href="http://platform.twitter.com/js-api.html">here</a> and went to town.  After hours of trying to figure out exactly what was going on, I stumbled across some very interesting comments in the news group: The @anywhere api is not in `chirp_preview` anymore - but it's not done either.  So some of the stuff won't work - and that wasn't my fault!  Dang!  

<!--more-->

However, I was able to create a few proof of concept things.  I'm going to cover connecting to your application, showing the connection/authentication system, and retrieving information about other users via your authenticated account.

### First, set up the HTML

The following is the snippet of HTML I used for my demonstration.

```html
<html>
  <head>
    <script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.4.2/jquery.min.js"></script>
    <script src="http://platform.twitter.com/anywhere.js?id=YOUR_API_KEY&v=1" type="text/javascript"></script>
  </head>
  <body>
    <p>This should give some pretty cool features of the Twitter AT-anywhere API.</p>
    <hr />
    <div id="connect"></div>
    <div id="disconnect"></div>
    <div id="connectedUser"></div>
    <div id="connectedFunctions">
      <p>The following stuff can only be done if you're connected.</p>
      <label>
        Search this user: <input id="searchUser" />
      </label>
      <button id="doSearch">Search this user</button>
    </div>
  </body>
</html>
```

This is pretty simple, create a document, load jquery and load the twitter api using your api key, and then create some placeholder boxes.  Let's check out the first set of javascript.

### The Javascript for Authentication and User Information

```javascript
twttr.anywhere.config({
  assetHost: "twitter-anywhere.s3.amazonaws.com"
});

twttr.anywhere(function(T) {
  T("#connect").connectButton({
    authComplete: function() {
      $("#connect").hide();
      $("#disconnect").html('<a href="#" id="signoutlink"">Sign Out</a>');

      showUserInfo(T);
    },
    signOut: function() {
      $("#connect").show();
    }
  });

  if (T.isConnected()) {
    $("#connect").hide();
    $("#disconnect").html('<a href="#" id="signoutlink">Sign Out</a>');
    showUserInfo(T);
  }
});
```

To access the twitter @anywhere functionality, there is a global object called `twttr`.  Then, call the anywhere method and passing in a variable - in this case `T`.  `T` refers to the current instance of the @anywhere object.

The first block is finding the div with the id of 'connect'.  This will make this a connect button.  The connect button has two actions bound to it.  The first is `authComplete()` which will be called once the user authorizes this application.  The second is `signOut()` which is executed if someone clicks the button after they've connected.  In my example, I'm going to not use this functionality.  I did leave it in there, however, for demonstration.

The `authComplete()` method then hides the connect button.  We're already connected so we don't need to show this box.  It's important to know that this box actually transforms into a 'you are connected' icon - and allows for disconnect.  In my example, I thought this might be confusing for the user, so I remove the box entirely.  Instead, I populate the disconnect box with a signout link. This has an ID that we'll reference later.  Finally, the `showUserInfo()` function is called.  It receives a parameter of the current instance.

All that functionality only happens when the user uses the connect button. The page can still be refreshed or visited at a different time.  This is where the next snippet comes in.  When this call continues, it verifies if the user is connected with `T.isConnected()`.  If so, it basically does the same stuff as the `authComplete()` method of the `connectButton()` call.  (Yah, I should have put this in a different method..)

Next, lets look at the other code bits that we reference in this snippet.

```javascript
$("#signoutlink").live("click", function () {
  twitterSignout();
});

function twitterSignout()
{
  twttr.anywhere.signOut();
  $("#disconnect").hide();
  $("#connect").show();
  $("#connectedUser").html('');
}

function showUserInfo(T)
{
  currentUser = T.currentUser;
  screenName = currentUser.data('screen_name');
  profileImage = currentUser.data('profile_image_url');
  profileImageTag = "<img src='" + profileImage + "'/>";
  $('#connectedUser').append("Logged in as " + profileImageTag + " @" + screenName);
  T.hovercards();
}
```

First, the link with the id of `signoutlink` is now bound with jquery to the method `twitterSignout()`.  Whenever the previous bit of javascript creates this link, and it gets clicked, the `twitterSignout()` method will be called. `twitterSignout()` simply calls the @anywhere `signOut()` method, hides the disconnect link, shows the connect button, and clears the information about the previously logged in user.

The `showUserInfo()` method's content is a copy from the JS API documentation.  All it does is access the `currentUser` of the `T` (twitter @anywhere instance) and retrieve that data.  It then populates it into the div with the ID `connectedUser`.  One thing I do extra is call the `hovercards()` method.  `hovercards()` parses the document and highlights every twitter handle and creates a hover-card or popup.  I thought this would be a nice edition for the user information.

### The Javascript for Interacting with Other Users

The HTML still has an input box and button I need to add javascript for.  For the proof of concept, all we're going to do is search the user by their username and alert a few bits of information about them.

```javascript
$("#doSearch").click(function() {
  var username = $("#searchUser").val();
  if (!username) {
    alert('you must specify a user');
    return false;
  }

  twttr.anywhere(function(T) {
    if (!T.isConnected()) {
      alert('you can only use this if you are connected');
      return false;
    }
    T.User.find(username, function(user) {
      alert("user has " + user.attributes.friends_count + " friends");
      alert("user is following " + user.attributes.followers_count + " tweeple");
      alert("you are following them? " + user.attributes.following);
      alert(user.attributes.name + " last said: " + user.attributes.status.text);
    });
  });
});
```

Once the button with the id `doSearch` is clicked, the value of the input with the ID of `searchUser` is evaluated.  If empty, it tells the user to actually do something - or search someone! duh!  Then, the twitter @anywhere instance is executed again.  The first step is to make sure that the current visitor really is an authenticated user.  If not, tell them they need to be.  You've seen this code before in the upper snippet.

Next, the `User.find()` method is executed on the content of that username.  The twitter user object is passed into the callback.  The call back tells how many friends and followers the searched user has, whether the current user is following the searched user, and what that person's last status was (it uses their name to start out the sentence.).

### Ending Thoughts

I'm looking forward to what Twitter comes up with. So far, I'm super impatient.  I was ready to make my full fledged application today - but was stuck by lack of documentation and lack of features.  However, I'm sure when it's done, it will be great.  I'll post something when it's finished with a more indepth tutorial.