/* ------------------------------------------------------------------------------- */
/* ----------------------------- TEMPLATE OPTIONS -------------------------------- */
/* ------------------------------------------------------------------------------- */

	if (typeof(ef_js_vars.post_slider) !== 'undefined') {
		var p_transition = ef_js_vars.post_slider.fx,
			p_transition_speed = ef_js_vars.post_slider.speed,
			p_slide_interval = ef_js_vars.post_slider.interval,
			p_autoplay = ef_js_vars.post_slider.autoplay == '1' ? true : false,
			p_infinite = ef_js_vars.post_slider.infinite == '1' ? true : false;
	}

	var portfolio_class = 'page-template-templatesportfolio-template-php';

	if (typeof(ef_js_vars.messages) != "undefined") {
		var finishedMsg_ = ef_js_vars.messages['finished_msg'],
			msgText_ = ef_js_vars.messages['loading_msg'],
			loading_p = ef_js_vars.messages['site_loading'];
	} else {
		var finishedMsg_ = 'No more posts to load',
			msgText_ = 'Loading the next set of posts',
			loading_p = 'Loading...';
	}

	/* Global CSS3 transforms/transitions */

	var css_engine = true, // Uses transitions/transforms in modern browsers with css3 support. It's global option for the whole template except main slideshow. It has its own option

		default_col_ = '#f1b669';
		main_color_ = typeof(ef_js_vars.main_color) != 'undefined' ? ef_js_vars.main_color : default_col_, // Necessary for replaced scroll

		/* Fullscreen slider */

		slider_options = typeof(ef_js_vars.bg_slider) !== 'undefined' ? ef_js_vars.bg_slider : {css_engine: true},

		/* Background video */

		// Include all these types for better compatibility with browsers

		vids = typeof(ef_js_vars.bg_video) !== 'undefined' ? ef_js_vars.bg_video : false,

		/* Post slider */

		postslider = jQuery('.ef-post-carousel'),
		postslider_options = {
			transition: typeof(p_transition) != 'undefined' ? p_transition : 'fade',
			transition_speed: typeof(p_transition_speed) != 'undefined' ? parseInt(p_transition_speed, null) : 1000,
			slide_interval: typeof(p_slide_interval) != 'undefined' ? parseInt(p_slide_interval, null) : 2000,
			autoplay: typeof(p_autoplay) != 'undefined' ? p_autoplay : false,
			loop: typeof(p_infinite) != 'undefined' ? p_infinite : false
		},

		/* Portfolio */

		ajax_posts = typeof(ef_js_vars.ajax_posts) !== 'undefined' ? ef_js_vars.ajax_posts : false,
		portfolio_group = 'portfolio-group', // Grouping photos for lightbox

		/* Gallery */

		gallery = jQuery('#ef-gallery'),
		gallery_options = {
			transition_speed: 800,
			startAt: ajax_posts && ajax_posts.start_first != '0' ? 0 : 1, // Set to 0 if you need to show slideshow from a very first slide
			prevText: "Previous Photo",
			nextText: "Next Photo",
			navigation: true
		},

		/* Google Maps */

		googmap = jQuery('#ef-map'),
		zoomLevel = typeof(ef_js_vars.map_zoom) !== 'undefined' ? parseInt(ef_js_vars.map_zoom, null) : 20,
		map_markers = typeof(ef_js_vars.map_markers) !== 'undefined' ? ef_js_vars.map_markers : false,
		map_type = typeof(ef_js_vars.map_type) !== 'undefined' && ef_js_vars.map_type ? ef_js_vars.map_type : "ROADMAP",

		/* Nicescroll activation */

		hasNiceScroll = ef_js_vars.has_scroll,
		adaptiveHead_ = typeof(ef_js_vars.adaptive_header) !== 'undefined' ? ef_js_vars.adaptive_header : false;

		/* Demo */

		if (ef_js_vars.demo_mode) {
			slider_options.transition = ef.cookie('wpfidelityTrans') ? ef.cookie('wpfidelityTrans') : 'fade';
			main_color_ = ef.cookie('wpfidelityColor') ? ef.cookie('wpfidelityColor') : default_col_;
		}

/* ------------------------------------------------------------------------------- */
/* ------------------------------------------------------------------------------- */
/* ------------------------------------------------------------------------------- */