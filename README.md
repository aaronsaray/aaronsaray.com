# aaronsaray.com
Source for AaronSaray.com

## Writing Standards

I'm either way too anal - or this is just because I forget things. You get to decide!

### Entries

All entries, when using headers, should start with h4 (####) and only go as deep as h5 (#####).

Code will be highlighted using the fluid syntax and highlighter plugin for Jekyll as such:

    {% highlight CSS %}
    Some code here
    {% endhighlight %}
    
Where CSS can be any supported language.  The initial indent of the code should be no spaces.


Images with thumbnails will be embedded like this:

    [![Load Time Analyzer - Test 2](/uploads/2007/test-2-load-time-analyzer.thumbnail.png)](/uploads/2007/test-2-load-time-analyzer.png){: .thumbnail}

The last part is part of kramdown and is required for a class.

Linking internally to blogs will be done with the internal post link system:

    [here]({% post_url 2007-06-24-load-time-analyzer-for-firefox %})
    
    