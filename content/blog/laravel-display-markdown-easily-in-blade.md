---
title: "Laravel Display Markdown Easily in Blade"
date: 2024-09-02T10:48:27-05:00
tag:
- laravel
params:
  context: 
  - Laravel 11
---
I love writing in Markdown - and offering that functionality in WYSIWYG editors for our users. But, it just seems so complicated to try to show markdown in Laravel blade files. So, I made a quick anonymous component that makes this easier.

<!--more-->

Most of what we need is already built-in to Laravel.  So, let's make our `<x-markdown>` component.  We just need to make the blade file - no class is needed.

{{< filename-header "resources/views/components/markdown.blade.php" >}}
```html
<section {{ $attributes }}>
  {{ Str::of($slot)->markdown()->toHtmlString() }}
</section>
```

This works because of the amazing `markdown()` helper on the `Str` utility.  When you call `toHtmlString()` it returns an `HtmlString` object that blade knows how to handle. Also, we pass in any attributes you've specified on the component transparently. 

To use this yourself, do the following in your blade file:

```markdown
<x-markdown>
# Welcome!

This is some *markdown* text.
</x-markdown>
```

Pretty simple.  

There are some caveats though.  First, if you indent anything four spaces inside of the markdown component (perhaps you're trying to nest it in your blade) it will recognize those spaces and process them as Markdown. This means it'll make the content pre-formatted.

Second, the security and strictness of the markdown content is handled with Laravel's markdown configuration. This is using the `GithubFlavoredMarkdownConverter` from `league/commonmark`.  You may want to investigate this set up and make sure it's using the features you want and has been securely configured based on the type of content you intend to publish (your own markdown or user's markdown).
