---
layout: post
title: Setting PHP Command Line Colors
tags:
- PHP
---
I'm not entirely certain why this escaped me for so long, but it's remarkably easy to set terminal colors with PHP.  Simply echo the escape/color character `\033`, followed by the bash color definition and your output.  For reference, [here](https://wiki.archlinux.org/index.php/Color_Bash_Prompt) is a listing of bash colors.  So, for example, if we want to make something blue text, do the following:

```php?start_inline=1
echo "\033[34m" . 'here is blue text' . "\033[0m\n";
```

This simply sets the blue color, adds the blue text, and then resets the color to default, and makes a new line.
