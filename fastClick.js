/*!
 * fastClick
 * Copyright (C) KAYAC Inc. | http://www.kayac.com/
 * Dual licensed under the MIT <http://www.opensource.org/licenses/mit-license.php>
 * and GPL <http://www.opensource.org/licenses/gpl-license.php> licenses.
 * Date: 2012-07-06
 * @author @kyo_ago
 * @version 1.0.0
 * @see http://github.com/kyo-ago/fastClick
 */

this['fastClick'] = (function (window, document) {
	/**
	 * initialize
	 * @param base(bind target)
	 * @param ignore(ignore element)
	 */
	var self = function (base, ignore) {
		if (!('ontouchstart' in window)) {
			return;
		}
		window.addEventListener('click', self['windowClick'], true);
		self['init'](base, ignore);
		return self;
	};
	self.coords = [];
	self.clickWait = 2000;

	self['windowClick'] = function (evn) {
		var target = evn.target;
		var store = target['data-fc-store'];
		if (store && store.clickable) {
			return;
		}
		var touche = evn.changedTouches ? evn.changedTouches[0] : evn;
		var clientX = touche.clientX;
		var clientY = touche.clientY;
		var coords = self.coords;
		for (var i = 0, l = coords.length; i < l; i += 2) {
			var cordX = coords[i];
			var cordY = coords[i + 1];
			var cliX = Math.abs(clientX - cordX);
			var cliY = Math.abs(clientY - cordY);
			if (cliX < 25 && cliY < 25) {
				evn.stopPropagation();
				evn.preventDefault();
				return;
			}
		}
	};

	self['init'] = function (base_selector, ignore_selector) {
		var bases = base_selector ? document.querySelectorAll(base_selector) : [document];
		for (var i = 0, l = bases.length; i < l; ++i) {
			var base = bases[i];
			if (!ignore_selector) {
				base.addEventListener('touchstart', self['onTouchStart'], false);
				continue;
			}
			base['data-ignore-selector'] = ignore_selector;
			if (document.documentElement.webkitMatchesSelector && (base === window || base === document || base === document.body)) {
				base.addEventListener('touchstart', self['matchesSelectorHandler'], false);
				continue;
			}
			base.addEventListener('touchstart', self['querySelectorHandler'], false);
		}
	};
	self['matchesSelectorHandler'] = function (evn) {
		var selector = this['data-ignore-selector'];
		if (!evn.target.webkitMatchesSelector(selector)) {
			self['onTouchStart'](evn);
		}
	};
	self['querySelectorHandler'] = function (evn) {
		var selector = this['data-ignore-selector'];
		var targets = this.querySelectorAll(selector);
		var node_pos = window.Node
			? window.Node.DOCUMENT_POSITION_CONTAINED_BY
			: undefined
		;
		for (var i = 0, l = targets.length; i < l; ++i) {
			var target = targets[i];
			var res = target.compareDocumentPosition(evn.target);
			if (res === 0 || (res & node_pos)) {
				return;
			}
		}
		self['onTouchStart'](evn);
	};

	self['onTouchStart'] = function (evn) {
		var target = evn.target;
		target.addEventListener('touchmove', self['onTouchMove'], false);
		target.addEventListener('touchend', self['onTouchEnd'], false);

		var store = target['data-fc-store'] = target['data-fc-store'] || {};
		var touche = evn.touches[0];
		store.startX = touche.clientX;
		store.startY = touche.clientY;
	};

	self['onTouchMove'] = function (evn) {
		var store = evn.target['data-fc-store'];
		if (!store) {
			return;
		}
		var target = evn.target;
		var touche = evn.touches[0];
		var absX = Math.abs(touche.clientX - store.startX);
		var absY = Math.abs(touche.clientY - store.startY);
		if (absX > 10 || absY > 10) {
			target.removeEventListener('touchend', self['onTouchEnd'], false);
			target.removeEventListener('touchmove', self['onTouchMove'], false);
		}
	};

	self['onTouchEnd'] = function (evn) {
		var target = evn.target;
		target.removeEventListener('touchend', self['onTouchEnd'], false);
		target.removeEventListener('touchmove', self['onTouchMove'], false);

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

		self.coords.push(store.startX, store.startY);
		// split scope
		self.removeCoords(store);
	};

	self.removeCoords = function (store) {
		setTimeout(function () {
			self.coords.splice(0, 2);
		}, self.clickWait);
	};

	return self;
})(this, this.document);
