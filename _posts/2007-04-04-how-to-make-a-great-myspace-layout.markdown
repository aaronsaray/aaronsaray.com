---
layout: post
title: How to make a Great MySpace Layout
tags:
- CSS
- html
- myspace
- PHP
- misc web design
---

In this posting, I’m going to share the steps to making a slimmed down, cleaner, nicer layout for MySpace to help showcase your personal interests, your band, or your business.

### Always Develop Locally

I always work locally when I design web pages. For example, when I worked on the new JEMDiary website, I made a copy of the existing one locally, and then started editing it locally. The same applies with this MySpace layout project. View your profile, click File – Save – and save the entire webpage.

I also suggest viewing the source of the myspace page and commenting / removing a specific javascript call:

oas_ad(“www.myspace.com/viewprofile,11013005″,”Leaderboard2”);

This appears to generate the top ad on your profile. I found it better and easier on my eyes to take a screenshot of the ad, and use that.

### What Do I have to keep?

You have to keep the ad at the top; thats why I suggested taking a screedshot. Place this ad in the center of your page. That appears to be the only real big key item to keep.

### What SHOULD I keep?

Because MySpace users are normally used to having the links at the top of the page, its a good idea to keep some of them there. I personally use the ‘Home’ and ‘Search’ links alot. I also appreciate ‘Music’ so I’ve kept that one there as well. If you were to remove all of these links, your visitors may not want to come back. People tend to feel ‘trapped’ on a page if the layout/functionality changes too much.

### Customizing the Current Layout vs Creating a New One

For a period of time, I had customized the current layout. The CSS needed to do this is quite intricate to build, however. The new layout was a little bit more customizable and could use easier CSS declarations and better well-formed xhtml. There are pro’s and con’s to both:

Current Layout Pros: when MySpace adds new features, you immediately have them available, usually is a more familiar type of page for avid MySpace users, allows typical features of display picture and comments to display on the page.

New Layout Pros: Completely customize the user experience – you can control all the information you want to display. Easier to code (in my opinion).

### Alrighty – tell me how to do it!

First, you have to determine where to put your CSS and where to put your HTML. YOu could put it all in one section, but I chose to split mine up. ALWAYS put your CSS first, however. This allows the browser to read it in and then apply the style immediately to HTML its rendering. If you do it the other way, there’s a small chance to see a jumpy page.

Remember, we’re developing locally – so open up your copy of your profile. I put my CSS in the ‘About Me’ section.

The first CSS I added is this:

```css
.main {
    position: absolute;
    left: 50%;
    top: 125px;
    width: 1000px;
    z-index: 1;
    margin-left: -500px;
}

.maintable {
    width: 1000px;
    height: 800px;
    cellpadding: 0px;
    cellspacing: 0px;
    background-color: 000000;
}
```

OK – but you said you were going to use Well-Formed HTML – I see problems!

Right-o you do. The first thing you’ll notice is that there are no IDs referenced in this css. With a name like ‘main’ you can pretty much assume there’s only one version. The next thing you’ll notice is the lack of pound signs infront of the css hex colors. The reason for this is that MySpace filters out the # symbol for whatever reason. So, we can’t reference elements by id’s and we can’t use properly declared hex values. Luckily for us, most browsers will interpret that 6 digit number as hex. Whew!

The screen size (width elements) are based on the normal screen size. Technically, MySpace’s layout is only 800px wide, but I tend to design for 1000px. So I made mine that wide. If you go with an 800px layout, margin-left would be negative half of that… so -400px.

It is also important to apply a height to the table initially to block out all the content. Depending on the length of your new content, you may not need to do this. I set mine to what works. Finally, make sure to have a background color or image in order to block out the content.

Next, the equivalent HTML (in the Who I’d like to meet section)

```html
<div class="main">
    <table class="maintable">
        <tr><td valign="top">
            <!-- content here -->
        </td></tr>
    </table>
</div>
```

This matches up with the css. The ‘content here’ comment would be where you’d start stashing all of your content.

### Comments still show through?

Sometimes the comments still end up showing through onto your front page, so insert this html at the VERY BOTTOM of your html in the who I’d like to meet section.

```html
<!-- hides comments    -->
<div style="position: relative; height: 380px; overflow: hidden; border: 0px;">
<table><tr><td><table><tr><td>
```

### Now, take a quick preview!

You should be able to open this page up locally in a webbrowser, and see your brand – new … BLANK myspace page. You have the ad, and thats about it.

### What should be my next steps?

I opened up a new page in Gimp (like photoshop) and started creating my layout, merging pictures, etc. Then when I finally had a style I liked, I ended up breaking out the pictures and assigning them with embeded style declarations with absolute positioning. Very nice. Quick helpful note: don’t forget to add the following CSS:

```css
a img {
    border: none;
}
```

This will keep your image links from having a border and throwing off your layout.

### What about Comments?

You can still have a user comment on your profile by providing the typical comment link. However, you may want to provide them with a form to use directly from your page. Use the following HTML:

```html
<form method="post" action="http://comments.myspace.com/index.cfm?fuseaction=user.ConfirmComment">
    <input type="hidden" name="friendID" value="##yourfriendidnum##">
    <textarea name="f_comments"></textarea><input type="submit" />
</form>
```

This is very stripped down, but thats all you need to get the user to your confirm comment screen. Make sure to put your own numeric friend id number in the value of that hidden input, however.

(Note: Comments are not covered in the advanced programming section either. I don’t want to make images out of them. If anyone has any other ideas, let me know. I had thought of once creating a parser that reads them in, then creates an rss feed, which is read in by a flash ap… but I’m not really a flash programmer…)

