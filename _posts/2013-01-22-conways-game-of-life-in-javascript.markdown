---
layout: post
title: Conway's Game of Life - In Javascript
tags:
- javascript
- programming
---

Recently, someone mentioned to me [Conway's Game of Life](http://en.wikipedia.org/wiki/Conway's_Game_of_Life) was a programming challenge at a code retreat they attended.  I had never heard of it so I went to take a look at the concept.  It seemed like a cool idea.  So, I decided to use Canvas and Javascript to create my own instance of it.  This is just my first draft of it - so take a look.  And, if I've done anything incorrectly, please please please! let me know.

The canvas was really simple:

{% highlight HTML %}
<h1>Conway's Game of Life</h1>
<h2>Using Javascript and Canvas</h2>
<canvas width="500" id="mainBoard" height="500"></canvas>
{% endhighlight %}    

And now the javascript used in this document:

    
{% highlight javascript %}
(function(){

    /**
     * Game of life object
     */
    function GOL() {

        /**
         * the color of the on cells
         * @type {String}
         */
        const ON_COLOR = '#336699';

        /**
         * The canvas DOM element
         * @private
         */
        var _canvas;

        /**
         * Current Matrix
         * @type {Array}
         * @private
         */
        var _currentMatrix = [];

        /**
         * Initializer function
         * @public
         */
        this.start = function() {
            _canvas = document.getElementById('mainBoard');
            _bigBang();
            setInterval(function(){_watchEvolution()}, 100);
        };

        /**
         * Generates the random pattern and paints it
         * @private
         */
        var _bigBang = function() {
            var limit = 500;

            for (var x = 0; x < limit; x++) {
                _currentMatrix[x] = [];
                for (var y = 0; y < limit; y++) {
                    _currentMatrix[x][y] = Math.round(Math.random());
                }
            }

            _paintCurrentMatrix();
        };

        /**
         * Kicks off the cycle, regenerating new matrix and repainting
         * @private
         */
        var _watchEvolution = function() {
            _generateNewMatrix();
            _clearCanvas();
            _paintCurrentMatrix();
        };

        /**
         * Generates a new matrix based on the currentMatrix and assigns it
         * @private
         */
        var _generateNewMatrix = function() {
            var newMatrix = [];

            for (var x = 0, xLimit = _currentMatrix.length; x < xLimit; x++) {
                newMatrix[x] = [];
                for (var y = 0, yLimit = _currentMatrix[0].length; y < yLimit; y++) {

                    var liveNeighborsCount = 0;

                    if (_currentMatrix[x-1] != undefined) {
                        if (_currentMatrix[x-1][y-1]) {
                            liveNeighborsCount++;
                        }
                        if (_currentMatrix[x-1][y]) {
                            liveNeighborsCount++;
                        }
                        if (_currentMatrix[x-1][y+1]) {
                            liveNeighborsCount++;
                        }
                    }

                    if (_currentMatrix[x][y-1]) {
                        liveNeighborsCount++;
                    }
                    if (_currentMatrix[x][y+1]) {
                        liveNeighborsCount++;
                    }

                    if (_currentMatrix[x+1] != undefined) {
                        if (_currentMatrix[x+1][y-1]) {
                            liveNeighborsCount++;
                        }
                        if (_currentMatrix[x+1][y]) {
                            liveNeighborsCount++;
                        }
                        if (_currentMatrix[x+1][y+1]) {
                            liveNeighborsCount++;
                        }
                    }

                    var pointValue = 0;

                    if (_currentMatrix[x][y]) {
                        // live
                        if (liveNeighborsCount == 2 || liveNeighborsCount == 3) {
                            pointValue = 1;
                        }
                    }
                    else {
                        // dead
                        if (liveNeighborsCount == 3) {
                            pointValue = 1;
                        }
                    }

                    newMatrix[x][y] = pointValue;
                }
            }

            _currentMatrix = newMatrix;
        };

        /**
         * Clears the canvas
         * @private
         */
        var _clearCanvas = function() {
            var ctx = _canvas.getContext('2d');
            ctx.clearRect(0,0,_canvas.width, _canvas.height);
        }

        /**
         * Takes the current matrix and paints it to the canvas
         * @private
         */
        var _paintCurrentMatrix = function() {
            var ctx = _canvas.getContext('2d');
            ctx.fillStyle=ON_COLOR;

            for (var x in _currentMatrix) {
                for (var y in _currentMatrix[x]) {
                    if (_currentMatrix[x][y] == 1) {
                        ctx.fillRect(x, y, 1, 1);
                    }
                }
            }
        };
    };

    var game = new GOL();
    game.start();
})();
{% endhighlight %}    


Let me know your thoughts!
