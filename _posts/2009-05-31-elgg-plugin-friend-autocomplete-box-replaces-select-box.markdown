---
layout: post
title: 'Elgg Plugin: Friend AutoComplete Box Replaces Select Box'
tags:
- elgg
- PHP
---
One of the most irritating things to me about the Elgg messaging plugin is the requirement to choose my friends from the select box.  This SHOULD be generated using the input/pulldown view in Elgg.  Unfortunately, they are doing it by hand.  However, I've patched my plugin to do it using the proper view.  Then, I wanted to have an Auto Complete type box to choose a friend.  With JQuery I was able to do this.  Check out the specs and download below:

### What This Plugin Solves:

This plugin extends the input/pulldown view in Elgg to create an Autocomplete box instead (theoretically, this could be used for any pulldown, not just friends).

### How do I use it?

Imagine you have a view in Elgg that uses the following code:

```php?start_inline=1    
$friends = amazing_function_formats_this($_SESSION['user']->getFriends());
echo elgg_view('input/pulldown', array('name'=>'friends', 'options_values'=>$friends);
```

This generates a pull down that will have the option text the friend name, and the option value - the friend GUID.

To use this plugin, enable it - and then modify the elgg_view statement like so:

```php?start_inline=1    
$friends = amazing_function_formats_this($_SESSION['user']->getFriends());
echo elgg_view('input/pulldown', array('class'=>'OHT_ElggFriendsAutocomplete', 'name'=>'friends', 'options_values'=>$friends);
```

### What Happens?

The plugin automatically hides the select box and displays the autocomplete input field using all of the select box options as values to suggest.  Then, when a proper option is selected, the hidden select box value gets updated to the value correlated to the text that was typed.  Pretty simple and unobtrusive!

### Do I Have to Do Anything Different?

Just add the class to the pulldown - and you should be good to go.

### Ok Let Me Download It!

OK here: [Elgg Friends AutoComplete](/uploads/2009/oht_elggfriendsautocomplete.zip)
