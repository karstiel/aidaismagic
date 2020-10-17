var ef = jQuery;
ef.noConflict();

/*-------------------------------------------------------*/
/*------------------- Main Variables --------------------*/
/*-------------------------------------------------------*/

/* Accordion Class */
var $accClass = ef(".ef-uiaccordion");
/* Toggle Panels Class */
var $toggleClass = ef(".ef-toggle");
/* Progressbars class */
var progressClass = ef('.ef-progress-bar');

/*-------------------------------------------------------*/
/*-------------------------------------------------------*/
/*-------------------------------------------------------*/

ef(document).ready(function() {

	/*Skill graphs*/
	var progresss = (function() {
		var delay_ = 0;
		ef(this).find('div').each(function() {
			var lc = ef(this).attr('data-id'),
				pc = lc + '%';
			ef(this).append('<span></span><div><i>' + lc + '</i></div>');
			ef(this).children('div').delay(200).animate({
				'width': pc
			}, 1500, 'easeOutExpo', function(){
				ef(this).children().each(function() {
					ef(this).css({display: 'block'}).delay(delay_).animate({opacity: '1', top: '-40px'});
					delay_ += 200;
				});
			});
		});
	});

	progressClass.one('inview', progresss);

	/*jQuery UI Accordion*/
	$accClass.accordion({
		heightStyle: "content"
	});


	/*Toggles*/
	$toggleClass.addClass("ui-accordion ui-accordion-icons ui-widget ui-helper-reset")
		.find("h4")
		.addClass("ui-accordion-header ui-helper-reset ui-state-default ui-corner-top ui-corner-bottom")
		.prepend('<span class="ui-accordion-header-icon ui-icon ui-icon-triangle-1-e"></span>')
		.click(function() {
			ef(this)
				.toggleClass("ui-accordion-header-active ui-state-active ui-state-default ui-corner-bottom")
				.find("> .ui-icon").toggleClass("ui-icon-triangle-1-e ui-icon-triangle-1-s").end()
				.next().toggleClass("ui-accordion-content-active").slideToggle();
			return false;
		})
		.next()
		.addClass("ui-accordion-content  ui-helper-reset ui-widget-content ui-corner-bottom")
		.hide();


	/*jQuery UI Tabs*/
	ef('.ef-tabs').tabs({
		heightStyle: 'content',
		active: 0
	});

});