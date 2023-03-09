---
title: Host PHPUnit Code Coverage Image in Your Repo
date: 2020-12-15
tag:
- php
- testing
- git
---
I'm a sucker for those little badges at the top of the README files in Github repos. I know you can get them from external services, but could I host my own? Let's find out.

<!--more-->

**tldr;** You can host your PHPUnit code coverage as an image in your Github repo using Github actions.  You can see my example repository [here](https://github.com/aaronsaray/php-test-coverage-image-from-gh-actions).  
It looks a little like this: ![Preview](https://raw.githubusercontent.com/aaronsaray/php-test-coverage-image-from-gh-actions/main/docs/code-coverage.png)

I'll discuss how and what's happening below.

## What We're Going to Do

I've written some PHP that I'm going to run PHPUnit tests against.  The result of that are going to be parsed and put into an image. That image will be committed back to our branch. This will then be loaded by our README file to display the code coverage percentage in image form.  Let's begin by setting up some PHP.

## PHP Source

I've installed PHPUnit with Composer into my project.  I have a filesystem like this:

```txt
.github/
  workflows/
    ci.yml
docs/
src/
  Decorator.php
  Other.php
  Utility.php
tests/
  Unit/
    DecoratorTest.php
    OtherTest.php
generate-code-coverage-image.php
phpunit.xml
```

The `DecoratorTest` is configured in such a way that it covers 100% of the `Decorator` class.  The `OtherTest` will cover about 50% of the `Other` class.  The `Utility` class has no tests, so 0% coverage.

## Github Action

Now, we build out a Github action to run our PHPUnit, to write coverage, to call a PHP script to build the image, and to commit it to our branch.

{{< filename-header ".github/workflows/ci.yml" >}}
```yaml
name: CI for Project

on:
  push:
    branches:
      - main

jobs:
  phpunit:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v2

      - name: Install PHP Dependencies
        run: "composer install --no-ansi --no-interaction --no-scripts --no-suggest --prefer-dist"

      - name: Execute PHPUnit
        run: vendor/bin/phpunit --coverage-clover=coverage.xml

      - name: Generate code coverage image
        run: php generate-code-coverage-image.php

      - name: Commit Code Coverage Image to Repo
        uses: EndBug/add-and-commit@v5
        with:
          author_name: Aaron Saray
          author_email: me@aaronsaray.com
          message: "Committing code coverage image"
          add: "docs/code-coverage.png"
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

You may have more steps in your Github action (like caching), but these are the important parts.  Let's dissect.

First, handle this "CI for Project" jobs on push of the main branch.  Only one job will run on the latest Ubuntu image called `phpunit`.  

Next the code is checked out and any composer dependencies are installed.

Then, the PHPUnit tests are written with Clover coverage being written to the `coverage.xml` file.  This file will be available during the duration of this job only. (It is not committed and its not available for other concurrent jobs.)

Next, have PHP run our custom PHP application which reads in the coverage and writes a new image to the `docs/code-coverage.png` location using GD.

Finally, use a Github action to stage and commit the code coverage file back to the repo.

## PHP Code for Image Generation

This code is pretty simple.  Let's take a look:

{{< filename-header "generate-code-coverage-image.php" >}}
```php
<?php

$xml = simplexml_load_file('coverage.xml');

$coveredStatements = $xml->project->metrics['coveredstatements'];
$totalStatements = $xml->project->metrics['statements'];
$percentage = round(min(1, $coveredStatements / $totalStatements) * 100);
$percentageString = $percentage . '%';
$imageHeight = 20;
$imageWidth = 160;
$xMargin = 5;
$font = 3;

$image = imagecreate($imageWidth, $imageHeight);

$backgroundColor = imagecolorallocate($image, 0, 20, 0);
$foregroundColor = imagecolorallocate($image, 0, 245, 0);
$borderColor = imagecolorallocate($image, 0, 190, 0);

imagerectangle($image, 0, 0, $imageWidth - 1, $imageHeight - 1, $borderColor);

imagestring($image, $font, $xMargin, 3, 'PHPUnit Coverage:', $foregroundColor);

$width = imagefontwidth($font) * strlen($percentageString);
imagestring($image, $font,$imageWidth - $xMargin - $width, 3, $percentageString, $foregroundColor);

imagepng($image, 'docs/code-coverage.png');

imagedestroy($image);
```

First, we'll use SimpleXML in PHP to read in the code coverage and get the root level metrics.  Dividing the covered statements over all the statements gives us a percentage coverage.  Then, some other values are defined to make the code easier to read.

Next, an image is created and colors are allocated.  A border is drawn with a rectangle and the first part of the label for coverage is written.

Then, we figure out how wide the next text will be (its either 1, 2 or 3 digits plus a percentage sign).  With that we can subtract that width from the right (plus margin) and basically give us a right-aligned percentage value.  Where 100% will fill the entire area, something like 6% will be right aligned.

Finally the image is written to the filesystem (remember, this is committed during the Github action).  Then its destroyed from memory.

## README.md

The readme now can just link to the location you've committed the file to.

{{< filename-header "README.md" >}}
```markdown
# Your Project

![Code Coverage Image](docs/code-coverage.png)
```

Now you're good to go! You have a self-hosted image-based code coverage badge.  (Just remember now, since you're committing whenever you push, you're going to have to pull the update and fast-forward your local branch after each successful Github Actions run.)

You can see an example of this on my Github repo here: [aaronsaray/php-test-coverage-image-from-gh-actions](https://github.com/aaronsaray/php-test-coverage-image-from-gh-actions)

## Final Thoughts

I think you can take this further and make your own Github action. Perhaps you'll have to build the images with a Node script instead, but that's OK.  Another idea that was shared with me by [Joel](https://joelclermont.com) was creating the image and uploading it to a CDN based on git hash. I think there's something there, but I'm not sure it'd be that easy.  The beauty of this method is that the file is always in the same place so the README doesn't have to be updated. But, I could be wrong.

Either way, I'm still in favor of third-party services to provide us some nice badges - but you don't have to rely on them.