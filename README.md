fastClick.js
=================

fast click for mobile browsers

SYNOPSIS
--------

	fastClick();
	// for all elements

	fastClick('#target');
	/*
		<div id="target">
			<a href="http://example.com">fast</a>
		</div>
		<div>
			<a href="http://example.com">slow</a>
		</div>
	*/

	fastClick('#target', '#ignore');
	/*
		<div id="target">
			<a href="http://example.com">fast</a>
			<div id="ignore">
				<a href="http://example.com">slow</a>
			</div>
		</div>
	*/

DEMO
-------

live demo http://jsrun.it/kyo_ago/fastClick
edit code http://jsdo.it/kyo_ago/fastClick

LICENSE
-------

	 * fastClick
	 * Copyright (C) KAYAC Inc. | http://www.kayac.com/
	 * Dual licensed under the MIT <http://www.opensource.org/licenses/mit-license.php>
	 * and GPL <http://www.opensource.org/licenses/gpl-license.php> licenses.
	 * @author @kyo_ago

LINKS
-------

Creating Fast Buttons for Mobile Web Applications - Mobile — Google Developers https://developers.google.com/mobile/articles/fast_buttons

Configuring Defaults(useFastClick) http://jquerymobile.com/demos/1.0b1/docs/api/globalconfig.html

JavaScript Helper(Fast Buttons) · h5bp/mobile-boilerplate Wiki https://github.com/h5bp/mobile-boilerplate/wiki/JavaScript-Helper

Remove onClick delay on webkit for iPhone http://cubiq.org/remove-onclick-delay-on-webkit-for-iphone

Rob Juurlink » Blog Archive » Fast JavaScript Click Event for Touch Devices http://www.juurlink.org/2011/12/fast-javascript-click-event-for-touch-devices/

dave1010/jquery-fast-click https://github.com/dave1010/jquery-fast-click/

javascript - Trying to implement Google's Fast Button - Stack Overflow http://stackoverflow.com/questions/6300136/trying-to-implement-googles-fast-button
