'use strict';

TestCase('fastClick.initialize', {
	'setUp' : function () {
		this.stub(HTMLElement.prototype, 'addEventListener');
		this.stub(document, 'addEventListener');
		this.stub(window, 'addEventListener');
	},
	'test10.fastClick' : function () {
		/*:DOC += <a href="#" id="fast">fast</a> */
		this.stub(fastClick, 'onTouchStart');

		fastClick();

		assertCalledOnce(document.addEventListener);

		fastClick('a');

		assertCalledOnce(HTMLElement.prototype.addEventListener);
	},
	'test10.fastClick_ignore' : function () {
		/*:DOC += <p id="fast_wrap"><a href="#" id="fast">fast</a><a href="#" id="ignore">ignore</a></p><p id="slow_wrap"><a href="#" id="slow">slow</a></p> */
		this.stub(fastClick, 'onTouchStart');

		fastClick('#fast_wrap', '#ignore');

		var call = HTMLElement.prototype.addEventListener.lastCall;
		var handler = call.args[1];
		document.getElementById('fast_wrap')['data-ignore-selector'] = '#ignore';

		assertCalledOnce(HTMLElement.prototype.addEventListener);
		assertFunction(handler);

		handler.call(document.getElementById('fast_wrap'), {
			'target' : document.getElementById('ignore')
		});

		assertNotCalled(fastClick.onTouchStart);

		handler.call(document.getElementById('fast_wrap'), {
			'target' : document.getElementById('fast')
		});

		assertCalledOnce(fastClick.onTouchStart);
	}
});

TestCase('fastClick.event', function () { return document.createTouch; }, {
	'fireTouchEvent' : function (name) {
		var env = createTouchEvent(this.fast, {
			'type' : name
		});
		this.fast.dispatchEvent(env);
		return env;
	},
	'test10.onClick' : function () {
		/*:DOC += <p id="fast_wrap"><a href="#" id="fast">fast</a></p> */
		this.spy(fastClick, 'onTouchStart');
		this.spy(fastClick, 'onTouchMove');
		this.fast = document.getElementById('fast');
		var click = sinon.spy();
		this.fast.addEventListener('click', click, false);

		fastClick('#fast_wrap');

		this.fireTouchEvent('touchstart');

		assertCalledOnce(fastClick.onTouchStart);

		this.fireTouchEvent('touchmove');

		assertCalledOnce(fastClick.onTouchMove);
		assertNotCalled(click);

		this.fireTouchEvent('touchend');

		assertCalledOnce(click);

		this.fireTouchEvent('click');

		assertCalledOnce(click);
	}
});

