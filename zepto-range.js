;(function ($) {
    'use strict';

    // thanks to http://www.mobify.com/
    $.CSS = {
        cache: {},
        prefixes: ['Webkit', 'Moz', 'O', 'ms', '']
    };

    $.CSS.getProperty = function (name) {
        var div, property;
        if (typeof $.CSS.cache[name] !== 'undefined') {
            return $.CSS.cache[name];
        }

        div = document.createElement('div').style;
        for (var i = 0; i < $.CSS.prefixes.length; ++i) {
            if (div[$.CSS.prefixes[i] + name] != undefined) {
                return $.CSS.cache[name] = $.CSS.prefixes[i] + name;
            }
        }
    }

    $.supports = {
        transform: !!($.CSS.getProperty('Transform')),
        transform3d: !!(window.WebKitCSSMatrix && 'm11' in new WebKitCSSMatrix())
    };

    $.supports.addClass = function () {
        $.each(arguments, function () {
            $('html').addClass(($.supports[this] ? '' : 'no-') + this);
        });
    };

    $.translateX = function(element, delta) {
        var property = property = $.CSS.getProperty('Transform');
        if (typeof delta === 'number') {
            delta = delta + 'px';
        }
        if ($.supports.transform3d) {
            return element.style[property] = 'translate3d(' + delta + ', 0, 0)';
        } else if ($.supports.transform) {
            return element.style[property] = 'translate(' + delta + ', 0)';
        } else {
            return element.style.left = delta;
        }
    };
})(Zepto);



