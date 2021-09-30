<script>
    import { onMount } from "svelte";
    import jquery from "jquery";

onMount( () => {
	
function edgtfThemeCursor() {
	// var cursorEnabled = edgtf.body.hasClass('edgtf-theme-cursor'),
	 var  cursor = jquery('#edgtf-theme-cursor');
		 var moveCursor = function () {
			 var transformCursor = function (x, y) {
				 cursor.css({
					 'transform': 'translate3d(' + x + 'px, ' + y + 'px, 0)'
				 });
			 }
 
			 var handleMove = function (e) {
				 var x = e.clientX - cursor.width() / 2,
					 y = e.clientY - cursor.height() / 2;
 
				 requestAnimationFrame(function () {
					 transformCursor(x, y);
				 });
			 }
 
			 jquery(window).on('mousemove', handleMove);
		 }
 
		 var hoverClass = function () {
			 console.log('hover');
			 var items = 'a, button, .tp-bullet, .tp-withaction, button, .edgtf-pl-filter, .ui-slider-handle, .edgtf-btn .items-center a';
			 var addCSSClass = function () {
				 !cursor.hasClass('edgtf-hovering') && cursor.addClass('edgtf-hovering');
			 }
 
			 var removeCSSClass = function () {
				 cursor.hasClass('edgtf-hovering') && cursor.removeClass('edgtf-hovering');
			 }
 
			 jquery(document).on('mouseenter', items, addCSSClass);
			 jquery(document).on('mouseleave', items, removeCSSClass);
		 }
 
		 var showCursor = function () {
			 !cursor.hasClass('edgtf-visible') && cursor.addClass('edgtf-visible');
		 }
 
		 var hideCursor = function () {
			 cursor.hasClass('edgtf-visible') && cursor.removeClass('edgtf-visible edgtf-hovering');
		 }
 
		 var overrideCursor = function () {
			 cursor.toggleClass('edgtf-override');
		 }
 
		 var controlItems = function () {
			 var items = jquery('.edgtf-video-button-play, .edgtf-btn-circle, .edgtf-pl-more, .edgtf-pl-load-more, .edgtf-page-not-found svg');
 
			 items.length &&
				 items.each(function () {
					 var item = jquery(this),
						 inner = item.children(),
						 coeff = item.data('move') == 'strict' ? 0.5 : 1,
						 limit = 50 * coeff;
 
					 var cX, cY, w, h, x, y, inRange; //position variables
 
					 var updatePosition = function () {
						 cX = cursor.offset().left;
						 cY = cursor.offset().top;
						 w = item.width();
						 h = item.height();
						 x = item.offset().left + w / 2;
						 y = item.offset().top + h / 2;
						 inRange = Math.abs(x - cX) < w * coeff && Math.abs(y - cY) < h * coeff;
					 }
 
					 var coords = function () {
						 return {
							 x: Math.abs(cX - x) < limit ? cX - x : limit * (cX - x) / Math.abs(cX - x),
							 y: Math.abs(cY - y) < limit ? cY - y : limit * (cY - y) / Math.abs(cY - y)
						 }
					 }
 
					 var moveItem = function () {
						 inner.addClass('edgtf-moving');
						 var deltaX = 0,
							 deltaY = 0,
							 dX = coords().x,
							 dY = coords().y;
 
						 var transformItem = function () {
							 deltaX += (coords().x - dX) / 5;
							 deltaY += (coords().y - dY) / 5;
 
							 deltaX.toFixed(2) !== dX.toFixed(2) &&
								 inner.css({
									 'transform': 'translate3d(' + deltaX + 'px, ' + deltaY + 'px, 0)',
									 'transition': 'none'
								 });
 
							 dX = deltaX;
							 dY = deltaY;
 
							 requestAnimationFrame(function () {
								 inRange && transformItem();
							 });
						 }
 
						 transformItem();
					 }
 
					 var resetItem = function () {
						 inner
							 .removeClass('edgtf-moving')
							 .css({
								 'transition': 'transform .6s',
								 'transform': 'translate3d(0px, 0px, 0px)'
							 })
							 .one('cli', function () {
								 inner.removeClass('edgtf-controlled');
								 inner.css({
									 'transition': 'none'
								 });
							 });
					 }
 
					 var setState = function () {
						 updatePosition();
 
						 if (inRange) {
							 !inner.hasClass('edgtf-moving') && moveItem(); //start move
						 } else {
							 inner.hasClass('edgtf-moving') && resetItem(); //end move
						 }
 
						 requestAnimationFrame(setState);
					 }
 
					 requestAnimationFrame(setState);
				 });
		 }
 
		 var changeCursor = function () {
			 var instances = [{
						 type: 'flame',
						 triggers: '.edgtf-portfolio-list-holder .edgtf-pli-link, .edgtf-plh-item > a'
					 },
					 {
						 type: 'cart',
						 triggers: '.add_to_cart_button'
					 },
					 {
						 type: 'move',
						 triggers: 'body:not(.single) .owl-drag .owl-stage-outer'
					 },
					 {
						 type: 'eye',
						 triggers: '.edgtf-image-behavior-two-links-overlay .edgtf-iwt-image a, .edgtf-image-behavior-custom-link .edgtf-iwt-image'
					 },
					 {
						 type: 'close',
						 triggers: '.edgtf-fullscreen-search-holder, .edgtf-fullscreen-menu-holder, .edgtf-cover'
					 }
				 ],
				 triggers = '',
				 hides = '.edgtf-portfolio-info-float .edgtf-pli-link, .edgtf-pls-item-inner, .fluidvids',
				 overrides = 'form, #menu-full-screen-menu, .edgtf-portfolio-slider-holder .edgtf-pl-standard-shader .edgtf-pli-text-holder';
 
			 var setCursor = function (type) {
				 cursor.addClass('edgtf-' + type);
			 }
 
			 var resetCursor = function () {
				 instances.forEach(function (instance) {
					 cursor.removeClass('edgtf-' + instance.type);
				 });
			 }
 
			 instances.forEach(function (instance, i) {
				 triggers += instance.triggers;
				 if (i + 1 < instances.length) triggers += ', ';
 
				 jquery(document).on('mouseenter', instance.triggers, function () {
					 setCursor(instance.type);
				 });
			 });
 
			 jquery(document).on('mouseleave', triggers, resetCursor);
			 jquery(document).on('mouseenter mouseleave', overrides, function () {
				 overrideCursor();
			 });
			 jquery(document).on('mousemove', hides, function () {
				 hideCursor();
			 });
			 jquery(document).on('mouseleave', hides, function () {
				 showCursor();
			 });
			 jquery(document).on('mouseleave', hideCursor);
			 jquery(document).on('mouseenter', showCursor);
		 }
 
		 var blinkClass = function () {
			 jquery(document).on('click', 'a', function (e) {
				 var a = jquery(this);
				 if (
					 e.which === 1 &&
					 a.attr('href').indexOf(window.location.host) >= 0 &&
					 (typeof a.attr('target') === 'undefined' || a.attr('target') === '_self') && // check if the link opens in the same window
					 (a.attr('href').split('#')[0] !== window.location.href.split('#')[0])
				 ) {
					 cursor
						 .removeClass()
						 .addClass('edgtf-blink');
				 }
			 })
		 }
 
		 var init = function () {
			 jquery(document).one('mousemove', function () {
				 showCursor();
				 console.log('show');
			 });
			 moveCursor();
			 hoverClass();
			 controlItems();
			 changeCursor();
			 blinkClass();
		 }
 
		 return {
			 init: function () { 
				 console.log('cursor init'); 
				init();
			 }
		 }
	 }

	 edgtfThemeCursor().init();	 
});
</script>