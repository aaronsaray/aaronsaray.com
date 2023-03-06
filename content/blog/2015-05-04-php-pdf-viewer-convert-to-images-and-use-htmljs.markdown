---
title: PHP PDF Viewer - Convert to Images and use HTML/JS
date: 2015-05-04
tags:
- javascript
- jquery
- php
---
Well - I really couldn't think of a good title - it's really not catchy at all.

<!--more-->

Anyway... at my last job, we were contemplating making a PDF reading solution that would easily scale, work on multiple devices, and allow advertisements along side of them.  I left before we began this project, but it hasn't ever left my mind.

I decided to do a quick proof of concept.  Turns out Imagick with PHP will convert PDF to jpeg really quick and easy.  So, I wrote the following PHP class to work with this.

```php
namespace AaronSaray;

class PDFViewer
{
  /**
   * @const string the location of the PDF files in relation to this class
   */
  const PDF_DIR = '/pdf';

  /**
   * @const string the cache location
   */
  const CACHE_DIR = '/pdf/cache';

  /**
   * Get the PDF files
   * @return array
   */
  public function getPDFList()
  {
    return glob(__DIR__ . self::PDF_DIR . '/*.pdf');
  }

  /**
   * Creates an image list by either processing the pdf or 
   * retrieving them from the cache
   *
   * @param $filename
   * @return array
   * @throws \Exception
   */
  public function getImageList($filename)
  {
    $filePath = __DIR__ . self::PDF_DIR . "/{$filename}";
    if (!is_readable($filePath)) {
      throw new \Exception($filePath . ' was not readable.');
    }

    $dirName = substr(basename($filePath), 0, -4);
    $cacheLocation = __DIR__ . self::CACHE_DIR . "/{$dirName}";
    $globPattern = $cacheLocation . '/*.jpg';

    $files = glob($globPattern);
    if (empty($files)) {
      $this->processFileToImageCache($filePath, $cacheLocation);
      $files = glob($globPattern);
    }

    return $files;
  }

  /**
   * Write a rendered PDF to the cache.
   *
   * @param $filePath
   * @param $cacheLocation
   */
  protected function processFileToImageCache($filePath, $cacheLocation)
  {
    if (!is_dir($cacheLocation)) mkdir($cacheLocation);

    $imagick = new \Imagick();
    $imagick->setResolution(150,150);
    $imagick->readImage($filePath);
    $imagick->writeImages($cacheLocation . '/rendered.jpg', true);
  }
}
```

Simply put, you'll call one function to get a list of PDFs - and then you can feed a PDF to the other function to make it write it to the cache - or read it from the cache.

Finally, add in a little jQuery:

```javascript
$(function() {
  $('#pdf img:first-child').show();
  $('#pdf').on('click', function() {
    var visibleImage = $('img:visible', $(this));
    var nextImage = visibleImage.next();
    if (nextImage.length == 0) {
      nextImage = $(visibleImage.siblings()[0]);
    }
    visibleImage.fadeOut();
    nextImage.fadeIn();
  })
});
```

This simply will skip through the images one by one on click - and restart from the beginning.  Not particularly pretty, but it's just a proof of concept.
