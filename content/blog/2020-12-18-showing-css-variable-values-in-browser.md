---
title: Seeing Calculated Values of CSS Variables in Browsers
date: 2020-12-18
tags:
- misc-web
- css
---
CSS contains [custom properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties) or variables which make style reuse a breeze. But, when you use the inspector on your favorite browser, you only see a definition of the variable, not the value itself. If you want to see the value of the variable, it just takes an extra step or two in your favorite browser.  Let me show you how.

<!--more-->

In each of these examples, I've brought up the [No Compromises](https://nocompromises.io) website, brought up the inspector, and focused on the body's background color.  The `background-color: var(--light-color);` is what we'll be inspecting.  Other CSS variables are accessed in very similar ways.  All of these examples are generated on MacOS.

### Chrome

With Google Chrome, you can find the variable in the inspector. It will show a preview of the color. If you click the color picker, you can see the exact color.

[![Chrome Animation](/uploads/2020/css-var-chrome.gif)](/uploads/2020/css-var-chrome.gif){: .thumbnail}{: .inline}

### Safari

With Safari, the inspector will show you an option to expand the value. This looks like a small equals sign.  You can click that to see the calculated value.

[![Safari Animation](/uploads/2020/css-var-safari.gif)](/uploads/2020/css-var-safari.gif){: .thumbnail}{: .inline}

### Firefox

With Firefox, the inspector gives you a couple options.  For all variables, they'll become underlined when you hover near them.  Hovering over them shows a tooltip with their calculated value.  You can also click the color itself to expose the color picker if it's a color.

[![Firefox Animation](/uploads/2020/css-var-firefox.gif)](/uploads/2020/css-var-firefox.gif){: .thumbnail}{: .inline}

