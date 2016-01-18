---
layout: post
title: jQuery show password toggle
tags:
- javascript
- jquery
---

More and more people are requesting that their passwords not be masked - or that they have the option to toggle them.  If the visitor is using Firefox, this has been a relatively easy feat.  Simply add a checkbox and change the input type on click.  However, in "secure" browsers like IE, yes the security of Internet Explorer, won't allow you to do this.

The solution is simple: Make a dupe of the element but make it from scratch.  Instead of having type password, have type text.  Tie this to a checkbox and you're good to go.  In my solution (which I can't help but feel I've adapted from somewhere... but I can't just remember where the original code idea came from), I automatically find inputs with a specific class, and add a checkbox to show the password.  This way, it doesn't happen to all of them - yet it is still relatively automatic for those that need it.

For testing, I submit this HTML code.  (Note: the CSS for the password box is there so you can verify that the box still looks the same when you change types).


    
{% highlight HTML %}
<html>
    <head>
    <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.4.2/jquery.min.js" type="text/javascript"></script>
    <style type="text/css">
        #password {
            border: 1px solid #f00;
        }
    </style>
    </head>
    <body>
        <input class="showpassword" type="password" name="password" id="password"></input>
    </body>
</html>
{% endhighlight %}
    

Now, the javascript is pretty simple.  Just find the class, grab the input, and add a checkbox after it.  The checkbox will then, once clicked, remove that input and add in the opposite input type.
    
{% highlight javascript %}
$(function(){
    $(".showpassword").each(function(index,input) {
        var $input = $(input);
        $('<label class="showpasswordlabel"></label>').append(
            $("<input type="checkbox" class="showpasswordcheckbox"></input>").click(function() {
                var change = $(this).is(":checked") ? "text" : "password";
                var rep = $("<input type="" + change + ""></input>")
                    .attr("id", $input.attr("id"))
                    .attr("name", $input.attr("name"))
                    .attr('class', $input.attr('class'))
                    .val($input.val())
                    .insertBefore($input);
                $input.remove();
                $input = rep;
             })
        ).append($("<span></span>").text("Show password")).insertAfter($input);
    });
});
{% endhighlight %}
    
