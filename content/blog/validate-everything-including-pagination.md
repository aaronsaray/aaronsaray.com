---
title: "Validate Everything Including Pagination"
date: 2025-06-30T17:14:32-05:00
draft: true # don't forget to change date!!
tag:
- laravel
- security
---
There are many reasons why we validate data - whether it's a Laravel project or any other framework or technology. Sometimes it's for user or business sanity, other times to keep the application functioning properly. We even do so for security - for both security attacks we know about and hopefully to stop ones we don't understand.

This is the reason why I reached for validation on pagination requests.  This is user input. Just because I don't understand how it could hurt me doesn't mean I should ignore it, right?

Let's validate pagination - easily - in Laravel.

<!--more-->

The first thing to remember is that I love Laravel Form Requests for validation and authorization. So, we're going to work with Laravel's Form Requests when we validate the Laravel Pagination input.

Laravel defines (by default - but you can change them) two properties for pagination (when you call the `paginate()` or `simplePaginate()` method on a database query).  These are `page` and `per_page` defining the current page and amount of entries per page respectively.

But, what if someone says "I want 10000" - should we allow that? We may not have that in our UI - but it's in the address bar.

I say no. We should have some sane limits around the data we retrieve (do we really need 10k results? Won't that put a load on the server)?  

What if they say "I want page admin" - I have no idea what that will do - but that's certainly not something I want to entertain.  

I have two things I need to validate with rather predictable values. Let's build a form request.

```php
abstract class PaginationRequest extends FormRequest
{
  public function rules(): array
  {
    return [
      'page' => [
        'nullable',
        'integer',
        'min:1',
      ],
      'per_page' => [
        'nullable',
        'integer',
        'between:1,100',
      ],
    ];
  }
}
```

Now, when I have my Widgets controller, I might see a form request like this:

```php
class WidgetsIndexRequest extends PaginationRequest {}
```

I can define additional requirements in this request - or just extend the base PaginationRequest. 

Now, we validate the `page` and `per_page` within semi-sane requirements with a predictable and repeatable pattern. Good.