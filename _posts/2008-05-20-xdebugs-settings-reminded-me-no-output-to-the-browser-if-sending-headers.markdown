---
layout: post
title: XDebug's settings reminded me - no output to the browser if sending headers
tags:
- PHP
---
So, I admit it - I've become lazy.  Well, in all fairness, the programmer before me at "the triangle" was also lazy.  And after messing with XDebug and setting `output_buffering` to off and implicit flush to on... I was reminded of our laziness.

Because of these changes, some of the spaces that we had in our code are now sending output directly to the browser (even though we have an output handler...).  For example, this is bad code:

    /** and some more fun here**/
    ?>
     
    <?php
    /** start second block of code **/

I know it is bad – you know it is bad... *sigh*. But because of this, I'm not able to use Xdebug's debugging feature on my ‘triangle' code. I'd have to put through a project to REMOVE SPACES. Hah.