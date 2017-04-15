---
layout: post
title: Two Column Background Colors Demo
tags:
- CSS
- html
- Misc Web Design
---

I often run across this problem and I have to solve it each time.  I finally decided to blog about it.

Here is the problem:  We have a two column layout.  We have a fixed width on at least one column.  We also know the width of the container.  We want the two columns to have different background colors (white can be considered a color, the background color, etc).  Finally, we want both columns to fill in completely with background color no matter the lengths of each content (which we do not know, and it alternates.)  

To solve this, I create a container of known dimensions.  Then, I size add a width on the primary column, and a margin on the secondary one.  Add a float, and some background colors, and you're good to go.  Oh, and don't forget your clearfix.  

For this example, I colored each background color different.  In practice, you'll want to make sure that **#container** has the same background color as **#primary**

First, the markup.
    
```html
<body>
    <h1>Hi There Buddy</h1>
    <div id="container">
        <div id="primary">
            I am the primary content.

        </div>
        <div id="secondary">
            I am the secondary content.
        </div>
    </div>
    <h2>Hello There Friend</h2>
</body>
```

Then, the CSS.
    
```css
#container {
    border: 1px solid #000;
    width: 500px;
    background: #acf;
}
#primary {
    background: #f9fcff;
    float: left;
    width: 300px;
}
#secondary:after {
    content: " ";
    display: block;
    clear: both;
    visibility: hidden;
    height: 0
}
#secondary {
    background: #f8b021;
    margin-left: 300px;
}
```

Either column can have any length of interior content.  Try it out!
