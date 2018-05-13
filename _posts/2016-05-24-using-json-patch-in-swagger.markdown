---
layout: post
title: Using JSON Patch in Swagger
tags:
- misc-web
---
I've been working with [Swagger](https://swagger.io), also known as the [OpenAPI Initiative](https://openapis.org/) lately,
and I've come to the issue of issuing an update to an object.  I'm planning on using the HTTP verb PATCH (yes it is [a standard](https://tools.ietf.org/html/rfc5789) in case you forgot... like I did).

Now, the biggest challenge was how to define a patch payload.  

**A little background**

First, it's important to know that I'm creating a JSON-only API, so this makes my choice much easier.  The server back-end
is a .NET application (which is useful to know if I'm looking for pre-built libraries to help the server handle the patches).

**Choices**

There are two choices, as I see them, [JSON Patch](http://jsonpatch.com/) and [JSON Merge Patch](https://tools.ietf.org/html/rfc7386).  Yup, they sound similar, but they are different.
Now, let's save you some boring story about choosing between these, and just say I went with JSON Merge Patch.  However, 
that wasn't before I made a complete spec in the swagger YAML I was working with.  I thought I'd share that just in case
someone was looking to go the direction of JSON Patch themselves.

```yaml
paths:
  /users/{GUID}:
    patch:
      summary: Update a user
      parameters:
        - name: GUID
          in: path
          required: true
          type: string
          format: GUID
          description: The GUID of a specific user 
        - name: JsonPatch
          in: body
          required: true
          schema:
            $ref: "#/definitions/PatchRequest"
      responses:
        '200':
          description: Successful response
          schema:
            $ref: "#/definitions/User"
definitions:
  PatchRequest:
    type: array
    items:
      $ref: "#/definitions/PatchDocument"
  PatchDocument: 
    description: A JSONPatch document as defined by RFC 6902 
    required:
     - "op"
     - "path"
    properties: 
     op: 
      type: string 
      description: The operation to be performed 
      enum:
       - "add"
       - "remove"
       - "replace"
       - "move"
       - "copy"
       - "test"
     path: 
      type: string 
      description: A JSON-Pointer 
     value: 
      type: object 
      description: The value to be used within the operations.
     from: 
      type: string 
      description: A string containing a JSON Pointer value.
```

As you can probably tell, this isn't a complete spec, but it covers the area that we're interested in (you'll notice it doesn't define the User
object, but that's fine for this demonstration.)  

For the patch method for /users/{GUID}, there are two parameters - the GUID, which is the identifier - and the body parameter.
(Remember, there can only be one body parameter, and the name is only for documentation, that is "looks").  Here it refers to the PatchRequest definition.

The PatchRequest definition defines the "envelope" of the JSON Patch request - which is basically saying "there is a specific format for each
element in the following array."

The PatchDocument is where this gets interesting.  It defines the required `op` and `path` properties, enumerates the op type, and
then puts the optional `value` and `from` properties as well.  

So, if you're looking to use JSON Patch in swagger, you can use that document.  Like I mentioned above, I ended up going with 
JSON Merge Patch (because my objects are rather simple), but in a more complex scenario, I'd go with this.