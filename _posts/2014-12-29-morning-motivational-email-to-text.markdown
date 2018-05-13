---
layout: post
title: Morning Motivational Email to Text
tags:
- php
---
So I'm going to try this new thing - watch a motivational quick movie in the morning via youtube.  I made a playlist of videos and have put the following code in cron for 5:30 every morning.  It will send an email (which is actually email to txt on my phone) with a link to open the youtube player on my phone with a random item from my playlist.  Hope you find it useful!

```php?start_inline=1
/**
 * Get Random Video From Youtube Playlist and Email it
 *
 * This file is set in a cron for every morning.  I set it up to point to 
 * a playlist of motivational videos for myself
 */
 
namespace AaronSaray;
 
/**
 * Get Random Video
 */
class YoutubeVideoSender
{
  /**
   * @const string the gdata url to replace with sprintf playlist ID
   */
  const GDATA_URL = 'http://gdata.youtube.com/feeds/api/playlists/%s/?v=2&alt=json&feature=plcp';
 
  /**
   * @const string the playable URL using sprintf for the ID
   */
  const PLAY_URL = 'https://youtube.com/v/%s';
 
  /**
   * @var Object
   */
  protected $sender;
 
  /**
   * @var string the playlist ID
   */
  protected $playlistID = '';
 
  /**
   * @param $sender the sending class
   * @param $playlistID string the playlist id
   */
  public function __construct($sender, $playlistID)
  {
    $this->sender = $sender;
    $this->playlistID = $playlistID;
  }

  /**
   * Sends the random video using the sender
   */
  public function sendRandomVideo()
  {
    $jsonObject = $this->getJson();
    $videoID = $this->getRandomIDFromObject($jsonObject);
    $url = sprintf(self::PLAY_URL, $videoID);
    $this->sender->sendUrl($url);
  }

  /**
   * Retrieves the json
   * @return object the json object
   * @throws \Exception If the URL can't be retreived
   */
  protected function getJson()
  {
    $content = file_get_contents(sprintf(self::GDATA_URL, $this->playlistID));
    if (!$content) {
      throw new \Exception("The URL was not able to be retreived.");
    }

    return json_decode($content);
  }

  /**
   * Get the random ID From the object
   *
   * @param $jsonObject object the json object
   * @return string the random ID
   * @throws \Exception When there are no entries
   */
  protected function getRandomIDFromObject($jsonObject)
  {
    if (!count($jsonObject->feed->entry)) {
      throw new \Exception('There is nothing in the list');
    }

    $tempArray = array();

    foreach ($jsonObject->feed->entry as $item) {
      $tempArray[] = $item->{'media$group'}->{'yt$videoid'}->{'$t'};
    }

    return $tempArray[array_rand($tempArray)];
  }
}

/**
 * Class Sender
 *
 * This sends the URL
 */
class Sender
{
  /**
   * @var string the email address to send this to
   */
  protected $email;

  /**
   * @var string the optional message where sprintf will replace the first %s with the url
   */
  protected $message = '';

  /**
   * @var string the sender of this message
   */
  protected $from = '';

  /**
   * build the sender - optionally specify a message
   *
   * @param $email
   * @param string $message
   */
  public function __construct($email, $message = '', $from = '')
  {
    $this->email = $email;
    $this->message = $message;
    $this->from = $from;
  }

  /**
   * Send the message with a replacement
   *
   * @param $url string
   */
  public function sendUrl($url)
  {
    $messageToSend = $this->prepareMessage($url);
    $extraHeaders = '';
    if ($this->from) $extraHeaders .= 'From: ' . $this->from;
    mail($this->email, '', $messageToSend, $extraHeaders);
  }

  /**
   * Builds the message
   *
   * @param $url the video url
   * @return string the prepared message
   */
  protected function prepareMessage($url)
  {
    if ($this->message) {
      return sprintf($this->message, $url);
    }
    else {
      return $url;
    }
  }
}

$youtube = new YoutubeVideoSender(
  new Sender(
    'email@address.com', 
    'Here is your morning motivation: %s', 
    'Motivation <motivation@your-email.com>'
  ),
  'YOUR-PLAYLIST-ID-HERE'
);

$youtube->sendRandomVideo();
```
