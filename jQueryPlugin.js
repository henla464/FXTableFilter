
// Initialised like:
// $(#tableid).tableFilter(options)
var jq = window['jQuery'];
if (jq) {
    (function (jq) {
        jq.tableFilter = function (element, opts) {
            var tf;
            var plugin = this;
            plugin.init = function () {
                var options = jq['extend']({}, new picnet.ui.filter.TableFilterOptions(), opts);
                tf = new picnet.ui.filter.TableFilter(element, options);
            };

            plugin.applyFilter = function () {
                tf.applyFilter();
            };
            
             plugin.clearAllFilters = function () {
                tf.clearAllFilters();
            };

            plugin.reload = function () {
                tf.reload();
            };

            plugin.init();

        };

        jq['fn']['tableFilter'] = function (options) {
           var length = this.length;
            for (var i = 0 ; i < length ; i++)
            {
            	var t = this[i];
             	if (undefined === jq(t).data('tableFilter') ||
	                jq(t).data('tableFilter') === null) {
                    var plugin = new jq.tableFilter(t, options);
                    jq(t).data('tableFilter', plugin);
                }
            }
            return this;
        };

        jq['fn']['tableFilterReload'] = function (options) {
        	var length = this.length;
            for (var i = 0 ; i < length ; i++)
            {
         		var t = this[i];
                if (undefined !== jq(t).data('tableFilter') &&
	                 jq(t).data('tableFilter') !== null) {
                    var plugin = jq(t).data('tableFilter');
                    plugin.reload();
                }
            }
            return this;
        };
        
         jq['fn']['tableFilterClear'] = function (options) {
        	var length = this.length;
            for (var i = 0 ; i < length ; i++)
            {
         		var t = this[i];
                if (undefined !== jq(t).data('tableFilter') &&
	                 jq(t).data('tableFilter') !== null) {
                    var plugin = jq(t).data('tableFilter');
                    plugin.clearAllFilters();
                }
            }
            return this;
        };

        jq['fn']['tableFilterApplyFilter'] = function (options) {
            var length = this.length;
            for (var i = 0; i < length; i++) {
                var t = this[i];
                if (undefined !== jq(t).data('tableFilter') &&
	                 jq(t).data('tableFilter') !== null) {
                    var plugin = jq(t).data('tableFilter');
                    plugin.applyFilter();
                }
            }
            return this;
        };

    })(jq);
};



/**
 * jQuery.timers - Timer abstractions for jQuery
 * Written by Blair Mitchelmore (blair DOT mitchelmore AT gmail DOT com)
 * Licensed under the WTFPL (http://sam.zoy.org/wtfpl/).
 * Date: 2009/10/16
 *
 * @author Blair Mitchelmore
 * @version 1.2
 *
 **/

jQuery.fn.extend({
	everyTime: function(interval, label, fn, times) {
		return this.each(function() {
			jQuery.timer.add(this, interval, label, fn, times);
		});
	},
	oneTime: function(interval, label, fn) {
		return this.each(function() {
			jQuery.timer.add(this, interval, label, fn, 1);
		});
	},
	stopTime: function(label, fn) {
		return this.each(function() {
			jQuery.timer.remove(this, label, fn);
		});
	}
});

jQuery.extend({
	timer: {
		global: [],
		guid: 1,
		dataKey: "jQuery.timer",
		regex: /^([0-9]+(?:\.[0-9]*)?)\s*(.*s)?$/,
		powers: {
			// Yeah this is major overkill...
			'ms': 1,
			'cs': 10,
			'ds': 100,
			's': 1000,
			'das': 10000,
			'hs': 100000,
			'ks': 1000000
		},
		timeParse: function(value) {
			if (value == undefined || value == null)
				return null;
			var result = this.regex.exec(jQuery.trim(value.toString()));
			if (result[2]) {
				var num = parseFloat(result[1]);
				var mult = this.powers[result[2]] || 1;
				return num * mult;
			} else {
				return value;
			}
		},
		add: function(element, interval, label, fn, times) {
			var counter = 0;
			
			if (jQuery.isFunction(label)) {
				if (!times) 
					times = fn;
				fn = label;
				label = interval;
			}
			
			interval = jQuery.timer.timeParse(interval);

			if (typeof interval != 'number' || isNaN(interval) || interval < 0)
				return;

			if (typeof times != 'number' || isNaN(times) || times < 0) 
				times = 0;
			
			times = times || 0;
			
			var timers = jQuery.data(element, this.dataKey) || jQuery.data(element, this.dataKey, {});
			
			if (!timers[label])
				timers[label] = {};
			
			fn.timerID = fn.timerID || this.guid++;
			
			var handler = function() {
				if ((++counter > times && times !== 0) || fn.call(element, counter) === false)
					jQuery.timer.remove(element, label, fn);
			};
			
			handler.timerID = fn.timerID;
			
			if (!timers[label][fn.timerID])
				timers[label][fn.timerID] = window.setInterval(handler,interval);
			
			this.global.push( element );
			
		},
		remove: function(element, label, fn) {
			var timers = jQuery.data(element, this.dataKey), ret;
			
			if ( timers ) {
				
				if (!label) {
					for ( label in timers )
						this.remove(element, label, fn);
				} else if ( timers[label] ) {
					if ( fn ) {
						if ( fn.timerID ) {
							window.clearInterval(timers[label][fn.timerID]);
							delete timers[label][fn.timerID];
						}
					} else {
						for ( var fn in timers[label] ) {
							window.clearInterval(timers[label][fn]);
							delete timers[label][fn];
						}
					}
					
					for ( ret in timers[label] ) break;
					if ( !ret ) {
						ret = null;
						delete timers[label];
					}
				}
				
				for ( ret in timers ) break;
				if ( !ret ) 
					jQuery.removeData(element, this.dataKey);
			}
		}
	}
});

jQuery(window).bind("unload", function() {
	jQuery.each(jQuery.timer.global, function(index, item) {
		jQuery.timer.remove(item);
	});
});


/**
 * jQuery Cookie plugin
 *
 * Copyright (c) 2010 Klaus Hartl (stilbuero.de)
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 */
 
jQuery.cookie = function (key, value, options) {

    // key and at least value given, set cookie...
    if (arguments.length > 1 && String(value) !== "[object Object]") {
        options = jQuery.extend({}, options);

        if (value === null || value === undefined) {
            options.expires = -1;
        }

        if (typeof options.expires === 'number') {
            var days = options.expires, t = options.expires = new Date();
            t.setDate(t.getDate() + days);
        }

        value = String(value);

        return (document.cookie = [
            encodeURIComponent(key), '=',
            options.raw ? value : encodeURIComponent(value),
            options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
            options.path ? '; path=' + options.path : '',
            options.domain ? '; domain=' + options.domain : '',
            options.secure ? '; secure' : ''
        ].join(''));
    }

    // key and possibly options given, get cookie...
    options = value || {};
    var result, decode = options.raw ? function (s) { return s; } : decodeURIComponent;
    return (result = new RegExp('(?:^|; )' + encodeURIComponent(key) + '=([^;]*)').exec(document.cookie)) ? decode(result[1]) : null;
};
