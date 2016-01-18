/**
 * set up namespace
 */
var photoBooth = photoBooth || {};

/**
 * static function to show warning
 */
photoBooth.showBrowserWarning = function() {
	document.getElementById('browserRequired').style.display='block';
}

/**
 * static function to remove the reminder
 */
photoBooth.hidePermissionReminder = function() {
	document.body.className = "";
}

/**
 * Constructor
 * This handles the manipulation of the current video stream
 */
photoBooth.videoStream = function() {

	/**
	 * Start the capture
	 * Also checks to make sure required features are available
	 * returns whether we can continue or not
	 */
	this.initCam = function() {
		navigator.getUserMedia  = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
		window.URL = window.URL || window.webkitURL;

		if (!navigator.getUserMedia) {
			photoBooth.showBrowserWarning();
			return false;
		}

		// good to continue

		/**
		 * Do the initial capture to just wake us up
		 */
		navigator.getUserMedia({video: true}, function(videoStream) {
			photoBooth.hidePermissionReminder();
			_initializeStream(videoStream);
			_initializeFilters();
			_initializeScreenshot(videoStream);

		}, photoBooth.showBrowserWarning);

		return true;
	};

	/**
	 * defines the video element
	 */
	var _video;

	/**
	 * defines the canvas element
	 */
	var _canvas;

	/**
	 * define the canvas context
	 */
	var _canvasContext;

	/**
	 * The input box for filename on screenshot download
	 */
	var _filenameInput;

	/**
	 * Used to download images
	 */
	var _downloadButton;

	/**
	 * defined to be used as a constant for toggle function
	 */
	var _TYPE_SHOW = 1;

	/**
 	 * defined to be used as a constant for toggle function
	 */
	var _TYPE_HIDE = 0;

	/**
	 * Starts the stream because we have permission
	 * @private
	 */
	var _initializeStream = function(videoStream) {
		_video = document.getElementById('video');
		_video.src = window.URL.createObjectURL(videoStream);
	};

	/**
	 * This is used to address the handlers for applying filters to the video stream
	 * @private
	 */
	var _initializeFilters = function() {
		var filters = {
			filternone: "",
			filtersepia: "sepia(100%)",
			filtergrayscale: "grayscale(100%)",
			filterinvert: "invert(1)",
			filterhue: "hue-rotate(90deg)",
			filteropb: "hue-rotate(140deg) saturate(4) brightness(1.2) contrast(2)"
		};

		var elements = document.querySelectorAll('#videofilters input[type="radio"]');

		for (var e = 0; e < elements.length; e++) {
			elements.item(e).addEventListener('change', function() {
				_video.style.webkitFilter = filters[this.id];
			}, false);
		}
	};

	/**
	 * Initialize the screenshot handler
	 * @private
	 */
	var _initializeScreenshot = function(videoStream) {
		_canvas = document.querySelector('canvas');
		_canvasContext = _canvas.getContext('2d');

		document.getElementById('vidcontainer').addEventListener('click', function() {
			_launchScreenshotEditor();
		});

		_downloadButton = document.querySelector('#screenshot button');
		_filenameInput = document.getElementById('imageName');

		_downloadButton.addEventListener('click', _downloadImage);

		document.getElementById('closeScreenshot').addEventListener('click', function(event) {
			_downloadButton.className = '';
			_filenameInput.value = '';
			_toggleScreenshotModal(_TYPE_HIDE);
			event.preventDefault();
		});

		var decorations = document.querySelectorAll('#screenshotdecorations img');
		[].forEach.call(decorations, function(decoration) {
			decoration.addEventListener('mouseover', function(e) {
				e.target.addEventListener('mousewheel', _resizeDecoration);
			});
			decoration.addEventListener('mouseleave', function(e) {
				e.target.removeEventListener('mousewheel', _resizeDecoration);
			});

			decoration.addEventListener('dragstart', function(e) {
				var style = window.getComputedStyle(e.target, null);
				e.dataTransfer.effectAllowed = 'move';
				//track id, and drag offset and layer offset
				var dataString = this.id + ',' + (parseInt(style.getPropertyValue('left')) - e.clientX) + ','
							   + (parseInt(style.getPropertyValue('top')) - e.clientY + ',' + e.layerX + ',' + e.layerY);
				e.dataTransfer.setData('text', dataString);
			});
		});

		_canvas.addEventListener('dragover', function(e) {
			if (e.preventDefault) e.preventDefault();
			e.dataTransfer.dropEffect = 'move';
			return false;
		});
		_canvas.addEventListener('drop', function(e) {
			if (e.stopPropagation) e.stopPropagation();
			var parts = e.dataTransfer.getData('text').split(',');
			var element = document.getElementById(parts[0]);
			element.style.left = (e.clientX + parseInt(parts[1])) + 'px';
			element.style.top = (e.clientY + parseInt(parts[2])) + 'px';
			element.className = 'moved';

			//find the part where it is on the canvas ** still missing something here
			element.setAttribute('data-location-x', (e.offsetX -  parseInt(parts[3])));
			element.setAttribute('data-location-y', (e.offsetY - parseInt(parts[4])));
		});
	};

	/**
	 * Used to launch the screenshot editor and bring modal back
	 * @private
	 */
	var _launchScreenshotEditor = function() {
		_canvas.width = _video.videoWidth;
		_canvas.height = _video.videoHeight;
		_canvasContext.drawImage(_video, 0, 0);
		_canvas.style.webkitFilter = _video.style.webkitFilter;
		_toggleScreenshotModal(_TYPE_SHOW);
	};

	/**
	 * Used to show/hide the screenshot editor window
	 * @param type
	 * @private
	 */
	var _toggleScreenshotModal = function(type) {
		var screenshot = document.getElementById('screenshot');
		if (type == _TYPE_SHOW) {
			screenshot.style.display = 'block';
			document.body.className = 'modal';
		}
		else {
			var decorations = document.querySelectorAll('#screenshotdecorations img');
			[].forEach.call(decorations, function(decoration) {
				decoration.style.left = '0.3em';
				decoration.style.top = '0.3em';
				decoration.className = '';
			});
			screenshot.style.display = 'none';
			document.body.className = '';
		}
	};

	/**
	 * Used to handle mouse key to resize decoration items
	 */
	var _resizeDecoration = function(event) {
		var newWidth = event.target.width;
		var newHeight = event.target.height;
		var xChange = 10;

		if (event.wheelDelta < 0) {
			xChange = -10;
		}
		newWidth += xChange;

		if (newWidth > 500 || newWidth < 20) {
			return false;
		}

		var ratio = (sunglasses.height / sunglasses.width);
		var yChange = xChange * ratio;
		newHeight += yChange;

		event.target.style.height = newHeight + 'px';
		event.target.style.width = newWidth + 'px';

		return false;
	};

	/**
	 * Used to handle the image download
	 */
	var _downloadImage = function(e) {
		/** handle any images placed on it **/
		var downloadCanvas = document.createElement('canvas');
		downloadCanvas.width = _canvas.width;
		downloadCanvas.height = _canvas.height;
		var downloadCanvasContext = downloadCanvas.getContext('2d');
		downloadCanvasContext.drawImage(_canvas, 0, 0);

		var decorations = document.querySelectorAll('#screenshotdecorations img');
		[].forEach.call(decorations, function(decoration) {
			if (decoration.className) {
				var x = decoration.getAttribute('data-location-x');
				var y = decoration.getAttribute('data-location-y');
				downloadCanvasContext.drawImage(decoration, x, y, decoration.width, decoration.height);
			}
		});

		/** do download **/
		var imageDataUrl = downloadCanvas.toDataURL('image/png').substring(22);
		var byteArray = Base64Binary.decode(imageDataUrl);
		var blob = new Blob([byteArray], {type:'image/png'});
		var url = window.URL.createObjectURL(blob);

		var link = document.createElement('a');
		link.setAttribute('href', url);
		var filename = _filenameInput.value;
		if (!filename) {
			filename = _filenameInput.getAttribute('placeholder');
		}
		link.setAttribute('download', filename + '.png');
		link.addEventListener('click', function() {
			_downloadButton.className = 'downloaded';
		});

		var event = document.createEvent('MouseEvents');
		event.initMouseEvent('click', true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
		link.dispatchEvent(event);
	};
};

/**
 * source: https://github.com/danguer/blog-examples/blob/master/js/base64-binary.js
 * base64 to binary
 */
var Base64Binary = {
	_keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

	/* will return a  Uint8Array type */
	decodeArrayBuffer: function(input) {
		var bytes = (input.length/4) * 3;
		var ab = new ArrayBuffer(bytes);
		this.decode(input, ab);

		return ab;
	},

	decode: function(input, arrayBuffer) {
		//get last chars to see if are valid
		var lkey1 = this._keyStr.indexOf(input.charAt(input.length-1));
		var lkey2 = this._keyStr.indexOf(input.charAt(input.length-2));

		var bytes = (input.length/4) * 3;
		if (lkey1 == 64) bytes--; //padding chars, so skip
		if (lkey2 == 64) bytes--; //padding chars, so skip

		var uarray;
		var chr1, chr2, chr3;
		var enc1, enc2, enc3, enc4;
		var i = 0;
		var j = 0;

		if (arrayBuffer)
			uarray = new Uint8Array(arrayBuffer);
		else
			uarray = new Uint8Array(bytes);

		input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

		for (i=0; i<bytes; i+=3) {
			//get the 3 octects in 4 ascii chars
			enc1 = this._keyStr.indexOf(input.charAt(j++));
			enc2 = this._keyStr.indexOf(input.charAt(j++));
			enc3 = this._keyStr.indexOf(input.charAt(j++));
			enc4 = this._keyStr.indexOf(input.charAt(j++));

			chr1 = (enc1 << 2) | (enc2 >> 4);
			chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
			chr3 = ((enc3 & 3) << 6) | enc4;

			uarray[i] = chr1;
			if (enc3 != 64) uarray[i+1] = chr2;
			if (enc4 != 64) uarray[i+2] = chr3;
		}

		return uarray;
	}
};

/**
 * On load, check to see if chrome - and if its not, warn.
 * Then launch capture and see what happens
 */
document.addEventListener('DOMContentLoaded', function() {
	if (!window.chrome) {
		photoBooth.showBrowserWarning();
	}

	/**
	 * Protect us - and then launch the capture
	 */
	(function(){
		var videoStream = new photoBooth.videoStream();
		videoStream.initCam();
	})();
}, false);