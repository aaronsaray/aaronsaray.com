# aaronsaray.com
Source for AaronSaray.com

## Running Jekyll

`bundle exec jekyll $command`

Where `$command` is things like `serve` or `build`.

I've added a `.bash_profile` alias for `jek` to shortcut the above.

## Writing Process

I forget too many things, so I take notes for myself.  Don't lie - you wish you would do the same...

### Create a New Entry

`Blog Write.alfredworkflow` provides the `bw` command which accepts a parameter of a filename for the new draft.  It puts the file
in the `_drafts` folder as a markdown file (specifying `.md` when creating the new file is not required).
The file is git added.  (I version my drafts just in case of a filesystem failure and a back-up failure.)

### Save Progress

When done writing, run `bs` which will blog save - which is basically committing and adding all changed files and pushing them to master.
This is not the same as publishing.  `Blog Save.alfredworkflow` provides this functionality.

### Publish Draft

This moves a file from the drafts folder to the posts folder and it prepends a date onto the filename. 
This sets the published date for the UI and for ordering.  The command is `bp` which will give a list of items from the 
drafts folder.  This functionality is provided by the `Blog Publish Draft.alfredworkflow` file.  This then commits the change
and pushes it to master.  When pushed to master, Github Pages will build the new site.

### Creating New Tag

Because of the way Jekyll on Github Pages works, we can't use the tagging plugins.  So, we have to build our own.  This is done from collections.
In order to create a new tag, run the `bt tag-name` workflow command where `tag-name` is the new tag you wish to add to the system. (This will
create a template for the xml and for the pages).  This is provied by `Blog New Tag.alfredworkflow` file.

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
    
Files should always be code and bold.  For example:

**`filename.php`**

## Plugins

Plugins should be added to `Gemfile` and then run `bundle install`.
