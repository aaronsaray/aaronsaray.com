---
layout: post
title: Don't P When You TD
tags:
- html
---
Despite the "catchy" title, this is one of my pet-peeves: when developers put a `p` tag inside of a `table` like they would use a `<tr><td>` combo.  This is often done when there is a variable amount of values - including zero - listed in a table.

What am I talking about? Things like this:

```html
<table>
  <tr>
    <th>Name</th>
    <th>Email</th>
  </tr>
  <p>There are no results.</p>
</table>
```

or 

```html
<table>
  <p>No results.</p>
</table>
```

or

```html
<ul>
 <p>There are no results.</p>
</ul>
```

or even worse sometimes:

```html
<ul>
 <li class="no-results">There are no results.</li>
</ul>
```

**Please stop creating the listing structure before you know if you have results.**

You'll find this commonly in PHP like this:

```php
<?php
echo "<ul>";
if (empty($results)) {
  echo "<p>There are no results.</p>";
}
else {
  foreach ($results as $result) {
    echo "<li>" . $result . "</li>";
  }
}
echo "</ul>";
```

I've even seen something like this in Vue (which is absolutely [against even the recommendations in the manual](https://vuejs.org/v2/guide/list.html#v-for-with-v-if).)

```js
<ul>
  <li v-for="item in items">
    {{ item }}
   </li>
   <p v-if="!items.length">
    There are none.
  </p>
</ul>
```

This is just sloppy and wrong.  Do not include `p` tags or make some special listing element if your items are empty.  Instead, solve this problem before hand.

For the PHP example, you'd do it like this:

```php
<?php
if (empty($results)) {
  echo "<p>There are no results.</p>";
} else {
  echo "<ul>";
  else {
    foreach ($results as $result) {
      echo "<li>" . $result . "</li>";
    }
  }
}
```

For Vue:

```js
<ul v-if="items.length">
  <li v-for="item in items">
    {{ item }}
   </li>
</ul>
<p v-else>
  There are none.
</p>
```

Simple!  These simple bits of attention to detail are what will elevate you above the standard programmer.  And, it won't bother me if I happen to see the code, either!