;(function ($) {
    'use strict';

    var store = [],
        isTouch = document.ontouchstart === null,
        defaults = {
            name: 'range',
            tapGesture: isTouch ? 'tap' : 'click',
            startGesture: isTouch ? 'touchstart' : 'mousedown',
            moveGesture: isTouch ? 'touchmove' : 'mousemove',
            stopGesture: isTouch ? 'touchend touchcancel' : 'mouseup',
        };

    function Range(input, labels) {
        this.input = $(input);
        this.labels = labels;

        // number
        this.min = parseInt(this.input.attr('min'), 10);
        this.max = parseInt(this.input.attr('max'), 10);
        this.amount = (this.max - this.min) + 1;
        var initValue = parseInt(this.input.val(), 10);
        if(isNaN(initValue)) this.current = this.min;
        else this.current = initValue - this.min;
        
        // default behaviour is to show lines for empty labels
        var showEmptyLabels = this.input.attr('showEmptyLabels');
        if(showEmptyLabels == 'false') this.showEmptyLabels = false;
        else this.showEmptyLabels = true;

		// find a user defined color for the fill
		var fillColor = this.input.attr('fillColor');

        // html
        this.btn = $('<div class="btn">');
        if(fillColor != undefined) this.fill = $('<div class="fill" style="background: ' + fillColor + '">');
        else this.fill = $('<div class="fill">');
        this.bar = $('<div class="bar">').append(this.btn, this.fill);
        this.btn.size = this.btn.width();
        
        var setWidthValue = parseInt(this.input.attr('width'), 10);
        if(isNaN(setWidthValue) || setWidthValue <= 0) setWidthValue = this.input.width();
        var width =  setWidthValue - this.btn.size;
        this.container = this.input.wrap('<div style="width: ' + width + 'px">').parent();
        this.container.addClass(defaults.name + ' ' + this.input[0].className);
        this.container.append(this.bar);

        this.size = width;
        this.gap = this.size / (this.amount - 1);

        // legend
        if(!labels.length) {
            labels = new Array(2);
            labels[0] = this.min + "";
            labels[1] = this.max + "";
        }
        this.legend = legend(labels, this);
        this.container.append(this.legend);

        // init
        this.change(this.current);
        this.input.trigger('init', [this.current, this]);
    }

    function legend(labels, range) {
        var diff = range.amount - labels.length,
            gaps = labels.length - 1,
            size = (range.size - labels.length) / (range.amount - 1),
            container, tmp, i;

        // labels
        if (diff) {
            if (!labels.length || diff % gaps) {
                labels = new Array(range.amount);
            } else {
                tmp = new Array(diff / gaps);
                tmp.unshift(null, 0);
                for (i = 1; i < range.amount; i += tmp.length - 1) {
                    tmp[0] = i;
                    [].splice.apply(labels, tmp);
                }
            }
        }

        // html
        container = $('<div class="legend" aria-hidden="true">');
        container.append($.map(labels, function(item) {
        	var classes = "label";
        	if(item == undefined && range.showEmptyLabels) {
        		classes += " label-empty";
            }
            return $('<div class="' + classes + '">').text(item == undefined ? '' : item);
        }));

		// set size of labels
		setLabelWidths(container, size, range.amount);
        container.find(':first-child, :last-child').width(Math.ceil(size / 2 + range.btn.size / 2));
        
        // adjust first label styling if necessary
        var firstLabel = labels[0];
        if(firstLabel != null) {
        	if(firstLabel.length == 1) container.find(':first-child').addClass('singleCharLabel');
        	else if(firstLabel.length == 2) container.find(':first-child').addClass('doubleCharLabel');
        }
        // adjust last label styling if necessary
        var lastLabel = labels[labels.length-1];
        if(lastLabel) {
        	var lastChild = container.find(':last-child');
        	if(lastLabel.length == 1) lastChild.addClass('singleCharLabel');
        	else if(lastLabel.length == 2) lastChild.addClass('doubleCharLabel');
        	if(labels.length > 15 || lastLabel.length < 3) lastChild.addClass('label-last-child');
        }

        return container;
    }
    
    function setLabelWidths(container, size, numValues) {
    	// special care is needed to handle sub pixel widths ...
    	// we do not want to rely on a browser to guess at how it should be done
    	// this was a particular issue with safari which rounds all values down
    	var numDp = 2;
		var value = getDecimalPart(size, numDp);
		var baseDenominator = Math.pow(10, numDp);
		var gcf = greatestCommonFactor(value, baseDenominator);
		var scaleLoop = baseDenominator / gcf;
		// we use these values to determine how many values should be rounded up and
		// how many values should be rounded down
		var numToScaleUp = value / gcf;
		var numToScaleDown = scaleLoop - numToScaleUp;
		// gap is used to make sure that scaleUp and scaleDown are evenly distributed
		// through the values on the slider, rather than all grouped together
		var gap = Math.ceil(scaleLoop / numToScaleDown);
		if(numToScaleUp < numToScaleDown) gap = Math.ceil(scaleLoop / numToScaleUp);
		// make sure we do as little work as possible
		var loopLength = scaleLoop;
		if(numValues < scaleLoop) loopLength = numValues;
		// actually set the widths on the labels
		for(var i=0; i<loopLength; i++) {
			var labelSize = size;
			if(numToScaleDown < numToScaleUp) {
				if(i % gap == 0) labelSize = Math.floor(size);
				else labelSize = Math.ceil(size);
			} else {
				if(i % gap == 0) labelSize = Math.ceil(size);
				else labelSize = Math.floor(size);
			}
			// the css selector is forming the inner loop and setting widths
			// on the appropriate elements
			container.children('*:nth-child(' + scaleLoop + 'n+' + i + ')').width(labelSize);
		}
    }
    
    function greatestCommonFactor(a, b) {
    	if(b==0) return a;
    	return greatestCommonFactor(b, a%b);
    }
    
    function getDecimalPart(number, numDp) {
    	var scale = Math.pow(10, numDp + 1);
    	var scaled = number * scale;
    	var bigPart = scaled % scale;
    	var smallPart = scaled % 10;
    	return (bigPart - smallPart) / 10;
    }

    $.extend(Range.prototype, {
        pos: function () {
            return this.current * this.gap;
        },
        moving: function (status) {
            return this.container.toggleClass('moving', status);
        },
        move: function(to) {
            var pos = to * this.gap;
            var btnWidth = this.btn.width();
            if(to > 0) {
            	if(to == this.amount - 1) pos -= btnWidth;
            	else pos -= btnWidth / 2;
            }
            // make sure we stay inside the bounds of the slider
            if(pos < 0) pos = 0;
            var max = ((this.amount - 1) * this.gap) - btnWidth;
            if(pos > max) pos = max;
            //shift the handle to the appropriate position
            $.translateX(this.btn[0], pos);
            // adjust the fill width
            this.fill.width(pos);
            this.input.trigger('move', [to, this]);
        },
        change: function(to) {
            to = Math.round(to);
            this.move(to);
            this.current = to;
            this.input.val(this.current + this.min);
            this.input.trigger('change', [to, this]);
        }
    });

    function events() {
        // singleton pattern
        var doc = $(document),
            className = '.' + defaults.name,
            touches = {x: 0, y: 0};

        doc.on(defaults.startGesture, className + ' .btn', function (event) {
            var range = getRange(this),
                pos = range && range.pos(),
                initPos = event.pageX || (event.touches[0] && event.touches[0].pageX) || 0;

            function animate(event) {
                event.preventDefault();
                pos = range.pos() - initPos;
                pos += event.pageX || (event.touches[0] && event.touches[0].pageX) || 0;
                pos = Math.max(0, Math.min(pos, range.size));
                range.move(pos / range.gap);
            }

            function stop(event) {
                doc.off(defaults.moveGesture, animate);
                doc.off(defaults.stopGesture, stop);
                range.moving(false);
                range.change(pos / range.gap);
            }

            if (range) {
                range.moving(true);
                doc.bind(defaults.moveGesture, animate);
                doc.bind(defaults.stopGesture, stop);
            }
        });

        doc.on(defaults.tapGesture, className + ' .label', function (event) {
            (getRange(this)).change($(this).index());
        });
        doc.on(defaults.tapGesture, className + ' .legend', function(event) {
        	if(event.target==this) {
        		// if the user clicks near the end of the legend we want to move
        		// the slider to the min or max value, esp if on a touch device
        		// - this will be a click on the legend rather than a label
        		var clickX = touches.x;
        		if(event.pageX) clickX = event.pageX;
        		var range = getRange(this);
        		var legend = $(this);
        		var legendPos = legend.offset();
        		var start = legendPos.left;
        		var end = legendPos.left + legendPos.width;
        		var adjustment = range.btn.width();
        		if(clickX < (start + adjustment)) range.change(range.min);
        		else if(clickX > (end - adjustment)) range.change(range.amount-1);
        	}
        });
        doc.on(defaults.startGesture, className + ' .legend', function (event) {
        	if(event.originalEvent.touches) {
	        	touches.x = event.originalEvent.touches[0].pageX;
	        	touches.y = event.originalEvent.touches[0].pageY;
	        }
        });
        
        events = function() {};
    }

    function createRange(input, labels) {
        var range;
        if (!$(input).closest('.' + defaults.name).length) {
            range = new Range(input, labels);
            range.container.data(defaults.name + '-store', store.length);
            store.push(range);
        }
    }

    function getRange(item) {
        var element = $(item).closest('.' + defaults.name);
        return store[element.data(defaults.name + '-store')];
    }
    
    function removeRange(range) {
    	var index = -1;
    	for(var i=0; i<store.length; i++) {
    		if(store[i] == range) {
    			index = i;
    		}
    	}
    	if(index >= 0) {
    		store.splice(index, 1);
    		var parent = range.container.parent();
    		range.container.detach();
    		parent.append(range.input[0]);
    	}
    }

    // plugin
    $.fn.range = function() {
        var labels;
        events();
        labels = Array.prototype.slice.call(arguments);
        // detects if the args were an array rather than a list
        if(labels.length==1 && labels instanceof Array) {
            labels = labels[0];
        }
        return this.each(function() {
            createRange(this, labels);
        });
    };
    
    $.fn.setValue = function(value) {
    	var range = getRange(this);
    	value -= range.min;
    	range.change(value);
    };
    
    $.fn.setFillColor = function(color) {
    	getRange(this).fill[0].style['background'] = color;
    }
    
    $.fn.resetFillColor = function() {
    	getRange(this).fill[0].style['background'] = '';
    }
    
    $.fn.setWidth = function(newWidth) {
    	// we need to remove the existing range from the DOM
    	// update the width value for the input field
    	// and then create the range again
    	// this is the easiest way to guarantee that layout for legend
    	// remains consistent with the new width
    	var range = getRange(this);
    	var labels = range.labels;
    	removeRange(range);
    	this.attr('width', newWidth);
    	createRange(this, labels);
    }

})(Zepto);
