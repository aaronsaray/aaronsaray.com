---
title: Tweeting Blogs with Hashtags Automatically with IFTTT Pro
date: 2020-11-10
tag:
- javascript
- twitter
---
I've been trying to balance automation with interaction with my social media broadcasting. I want to automatically tweet new blog entries, yet I want to target hashtag trends. Luckily IFTTT Pro has launched and can help us do this.

<!--more-->

If you're not familiar with IFTTT Pro, you have to [check it out](https://ifttt.com/pro) - the regular IFTTT but with more features and scripting.  My idea was simple: use the existing applet I have to automatically tweet my blog entries but add hashtags. I could do that with the javascript that is now available with IFTTT Pro.

### The Javascript

First, let's look at the javascript.  This is going to be a contrived example, though:

```javascript
let incoming = 'There were three fish that swam afish in the Pond. The day was better than great. I have pondered';

const hashtags = [
  'fish',
  'pond',
  'pondering',
  'pondered',
  'great',
  'bet',
];

hashtags.forEach(h => {
  const regEx = '\\b(' + h + ')\\b';
  incoming = incoming.replace(new RegExp(regEx, 'gi'), '#$1');
});

console.log(incoming);
```

The `incoming` variable holds what my tweet might be - or the incoming blog entry title.  Then, I create a variable of hashtag terms that I'd like to target.  This would be ones that really resonate with your audience.  The next section puts the `#` in front of any of the words that matter.  Finally, we look at the result with `console.log` - which is: 

```
There were three #fish that swam afish in the #Pond. The day was better than #great. I have #pondered
```

Why did I pick this phrase and words? Let me explain.  First, `fish` makes sure it matches the word `fish` but not  matches when that word is in the middle of a word, like `afish`.  `pond` is used to make sure that we match `Pond` but don't change it's case.  We also include `pondering` and `pondered` to make sure that `pondering` never is matched, and that that's ok.  `pondered` makes sure that we match words at the end when there are no more words left.  Finally `great` is used to make sure we match - even when there is punctuation - and `bet` is used to make sure we don't expand into a word that isn't fully that word - like `better`.

Now, let's apply this to our blog tweeting applet on IFTTT.

### IFTTT Pro

Begin by creating your own applet.

[![Instructional image](/uploads/2020/ifttt-hashtag-tweet-1.png)](/uploads/2020/ifttt-hashtag-tweet-1.png){: .thumbnail}{: .inline}

Search `RSS` to find the RSS posting action.

[![Instructional image](/uploads/2020/ifttt-hashtag-tweet-2.png)](/uploads/2020/ifttt-hashtag-tweet-2.png){: .thumbnail}{: .inline}

Choose New feed item.

[![Instructional image](/uploads/2020/ifttt-hashtag-tweet-3.png)](/uploads/2020/ifttt-hashtag-tweet-3.png){: .thumbnail}{: .inline}

And fill in your RSS feed url.

[![Instructional image](/uploads/2020/ifttt-hashtag-tweet-4.png)](/uploads/2020/ifttt-hashtag-tweet-4.png){: .thumbnail}{: .inline}

After you create create trigger, you'll have the option to add your action. You have to add your action before you can get the helpful hints on javascript objects to filter your tweet. So, don't click the `+` and instead click `Then That`

[![Instructional image](/uploads/2020/ifttt-hashtag-tweet-5.png)](/uploads/2020/ifttt-hashtag-tweet-5.png){: .thumbnail}{: .inline}

Search for Twitter and choose that service.

[![Instructional image](/uploads/2020/ifttt-hashtag-tweet-6.png)](/uploads/2020/ifttt-hashtag-tweet-6.png){: .thumbnail}{: .inline}

Then, choose to post a tweet.

[![Instructional image](/uploads/2020/ifttt-hashtag-tweet-7.png)](/uploads/2020/ifttt-hashtag-tweet-7.png){: .thumbnail}{: .inline}

You can just leave whatever is in there right now.  We'll be replacing this anyway later.

[![Instructional image](/uploads/2020/ifttt-hashtag-tweet-8.png)](/uploads/2020/ifttt-hashtag-tweet-8.png){: .thumbnail}{: .inline}

Create the action. Now you can click the `+` between the `If` and `Then`.

[![Instructional image](/uploads/2020/ifttt-hashtag-tweet-9.png)](/uploads/2020/ifttt-hashtag-tweet-9.png){: .thumbnail}{: .inline}

Choose `Add filter`

[![Instructional image](/uploads/2020/ifttt-hashtag-tweet-10.png)](/uploads/2020/ifttt-hashtag-tweet-10.png){: .thumbnail}{: .inline}

Here's where we can fill in our javascript from above.

[![Instructional image](/uploads/2020/ifttt-hashtag-tweet-11.png)](/uploads/2020/ifttt-hashtag-tweet-11.png){: .thumbnail}{: .inline}

But with some edits:

```javascript
let incoming = Feed.newFeedItem.EntryTitle;

const hashtags = [
  'fish',
  'pond',
  'pondering',
  'pondered',
  'great',
  'bet',
];

hashtags.forEach(h => {
  const regEx = '\\b(' + h + ')\\b';
  incoming = incoming.replace(new RegExp(regEx, 'gi'), '#$1');
});

Twitter.postNewTweet.setTweet(incoming + ' ' + Feed.newFeedItem.EntryUrl);
```

[![Instructional image](/uploads/2020/ifttt-hashtag-tweet-12.png)](/uploads/2020/ifttt-hashtag-tweet-12.png){: .thumbnail}{: .inline}

You'll notice we can't replace the Entry Title. We can only set a new tweet. So, we do our replacement and then add back in our `incoming` which was the modified title.  We need to make sure to add the URL back, though, as when we call `setTweet` we're starting from a plain blank slate.

Then, you can accept these changes. You're almost done. It will generate a name for you, but I edited mine to be just a bit easier to read:

[![Instructional image](/uploads/2020/ifttt-hashtag-tweet-13.png)](/uploads/2020/ifttt-hashtag-tweet-13.png){: .thumbnail}{: .inline}

### End Notes

Now, with this enabled, your blog entries will automatically tweet out a title and URL. But, with your chosen hashtags, you will now add hashtags to your tweets, but not require to have them on your blogs themselves. Awesome!