/*!
 * fastClick
 * Copyright (C) KAYAC Inc. | http://www.kayac.com/
 * Dual licensed under the MIT <http://www.opensource.org/licenses/mit-license.php>
 * and GPL <http://www.opensource.org/licenses/gpl-license.php> licenses.
 * Date: 2012-07-06
 * @author @kyo_ago
 * @version 1.0.2
 * @see http://github.com/kyo-ago/fastClick
 */

/**
 * initialize
 * @param base_selector(bind target)
 * @param ignore_selector(ignore element)
 */
var fastClick = function (base_selector, ignore_selector) {
	if (!document.createTouch) {
		return;
	}
	fastClick.init(base_selector, ignore_selector);
	fastClick.windowBinder && fastClick.windowBinder();
	fastClick.windowBinder = undefined;
};
fastClick.coords = [];
fastClick.clickWait = 2000;
fastClick.clickIgnoreX = 25;
fastClick.clickIgnoreY = 25;
fastClick.windowBinder = function () {
	window.addEventListener('click', fastClick.windowHandler, true);
};

fastClick.windowHandler = function (evn) {
	var target = evn.target;
	var store = target['data-fc-store'];
	if (store && store.clickable) {
		return;
	}

	var touche = evn.changedTouches ? evn.changedTouches[0] : evn;
	var coords = fastClick.coords;
	var ignoreX = fastClick.clickIgnoreX;
	var ignoreY = fastClick.clickIgnoreY;
	for (var i = 0, l = coords.length; i < l; i += 2) {
		var cordX = coords[i];
		var cordY = coords[i + 1];
		var cliX = Math.abs(touche.clientX - cordX);
		var cliY = Math.abs(touche.clientY - cordY);
		if (cliX < ignoreX && cliY < ignoreY) {
			event.returnValue = false;
			target['data-fc-store'] = undefined;
			evn.stopPropagation();
			evn.preventDefault();
			evn.stopImmediatePropagation && evn.stopImmediatePropagation();
		}
	}
	return event.returnValue;
};

fastClick.init = function (base_selector, ignore_selector) {
	var bases = base_selector ? document.querySelectorAll(base_selector) : [document];
	var node_pos = window.Node
		? window.Node.DOCUMENT_POSITION_CONTAINED_BY
		: undefined
	;
	for (var i = 0, l = bases.length; i < l; ++i) {
		var base = bases[i];
		if (!ignore_selector) {
			base.addEventListener('touchstart', fastClick.onTouchStart, false);
			continue;
		}
		base.addEventListener('touchstart', function (evn) {
			var targets = base.querySelectorAll(ignore_selector);
			for (var i = 0, l = targets.length; i < l; ++i) {
				var target = targets[i];
				var res = target.compareDocumentPosition(evn.target);
				if (res === 0 || (res & node_pos)) {
					return;
				}
			}
			fastClick.onTouchStart(evn);
		}, false);
	}
};

fastClick.onTouchStart = function (evn) {
	var target = evn.target;
	target.addEventListener('touchmove', fastClick.onTouchMove, false);
	target.addEventListener('touchend', fastClick.onTouchEnd, false);

	var store = target['data-fc-store'] = target['data-fc-store'] || {
		'startX' : 0,
		'startY' : 0,
		'clickable' : false
	};
	var touche = evn.touches[0];
	store.startX = touche.clientX;
	store.startY = touche.clientY;
};

fastClick.onTouchMove = function (evn) {
	var store = evn.target['data-fc-store'];
	if (!store) {
		return;
	}
	var target = evn.target;
	var touche = evn.touches[0];
	var absX = Math.abs(touche.clientX - store.startX);
	var absY = Math.abs(touche.clientY - store.startY);
	if (absX > 10 || absY > 10) {
		target.removeEventListener('touchend', fastClick.onTouchEnd, false);
		target.removeEventListener('touchmove', fastClick.onTouchMove, false);
	}
};

fastClick.onTouchEnd = function (evn) {
	var target = evn.target;
	if (target.nodeType === Node.TEXT_NODE) {
		target = target.parentNode;
	}

	target.removeEventListener('touchend', fastClick.onTouchEnd, false);
	target.removeEventListener('touchmove', fastClick.onTouchMove, false);

	var store = target['data-fc-store'];
	if (store && store.clickable) {
		return;
	}

	store.clickable = true;

	var click = document.createEvent('MouseEvents');
	var touche = evn.changedTouches[0];
	click.initMouseEvent('click', evn.bubbles, evn.cancelable, evn.view, evn.detail, touche.screenX, touche.screenY, touche.clientX, touche.clientY, evn.ctrlKey, evn.altKey, evn.shiftKey, evn.metaKey, evn.button, null);
	target.dispatchEvent(click);

	store.clickable = false;

	fastClick.coords.push(store.startX, store.startY);
	// split scope
	fastClick.removeCoords(store);
};

fastClick.removeCoords = function (store) {
	setTimeout(function () {
		fastClick.coords.splice(0, 2);
	}, fastClick.clickWait);
};
