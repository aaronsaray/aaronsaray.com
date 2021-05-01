---
layout: page
title: Tags for Aaron Saray's Blog 
header: Tags for the Blog
permalink: /tag/
meta_description: Tags for Aaron Saray's Blog.
---
Click through to read blog entries about various topics from the tags page.

{% capture tags %}
  {% for tag in site.tags %}
    {{ tag[1].size | plus: -10000 }}###{{ tag[0] | replace: ' ', '##' }}###{{ tag[1].size }}
  {% endfor %}
{% endcapture %}

<div class="tag-cloud">
{% assign sorted_tags = tags | split: ' ' | sort -%}
{%- for sorted_tag in sorted_tags -%}
  {%- assign items = sorted_tag | split: '###' -%}
  {%- assign tag = items[1] | replace: '##', ' ' -%}
  {%- assign count = items[2] | plus: 0 -%}
  {%- assign size = 100 | plus: count -%}
  <div style="font-size: {{ size }}%"><a href="/tag/{{ tag | slugify }}">{{ tag }}</a> <span>({{ count }})</span></div> 
{%- endfor -%}
</div>