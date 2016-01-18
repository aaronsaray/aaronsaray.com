<?php
/**
 * Proof of Concept of PHP Viewer
 *
 * @author Aaron Saray
 */

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
     * Creates an image list by either processing the pdf or retrieving them from the cache
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

ob_start();

$pdfViewer = new PDFViewer();

// NO ACTION means to just show the list
if (!isset($_GET['action'])) {
    $PDFs = $pdfViewer->getPDFList();

    if (empty($PDFs)) {
        echo '<p>There are no PDFs available.</p>';
    } else {
        echo '<p>Choose a file:</p>';
        echo '<ul>';
        foreach ($PDFs as $pdf) {
            $filename = basename($pdf);
            echo "<li><a href='?action=view&file={$filename}'>{$filename}</a></li>";
        }
        echo '</ul>';
    }
}
else if ($_GET['action'] == 'view' && !empty($_GET['file'])) {

    $images = $pdfViewer->getImageList($_GET['file']);
    echo '<p>Viewing file ' . htmlentities($_GET['file']) . '</p>';
    echo '<div class="row"><div class="small-12 medium-8 columns">';
    echo '<div id="pdf">';
    foreach ($images as $image) {
        $url = str_ireplace(__DIR__ . '/', '', $image);
        echo "<img src='{$url}' alt='pdf image'>";
    }
    echo '</div>';
    echo '</div>';
    echo '<div class="small-12 medium-4 columns">';
    echo '<div class="panel callout radius">';
    echo '<h4>Supporting Information</h4>';
    echo '<p>Feel free to have ancillary information here.</p>';
    echo '</div>';
    echo '<div class="panel radius">';
    echo '<h4>More?</h4>';
    echo '<p>You could put more here.</p>';
    echo '</div>';
    echo '</div></div>';

}
else {
    echo '<p>Unfortunately there was an error viewing this.  Check the action, dawg.</p>';
}

$output = ob_get_clean();
?><!doctype html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <title>PDF Viewer</title>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/foundation/5.5.2/css/normalize.min.css">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/foundation/5.5.2/css/foundation.min.css">
        <script src="//ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js"></script>
        <style>
            #pdf {
                position: relative;
                height: 825px;
                border: 1px solid #aaa;
                margin-bottom: 20px;
            }
            #pdf img {
                position: absolute;
                display: none;
            }

        </style>
    </head>
    <body>
        <div class="row">
            <div class="small-12 columns">
                <h1>PDF Viewer</h1>
                <a href="http://aaronsaray.com/blog/2015/05/03/php-pdf-viewer-convert-to-images-and-use-htmljs/">Blog Entry</a>
                <?= $output ?>
            </div>
        </div>
        <script>
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
        </script>
    </body>
</html>
