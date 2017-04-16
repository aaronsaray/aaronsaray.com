---
layout: post
title: Load Facebook Fanbox Faster by Caching it
tags:
- facebook
- PHP
---
I wasn't in favor of the Facebook fanbox on the site I was working on... but that's what the client wanted - and that is what they get.  I added it and moved on.  Well, later, I started noticing a bit of errors in my Javascript Error log.  I looked back at the newest edition: the fanbox.  Depending on where I was connecting from, that box would take another 3 to 20 seconds to load.  During that time, it was causing my page to appear to keep loading.  My fear was that other web users would think the page is not done loading and have a bad experience on the web site.

I took a look at all the requests being generated with the firebug net request console and was completely blown away.  It was loading tons of javascript and CSS - all things we had no use for.  To top it off, it lowered my ySlow grade :)

I came up with the idea to cache the results.  One of the volunteers working with the campaign I'm working on was assigned to work with me on this project: <a href="http://www.jackpolifka.com/">Jack Polifka</a>.  Some of the code and understanding I'm going to share here can be partially attributed to him.

### What Is The Plan

The plan was to do the same request as the fanbox, but to cache that response.  I thought this could be done with CURL, stored, and reloaded every hour.  It wasn't that imperative that the fan pictures and count updated every load.  Once an hour would suffice.

### Issues We Ran Into

Because the fanbox was being cached locally, it was destined not to work exactly perfect.  The good news is that we were able to completely style it perfectly to fit in our layout (Thank our good friend <a href="http://markskowrondesign.com">Mark Skowron</a> for his intuitive eye.)  There were some issues though:

#### Javascript

The first issue was the use of javascript in the fanbox.  Because Facebook was loading javascript from its own domain, it could do many extra functions that we wouldn't be able to accomplish.  The biggest one was identifying if you were already a fan of the page.  Since Facebook was loading content from their domain, they were able to access your Facebook ID and determine if you already fan'd the page.  Then, the item would update to say you're already a fan.  We couldn't do this.

#### Fan... um... relativity

If you are logged into facebook when you view the widget, it appears to search the page for fans that are friends of yours.  If so, it gives them priority in the picture ordering.  Since we couldn't provide that realtime cookie access, it is just a generic list of fans.

#### Facebook doesn't like CURL

Honest FB, I wasn't trying to mess with you or take advantage of you!  But, when you saw me coming with a CURL user agent, you stopped me in my tracks.  In order to continue the request, we had to change the CURL User Agent to something else.  Then it loaded perfectly.

### But, We did it Anyway

In the end, it was a success.  A cron job is ran every hour to get the content of the facebook widget.  Then, it is written out to a re-formatted output file and read for the next hour.

The cron script:

**`build_facebook_fanbox.php`**
```php
<?php
$builder = new facebook_fanbox();
$builder->getHTML();
$builder->write();
```

This is pretty self explanatory.  The class is instantiated.  A request is made to get the content.  And then it's written out.  Those steps are separate because it facilitates testing easier. It's not always necessary to write to a file during testing.

Next, I'm going to cover parts of the class and supporting files individually.

**`fanbox.php`**
```php
<?php
class facebook_fanbox
{
  const USER_AGENT = 'Firefox XXXXXXXXXXXX';
  const FANBOX_URL = 'http://www.connect.facebook.com/connect/connect.php?api_key=xxx&channel_url=xxx&id=xxx&name=&width=280&connections=8&stream=0&logobar=1';

  protected $_html, $_fanCount = 0, $_fans = array(), $_pageInfo, $_output;

  public function getHTML()
  {
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_USERAGENT, self::USER_AGENT);
    curl_setopt($ch, CURLOPT_URL, self::FANBOX_URL);
    curl_setopt($ch, CURLOPT_FAILONERROR, TRUE); // if 400+, error out - don't want this
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $this->_html = curl_exec($ch);

    if ($this->_html === false) {
      throw new exception(curl_errno($ch) . ': ' . curl_error($ch));
    }

    curl_close($ch);

    /**
     * write out to temp cache to review
     */
    $file = '/tmp/fanbox.html';
    file_put_contents($file, $this->_html);
  }
}
```

