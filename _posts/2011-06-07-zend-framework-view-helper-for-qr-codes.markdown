---
layout: post
title: Zend Framework View Helper for QR Codes
tags:
- zend framework
---

Google Charts has a QR code generation service ([here are the details](http://code.google.com/apis/chart/image/docs/gallery/qr_codes.html)).  I decided that I wanted to create my own ZF View Helper to display these on my pages.  This version that I am going to show just returns the properly formatted URL for the charts API.  The view must create the img tag around it.  



#### The Code for Google QR Code


Place the following code in your view helpers location.  For example... **application/views/helpers/GoogleQRCode.php**.

{% highlight PHP %}
<?php
class Zend_View_Helper_GoogleQRCode extends Zend_View_Helper_Abstract
{
    public function googleQRCode($data, $width = 100, $height = 100)
    {
        $url = 'https://chart.googleapis.com/chart?';
        $params = array(
                       'cht'=>'qr',
                       'chs'=>(int)$width . 'x' . (int)$height,
                       'chl'=>$data
                       );
        $url .= http_build_query($params);
        return $url;
    }
}
{% endhighlight %}    



First thing is the function declaration.  It will accept some data to encode.  By default, the width and height are 100px.  This can be overridden with the helper call.  Next, the URL for the Google charts API is defined.  Notice that this version is https - just in case its used on SSL websites.  Next, the parameters to the API are built.  The 'cht' or chart type is 'qr'.  The chart size or 'chs' is the integer width by the integer height.  Finally, the 'chl' value is the data.  Finally, the URL is appended with the value of the results of http_build_query() of the url parameters.  Finally, the URL is returned from the method.

IMPORTANT NOTE: In the spec, it says that the data should be url encoded.  The view helper is not doing that when it creates the parameter array.  This is handled by http_build_query.

To use this in your view, you may have the following code:
**application/views/scripts/index/index.phtml**

    
{% highlight PHP %}
<?php
echo '<h2>Find Me Online</h2>';
echo '<img src="';
echo $this->googleQRCode('http://aaronsaray.com/contact');
echo '">';
{% endhighlight %}    



**Future options:** At some point if I tend to use this more often, I might replace this entire view helper with a more model based application.  The view helper will still call the model, but the model will handle retrieving and caching these QR codes.  If the Google Charts API is not responding, previously generated QR codes will still be available that way!
