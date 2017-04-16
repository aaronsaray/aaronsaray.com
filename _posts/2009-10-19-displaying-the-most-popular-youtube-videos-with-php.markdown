---
layout: post
title: Displaying the Most Popular Youtube Videos with PHP
tags:
- PHP
- xml
---
During one of my random dreams of how to become an internet millionaire, I thought about displaying the top youtube videos on an aesthetically pleasing backdrop.

While I'm not feeling that artsie right now, I did code together a quick script to do this using SimpleXML:

```php?start_inline=1
function embed($src)
{
  return '<object width="560" height="340"><param name="movie" value="' .
         $src . '"></param><param name="allowFullScreen" value="true"></param>
         <param name="allowscriptaccess" value="always"></param><embed src="' .
         $src . '" type="application/x-shockwave-flash" allowscriptaccess="always"
         allowfullscreen="true" width="560" height="340"></embed></object>';
}

$xml = simplexml_load_file(
  'http://gdata.youtube.com/feeds/base/standardfeeds/most_popular'
);

echo '<h1>Most Popular YouTube Videos</h1>';
print '<h2>' . date('F jS, Y', strtotime($xml->updated)) . '</h2>';

echo '<table>';
foreach ($xml->entry as $entry) {
  $link = str_replace('watch?v=', 'v/', $entry->link[0]['href']);
  echo '<tr><td>';

  echo embed($link) .  '<br />';
  echo "<a href='$entry->link[0]['href']'>{$entry->title}</a>";

  echo "</td></tr>";
}
echo '</table>';
```

**Real brief analysis:** The function `embed()` is used to generate the code to embed the video.  The first step is loading the file with `simplexml_load_file()`.  (Do keep in mind to make sure you can <a href="http://www.php.net/manual/en/filesystem.configuration.php#ini.allow-url-fopen">remotely open a file</a> in `php.ini`).  Next, I generated the title and created a header based on the last time the xml file was updated.  The final step was to create a table and generate a loop to display each embedded video with a link to its source (see usage of the `embed()` function there? yeah....).