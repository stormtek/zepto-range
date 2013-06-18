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

        // number
        this.min = parseInt(this.input.attr('min'), 10);
        this.max = parseInt(this.input.attr('max'), 10);
        this.amount = (this.max - this.min) + 1;
        this.current = parseInt(this.input.val(), 10) - this.min;

        // html
        this.btn = $('<div class="btn">');
        this.fill = $('<div class="fill">');
        this.bar = $('<div class="bar">').append(this.btn, this.fill);
        this.btn.size = this.btn.width();
        
        var width = parseInt(this.input.attr('width'), 10) - this.btn.size;
        this.container = this.input.wrap('<div style="width: ' + width + 'px">').parent();
        this.container.addClass(defaults.name + ' ' + this.input[0].className);
        this.container.append(this.bar);

        this.size = width;
        this.gap = this.size / (this.amount - 1);

        // legend
        this.legend = legend(labels, this);
        this.container.append(this.legend);

        // init
        this.change(this.current);
        this.input.trigger('init', [this.current, this]);
    }

    function legend(labels, range) {
        var diff = range.amount - labels.length,
            gaps = labels.length - 1,
            size = Math.floor(range.size / (range.amount - 1)),
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
            return $('<div class="label">').text(item == undefined ? '' : item);
        }));

        container.children().width(size);
        container.find(':first-child, :last-child').width(size / 2 + range.btn.size / 2);
        
        // adjust first label styling if necessary
        var firstLabel = labels[0];
        if(firstLabel) {
        	if(firstLabel.length == 1) container.find(':first-child').addClass('singleCharLabel');
        	else if(firstLabel.length == 2) container.find(':first-child').addClass('doubleCharLabel');
        }
        // adjust last label styling if necessary
        var lastLabel = labels[labels.length-1];
        if(lastLabel) {
        	if(lastLabel.length == 1) container.find(':last-child').addClass('singleCharLabel');
        	else if(lastLabel.length == 2) container.find(':last-child').addClass('doubleCharLabel');
        }

        return container;
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
            $.translateX(this.btn[0], pos);
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
            className = '.' + defaults.name;

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

    // plugin
    $.fn.range = function() {
        var labels;
        events();
        labels = Array.prototype.slice.call(arguments);
        //detects if the args were an array rather than a list
        if(labels.length==1 && labels instanceof Array) {
            labels = labels[0];
        }
        return this.each(function() {
            createRange(this, labels);
        });
    };

})(Zepto);