### Advanced Programming (top friends, friends count)

You may have noticed that you no longer have your top friends or a listing of your friend count on your front page. while the rest of the stuff was easy to figure out how to link to (like Add Me, Message Me, etc), the top friends can be hard. People are always changing their pictures – how do you keep up with this on your custom page as well as still allow yourself to change your top friends through myspace? A PHP script is the Answer.

If you don’t know PHP and don’t have an understanding of programming, this part may be a bit greek.

The first thing I wanted to do was get my friend count. Locally I was able to use file_get_contents() with a remote URL. My hosting provider had allow_url_fopen turned off however. So I had to create my own hacked up function (side note: I should point out that I usually code alot nicer than this – but in the spirit of myspace, I hacked everything together too). I created the function get_contents to use in place of file_get_contents();

```php?start_inline=1
function get_contents($url)
{
    $parts = explode('/', $url, 2);
    $fp = fsockopen($parts[0], 80, $errno, $errstr, 30);
    if (!$fp) {
        die();
    } else {
        $out = "GET /{$parts[1]} HTTP/1.1\r\n";
        $out .= "Host: {$parts[0]}\r\n";
        $out .= "Connection: Close\r\n\r\n";
        $f = '';
        fwrite ($fp, $out);
        while (!feof($fp)) {
            $f .= fgets($fp, 128);
        }
        fclose($fp);
    }
    return $f;
}
```

The first thing I do is read in the profile page (yay – the content is still there – its just been hidden with CSS).

```php?start_inline=1
$f = get_contents ('profile.myspace.com/index.cfm?fuseaction=user.viewprofile&amp;friendid=#######');
```

### Remote Text Isn’t Allowed! – Use an image

Because of no remote text, I have to create an image with my friend count. In order to do that, I wrote a quick regular expression to find my friend count. Then, a new image is created with the GD library, filled with an off black background, and text added with a bluey color. Finally, its written out to a public directory so that I can add it as an item in my HTML part of my profile. Here is the code:

```php?start_inline=1
preg_match ('/<span class="redbtext">(\d+)<\/span>/', $f, $x);
$friendcount = $x[1];
$countpic = imagecreatetruecolor(300, 50);
$fill2 = imagecolorallocate($countpic, 16, 16, 16);
imagefill($countpic, 0, 0, $fill2);
$color = imagecolorallocate($countpic, 14,93,248);
imagestring($countpic, 5, 0, 0, "I have {$friendcount} friends... wow!", $color);
imagestring($countpic, 5, 0, 20, "I'm not really THAT cool...", $color);
imagepng($countpic, '../fcount.png');
preg_match('/<span class="redbtext">(\d+)<\/span>/', $f, $x);
$friendcount = $x[1];
$countpic = imagecreatetruecolor(300, 50);
$fill2 = imagecolorallocate($countpic, 16, 16, 16);
imagefill($countpic, 0, 0, $fill2);
$color = imagecolorallocate($countpic, 14,93,248);
imagestring($countpic, 5, 0, 0, "I have {$friendcount} friends... wow!", $color);
imagestring($countpic, 5, 0, 20, "I'm not really THAT cool...", $color);
imagepng($countpic, '../fcount.png');
```

### But what about my buddies?

I made a collage.

I wrote a few regular expressions based on table layouts… but that just turned out really bad. I finally did another approach. It looks like they have an ID system set up for your friends links… so I wrote a regular expression based off of that. This is what it is:

```php?start_inline=1
$m = '<a href\="http.*?id\="ctl00_Main_ctl00_UserFriends.*?src=\"(.*?)\"';
$c = preg_match_all('/' . $m . '/s', $f, $matches);
$items = array_reverse($matches[1]);
```

First off, it gets all the full paths for the images, then it agregates them in a reverse array. I reversed it because my most important friend is first… and when I reverse it, the least important one is written the image first (possibly being overwritten).

Once again, read in each file’s content. You could use the gd’s createimagejpg with remote URLs … but I couldn’t. (random side note: yes, I am not allowing for non jpgs… it might crash.) I had to end up using wget through passthru() call (dumb: why have remote urls off but allow system calls?). I did this:

```php?start_inline=1
foreach ($items as $item) {
    passthru ("wget {$item}");
}
```

Then I read them all in using glob(*.jpg) into an array that we iterate through… but first: create your image to be used as the main item.

```php?start_inline=1
$mainpic = imagecreatetruecolor(450, 170);
$fill = imagecolorallocate($mainpic, 16, 16, 16);
imagefill($mainpic, 0, 0, $fill);
```

Of course, now that I have an array of jpg files, the importance is no longer available by the array_reverse() call – so I just do a quick shuffle() on the array.

Finally, the final loop:

```php?start_inline=1
foreach ($jpgs as $jpg) {
    $pic = imagecreatefromjpeg($jpg);
    $size = getimagesize($jpg);
    $x = rand(1, 380);
    $y = rand(1, 120);
    imagecopymerge($mainpic, $pic, $x, $y, 0, 0, $size[0],$size[1], 100);
    unlink($jpg);
}
```

We create a new GD image from each, get their size into the size array, generate a random x,y coordinate 50px less than our main picture (cuz we don’t want to totally write them off the screen!) We finally merge them in with the original image, and delete our wget version (you wouldn’t have to do this with the remote url option).

And …drum roll please… the friend collage.

Finally, the friends are written to a public directory:

```php?start_inline=1
imagepng ($mainpic, '../fs.png');
```

There you go.

### There’s a better way to do this!

If you have a better, more effecient way to create any of this content and functionality, please let me know! Any feedback would be appreciated.
