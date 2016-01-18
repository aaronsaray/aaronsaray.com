---
layout: post
title: heredoc - time for dead-dead or happy-smile time?
tags:
- PHP
---

PHP's heredoc - good or bad?  All silly titles aside, lets check out some points.

_For those who are not aware, heredoc is the format of creating a large string in PHP that does not need quotation marks of any kind.  Read more of the points to understand more about it.  Here is an example:_

{% highlight PHP %}
<?php
$sql = <<<sql
SELECT a.*, b.*, c.*
FROM
aTable a,
bTable b,
cTable c
WHERE
a.col = b.col
SQL;
{% endhighlight %}

#### GOOD: No confusing escaping of quotes

With heredoc, you do not need to escape quotes of any kind:

{% highlight PHP %}
<?php
echo "<a href=\"blah.php\" onmouseover=\"hoverer('blah!')\">blah!</a>";
/** becomes ... **/
echo <<<link
<a href="blah.php" onmouseover="hoverer('blah')">blah!</a>
LINK;
{% endhighlight %}

While this is a 'valid' reason, I think this is just justification for sloppy or error prone programmers - but that is just my stubborn - and probably biased - $0.02.

#### BAD: Last line must NOT be indented

In order for the heredoc to recognize the closing marker, it must not be indented.  If it is indented, it won't recognize it as the end of the heredoc - and it continues.  This messes up coding standards that are based on indentation.

{% highlight PHP %}
<?php
function tester()
{
  $thing = TRUE:
  if ($thing) {
    print "indented line";
    print <<<html
    Here is some html content.  notice how the next line isn't indented? that sucks!
HTML;
    print "resumed indentation";
  }
}
{% endhighlight %}

#### GOOD: Some editors recognize it and properly syntax highlight

Some editors are able to recognize the heredoc identifier and properly highlight the content - such as the SQL will be highlighted SQL syntax, same with HTML.

#### BAD: Solid block - so no inline calculations - introduces extra variables

For example, if you have to make an item plural if there is more than 1, with a normal string, you can stop mid creation, do a calculation, and continue on.  With heredoc you either need to make two of them - or you have to use temporary variables.

{% highlight PHP %}
<?php
$trees = 12;
print "I have found {$tree} tree" . ($trees != 1 ? "s" : "") . " in my backyard";

/** as opposed to this **/
$plural = $trees != 1 ? "s" : "";
print <<<blurb
I have found {$tree}{$plural} in my backyard
BLURB;
{% endhighlight %}

#### BAD: Could be used as a crutch for bad MVC programming practices

Generally, when you need to create such a large block of HTML inside of a script (which is one of the main proponent arguments for using heredoc), you may be doing too much HTML generation inside of a logic script.  This should be refactored to support a better MVC approach - like putting more of that into a view.  (thanks to BigBoy for this point!)

Just like my other 2 pennies I offered, I think this is not the best example / reason.  Programmers could still do the same thing by just creating normal strings - no heredoc required.

#### So - time for dead-dead or happy-smile time?

So far, it looks like its more of a personal preference thing on heredoc.  There are no concrete reasons either for or against it that make it something you should love or hate.  And, I know everyone was waiting to know - so I'll say it: my opinion is that heredoc could be removed from PHP6 and I wouldn't miss it at all ;)