First, there are two constants.  The first `USER_AGENT` is just the full user agent that we use to request the content of the fanbox.  Remember, it was rejecting CURL's user agent.  The other constant is the FANBOX_URL which is the entire URL that is loaded.  I retrieved this by reviewing the requests in the net::console window of firebug.  Yours will contain your API Key and channel information.

The `getHTML()` function simply opens up a connection and retrieves the HTML.  If there are any errors, it fails.  Finally, it writes it out to a cache file in the tmp directory.  I do this just in case I want to compare later on to make sure my final output matched what I retrieved.

Moving on, I added the following method:

```php?start_inline=1
public function write()
{
  $this->_parseHTML();
  $this->_buildOutput();
  $this->_writeOutput();
}
```

This is pretty self explanatory. It just calls three internal methods, which I'll cover next.

```php?start_inline=1
protected function _parseHTML()
{
  $fancountExp = '/<span class="total">(.*?)<\/span>/';
  $fanExp ='/<div class="grid_item">(<(a|span).*?<\/(a|span)>)<\/div>/';
  $pageExp ='/<div class="connect_top clearfix">(<a.*?<\/a>)/';

  preg_match_all($fancountExp , $this->_html, $fanCount);
  $this->_fanCount = $fanCount[1][0];

  preg_match_all($fanExp, $this->_html, $fans);
  $this->_fans = $fans[1];

  preg_match_all($pageExp, $this->_html, $pageInfo);
  $this->_pageInfo = $pageInfo[1][0];
}
```

Here, there are just three regular expressions used to parse out various bits of information from the retrieved HTML.  First, the fan count.  Then, all the fan boxes (which are a tags, span tags and img tags).  Finally, it gathers the page information itself.  This allows the owner of the page to change the page name - and our code not to break!  As you can see, it assigns all of the values to the class internally.  Let's look at the next method.

```php?start_inline=1
protected function _buildOutput()
{
  $params = array(
    'count' => $this->_fanCount, 
    'fans' => $this->_fans, 
    'page' => $this->_pageInfo
  );
  $this->_output = view::get('facebook/fanboxtemplate', $params);
}
```

This is pretty simple.  It builds a parameter array of the values we've identified before.  Then, this is passed into the helper function I have to generate the view.  (The specifics of the helper function won't be covered here.  However, all it does is include the file specified in the first parameter, and assign all the values in the next parameter to an internal `$vars` array.)  This output is then assigned to an internal variable.

In order to understand how we're re-parsing the content, lets take a quick look at the stripped down HTML file.  (This is a smaller version and is only meant as demonstration).

```html
<div class="fan_box">
  <?php echo $vars['page']; ?><br />
  <div class="connect_button">
    <a href="#" id="FBbecomeFan" class="FBbutton FBbutton_Gray FBActionButton">
      <span class="FBbutton_Text">
      <span class="FBbutton_Icon FBbutton_IconNoSpriteMap">
      </span>Become a Fan</span>
    </a>
  </div>

  <div class="connections">
    <?php echo $vars['count']; ?> Fans

    <div class="connections_grid">
      <?php
      foreach ($vars['fans'] as $fan) {
        $fan = str_ireplace('<img', '<img alt="facebook profile icon"', $fan);
        print $fan;
      }
      ?>
     </div>
  </div>
</div>
```

The most notable thing about this example is that we replace the image tag from Facebook's fanbox and add in alt text. That's about it.  It's all pretty self explanatory.  (Once again, our real production version has a lot more options in it - this is just for demonstration.)

Finally, the last function is pretty simple:

```php?start_inline=1
protected function _writeOutput()
{
  $file = APPLICATION_PATH . '/views/partials/facebookfanbox.phtml';
  file_put_contents($file, $this->_output);
}
```

The final processed output is written to a page that is later included.

### Final Words
While I'd love to use Facebook's built in fanbox widget, it was causing issues with our page.  I couldn't afford to have the site slowing down because of their excessive resource loading.  I think this method bridges the difference nicely.
