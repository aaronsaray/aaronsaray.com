---
title: How to Disable the 1Password Popup
date: 2024-11-15
tag:
- ux
---
I can never seem to find or remember how to disable each of the 1Password popup options. Hopefully this helps!

<!--more-->

Want to disable the 1Password auto popup window?  Turn off autocomplete.

`<input autocomplete="off"...`

But, sometimes the 1Password icon still appears in the input box. Drat. How do we turn that off?

Simple! A custom data attribute that they added to their extension.

`<input data-1p-ignore...`

Now the icon won't appear automatically either.

Keep in mind, if your form has password fields, this functionality may not work.