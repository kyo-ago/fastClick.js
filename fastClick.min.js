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
var fastClick=function(a,b){document.createTouch&&(fastClick.init(a,b),fastClick.windowBinder&&fastClick.windowBinder(),fastClick.windowBinder=void 0)};fastClick.coords=[];fastClick.clickWait=2E3;fastClick.clickIgnoreX=25;fastClick.clickIgnoreY=25;fastClick.windowBinder=function(){window.addEventListener("click",fastClick.windowHandler,!0)};
fastClick.windowHandler=function(a){var b=a.target,c=b["data-fc-store"];if(!c||!c.clickable){for(var c=a.changedTouches?a.changedTouches[0]:a,e=fastClick.coords,d=fastClick.clickIgnoreX,g=fastClick.clickIgnoreY,f=0,j=e.length;f<j;f+=2){var h=e[f+1],k=Math.abs(c.clientX-e[f]),h=Math.abs(c.clientY-h);k<d&&h<g&&(event.returnValue=!1,b["data-fc-store"]=void 0,a.stopPropagation(),a.preventDefault(),a.stopImmediatePropagation&&a.stopImmediatePropagation())}return event.returnValue}};
fastClick.init=function(a,b){for(var c=a?document.querySelectorAll(a):[document],e=window.Node?window.Node.DOCUMENT_POSITION_CONTAINED_BY:void 0,d=0,g=c.length;d<g;++d){var f=c[d];b?f.addEventListener("touchstart",function(a){for(var c=f.querySelectorAll(b),d=0,g=c.length;d<g;++d){var i=c[d].compareDocumentPosition(a.target);if(0===i||i&e)return}fastClick.onTouchStart(a)},!1):f.addEventListener("touchstart",fastClick.onTouchStart,!1)}};
fastClick.onTouchStart=function(a){var b=a.target;b.addEventListener("touchmove",fastClick.onTouchMove,!1);b.addEventListener("touchend",fastClick.onTouchEnd,!1);b=b["data-fc-store"]=b["data-fc-store"]||{startX:0,startY:0,clickable:!1};a=a.touches[0];b.startX=a.clientX;b.startY=a.clientY};
fastClick.onTouchMove=function(a){var b=a.target["data-fc-store"];if(b){var c=a.target,e=a.touches[0],a=Math.abs(e.clientX-b.startX),b=Math.abs(e.clientY-b.startY);if(10<a||10<b)c.removeEventListener("touchend",fastClick.onTouchEnd,!1),c.removeEventListener("touchmove",fastClick.onTouchMove,!1)}};
fastClick.onTouchEnd=function(a){var b=a.target;b.nodeType===Node.TEXT_NODE&&(b=b.parentNode);b.removeEventListener("touchend",fastClick.onTouchEnd,!1);b.removeEventListener("touchmove",fastClick.onTouchMove,!1);var c=b["data-fc-store"];if(!c||!c.clickable){c.clickable=!0;var e=document.createEvent("MouseEvents"),d=a.changedTouches[0];e.initMouseEvent("click",a.bubbles,a.cancelable,a.view,a.detail,d.screenX,d.screenY,d.clientX,d.clientY,a.ctrlKey,a.altKey,a.shiftKey,a.metaKey,a.button,null);b.dispatchEvent(e);
c.clickable=!1;fastClick.coords.push(c.startX,c.startY);fastClick.removeCoords(c)}};fastClick.removeCoords=function(){setTimeout(function(){fastClick.coords.splice(0,2)},fastClick.clickWait)};