sinon.log = function (message) {
	jstestdriver.console.log(message);
};
sinon.assert.expose(this, {
	'includeFail' : false
});
var oldTestCase = TestCase;
TestCase = function (name, condition, opt_proto) {
	if ('function' !== typeof condition) {
		opt_proto = condition;
		condition = undefined;
	}
	Object.keys(opt_proto).forEach(function (key) {
		if (!key.match(/^test_/)) {
			return;
		}
		var func = opt_proto[key];
		if (!func.length) {
			return;
		}
		opt_proto[key] = function (queue) {
			queue.call(function (callbacks) {
				var arg = [];
				for (var i = 0, l = func.length; i < l; i++) {
					arg.push(callbacks.add(function () {}));
				}
				func.apply(this, arg);
			});
		};
	});
	opt_proto = sinon.testCase(opt_proto);
	if (condition) {
		ConditionalAsyncTestCase(name, condition, opt_proto);
		return;
	}
	AsyncTestCase(name, opt_proto);
};

function assertNotClassName(msg, className, element) {
	var args = argsWithOptionalMsg_(arguments, 3);
	var actual = args[2] && args[2].className;
	var regexp = new RegExp('(^|\\s)' + args[1] + '(\\s|$)');

	var flag;
	try {
		assertMatch(args[0], regexp, actual);
		flag = true;
	} catch (e) {
	}
	if (!flag) {
		return true;
	}
	actual = prettyPrintEntity_(actual);
	fail(args[0] + 'expected class name not to be included ' + prettyPrintEntity_(args[1]));
}

function createTouchEvent (target, option) {
	option = option || {};
	var param = {
		type: 'touchstart',
		canBubble: true,
		cancelable: true,
		view: window,
		detail: 0,
		screenX: 0,
		screenY: 0,
		clientX: 0,
		clientY: 0,
		ctrlKey: false,
		altKey: false,
		shiftKey: false,
		metaKey: false,
		touches: document.createTouchList(document.createTouch(window, target, 0, 0, 0, 0, 0)),
		targetTouches: document.createTouchList(document.createTouch(window, target, 0, 0, 0, 0, 0)),
		changedTouches: document.createTouchList(document.createTouch(window, target, 0, 0, 0, 0, 0)),
		scale: 0,
		rotation: 0,
		touchItem: 0
	};

	Object.keys(param).forEach(function (key) {
		param[key] = key in option ? option[key] : param[key];
	});

	var event;

	if(/Android\s+[123]\./i.test(navigator.userAgent)){
		event = document.createEvent('MouseEvents');
		event.initMouseEvent(param.type, param.canBubble, param.cancelable, param.view, param.detail, param.screenX, param.screenY, param.clientX, param.clientY, param.ctrlKey, param.altKey, param.shiftKey, param.metaKey, /*button*/ 0, null);
		event.touches = [document.createTouch(window, target, 0, 0, 0, 0, 0)];
		event.targetTouches = [document.createTouch(window, target, 0, 0, 0, 0, 0)];
		event.changedTouches = [document.createTouch(window, target, 0, 0, 0, 0, 0)];
		event.scale = param.scale;
		event.rotation = param.rotation;
		return event;
	}

	event = document.createEvent('TouchEvent');
	if (/Android\s+4\./i.test(navigator.userAgent)) {
		event.initTouchEvent(param.touches, param.targetTouches, param.changedTouches, param.type, param.view, param.screenX, param.screenY, param.clientX, param.clientY, param.ctrlKey, param.altKey, param.shiftKey, param.metaKey);
	} else {
		event.initTouchEvent(param.type, param.canBubble, param.cancelable, param.view, param.detail, param.screenX, param.screenY, param.clientX, param.clientY, param.ctrlKey, param.altKey, param.shiftKey, param.metaKey, param.touches, param.targetTouches, param.changedTouches, param.scale, param.rotation);
	}
	return event;
}

//for IDE code completion

//JsTestDriver assert
this.fail = this.fail || function () {};
this.assert = this.assert || function (actual) {};
this.assertTrue = this.assertTrue || function (actual) {};
this.assertFalse = this.assertFalse || function (actual) {};
this.assertEquals = this.assertEquals || function (expected, actual) {};
this.assertNotEquals = this.assertNotEquals || function (expected, actual) {};
this.assertSame = this.assertSame || function (expected, actual) {};
this.assertNotSame = this.assertNotSame || function (expected, actual) {};
this.assertNull = this.assertNull || function (actual) {};
this.assertNotNull = this.assertNotNull || function (actual) {};
this.assertUndefined = this.assertUndefined || function (actual) {};
this.assertNotUndefined = this.assertNotUndefined || function (actual) {};
this.assertNaN = this.assertNaN || function (actual) {};
this.assertNotNaN = this.assertNotNaN || function (actual) {};
this.assertException = this.assertException || function (callback, error) {};
this.assertNoException = this.assertNoException || function (callback) {};
this.assertArray = this.assertArray || function (actual) {};
this.assertTypeOf = this.assertTypeOf || function (expected, value) {};
this.assertBoolean = this.assertBoolean || function (actual) {};
this.assertFunction = this.assertFunction || function (actual) {};
this.assertObject = this.assertObject || function (actual) {};
this.assertNumber = this.assertNumber || function (actual) {};
this.assertString = this.assertString || function (actual) {};
this.assertMatch = this.assertMatch || function (regexp, actual) {};
this.assertNoMatch = this.assertNoMatch || function (regexp, actual) {};
this.assertTagName = this.assertTagName || function (tagName, element) {};
this.assertClassName = this.assertClassName || function (className, element) {};
this.assertElementId = this.assertElementId || function (id, element) {};
this.assertInstanceOf = this.assertInstanceOf || function (constructor, actual) {};
this.assertNotInstanceOf = this.assertNotInstanceOf || function (constructor, actual) {};

//SinonJS assert
this.assertPass = this.assertPass || function (assertion) {};
this.assertCalled = this.assertCalled || function (spy) {};
this.assertNotCalled = this.assertNotCalled || function (spy) {};
this.assertCalledOnce = this.assertCalledOnce || function (spy) {};
this.assertCalledTwice = this.assertCalledTwice || function (spy) {};
this.assertCalledThrice = this.assertCalledThrice || function (spy) {};
this.assertCalledCount = this.assertCalledCount || function (spy, num) {};
this.assertCalledOrder = this.assertCalledOrder || function (spy1, spy2 /* ... */) {};
this.assertAlwaysCalledOn = this.assertAlwaysCalledOn || function (spy, obj) {};
this.assertCalledOn = this.assertCalledOn || function (spy, obj) {};
this.assertCalledWith = this.assertCalledWith || function (spy, arg1, arg2/*...*/) {};
this.assertAlwaysCalledWith = this.assertAlwaysCalledWith || function (spy, arg1, arg2/*...*/) {};
this.assertNeverCalledWith = this.assertNeverCalledWith || function (spy, arg1, arg2/*...*/) {};
this.assertCalledWithExactly = this.assertCalledWithExactly || function (spy, arg1, arg2/*...*/) {};
this.assertAlwaysCalledWithExactly = this.assertAlwaysCalledWithExactly || function (spy, arg1, arg2/*...*/) {};
this.assertThrew = this.assertThrew || function (spy, exception) {};
this.assertAlwaysThrew = this.assertAlwaysThrew || function (spy, exception) {};
