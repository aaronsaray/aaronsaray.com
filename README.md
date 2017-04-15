# aaronsaray.com
Source for AaronSaray.com

## Writing Standards

I'm either way too anal - or this is just because I forget things. You get to decide!

### Entries

All entries, when using headers, should start with h3 (###) and only go as deep as h4 (####).

When referring to a filename for a code sample, put it above the code sample, use inline code 
syntax and make it bold.  For example:

    **`test.html`**
    ```html
    <h1>hi!
    ```

Code will be highlighted using the markdown indication and highlighter plugin for Jekyll as such:

    ```css
    Some code here
    ```
    
Where CSS can be any supported language.  The initial indent of the code should be no spaces.

Code should be indented with only two spaces, and should make every effort not cause the 
code block to need to scroll at largest allowed viewing.

Code files that refer to the entire file should begin with that language's first tag.
Others may make use of `start_inline=1`

So if a PHP file is the entire file, it should have `<?php` to begin.  If it's
an excerpt, the definition should use `start_inline=1`.

Images with thumbnails will be embedded like this:

    [![Load Time Analyzer - Test 2](/uploads/2007/test-2-load-time-analyzer.thumbnail.png)](/uploads/2007/test-2-load-time-analyzer.png){: .thumbnail}

The last part is part of kramdown and is required for a class.

Linking internally to blogs will be done with the internal post link system:

    [here]({% post_url 2007-06-24-load-time-analyzer-for-firefox %})
    
    