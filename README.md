# aaronsaray.com

Source for [AaronSaray.com](https://aaronsaray.com)

## Blog Writing Instructions

So that I don't forget, here are some notes on how I format / create content.

* Highest level of header is H2 (h1 will be the blog entry headline)

* Use `<!--more-->` to indicate the summary content

* Use the paired tag `{{< header-call-out >}}` when adding content to headers of blog entries to denote some information about the entry but not part of it. It will not show up on the lists.

* To refer to another blog entry, use the `ref` command - like so: `{{< ref "2023-03-01-requirements-documentation-examples-guidelines-rationale" >}}`

* If you have a code block that has a filename, you should use the filename-header shortcode `!file`
```
{{< filename-header "resources/views/users/index.blade.php" >}}
```html
<table>
```

* To link to something with an img thumbnail (like a PDF with an image thumbnail) `!image`
```
{{< link href="/uploads/2023/Acme Corp - Statement of Work.pdf" img="/uploads/2023/statement-of-work-doc-thumbnail.jpg" alt="ACME Corp - Statement of Work PDF" >}}
Statement of Work PDF
{{< /link >}}
```

* To embed an image with the source image as a thumbnail
```
{{< image src="/uploads/2022/no-auto-complete-phpstorm.jpg" alt="No Autocomplete" >}}
```

## Blog Draft Creation Instructions

It is created as an entry with all the tags.

```shell
hugo new content content/blog/my-slug-here.md
```

Remove the tags you don't want. Add `draft: true` in the header if you want it as a draft.