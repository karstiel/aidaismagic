var ef=jQuery;
	ef.noConflict();

ef(document).foundation();

	/* Static variables/objects/classes */

	var	body_ 				= ef('body'),
		page_ 				= ef('#ef-page'),
		head_ 				= ef('#ef-header'),
		page_head_ 			= ef('#ef-page-header'),
		full_slider 		= ef('.fireform-slider').length ? ef('.fireform-slider') : false,
		video_ 				= ef('.ef-video-bg'),
		overlay_ 			= ef('.ef-overlay').length ? ef('#ef-slider-overlay') : ef(),
		footer_ 			= ef('#ef-footer'),
		widgets_tab 		= ef('#ef-widgets-tab'),
		widgets 			= ef('#ef-widgets'),
		widgets_pane 		= ef('#ef-widgets-pane'),
		scrolls_ 			= body_.add(widgets_pane),
		full_page_class 	= 'ef-fullwidth-page',
		home_class 			= 'page-template-templateshome-template-php',
		blog_ 				= ef('.page-template-templatesblog-template-php'),
		portFolio_ 			= ef('.page-template-templatesportfolio-template-php'),
		fullscreen_class 	= 'ef-fullscreen-mode',
		isotope_container 	= ef('.ef-isotope'),
		portfolio_filter 	= ef('#ef-filter'),
		exifSlider 			= ef('#ef-exif-slider'),
		cForm 				= ef('#ef-contact-form'),
		nameFieldClass 		= '.ef-name',
		emailFieldClass 	= '.ef-email',
		messageFieldClass 	= '.ef-message',
		support_transitions = Modernizr.csstransitions ? true : false,
		breakpoint 			= 801,
		isotope_speed		= 600,
		infiniteScrollDid	= false,
		fake_head_ 			= ef('.ef-fake-header'),
		triggerIsotope_ 	= false,
		efSidebar 			= ef('#ef-sidebar'),
		refreshShadowboxFunc = false,
		wpadmin;

	
	/* Helpers */

	ef.fn.global_transition = support_transitions && css_engine ? ef.fn.transition : ef.fn.animate;
	ef.fn.slideshow_transition = (support_transitions && slider_options.css_engine) ? ef.fn.transition : ef.fn.animate;

	var isMobile = Modernizr.touch || ef.browser.mobile || navigator.userAgent.match( /Windows Phone/ ) || navigator.userAgent.match( /Zune/ ),

		niceScroll_pos = (function(){
			if (!body_.hasClass(full_page_class)) {
				ef('#ascrail2000').css({left: page_.outerWidth() + head_.outerWidth()});
			}
		}),

		delay_fn = (function(){
			var timer = 0;
			return function(callback, ms){
				clearTimeout (timer);
				timer = setTimeout(callback, ms);
			};
		})(),

		vertCenterGallery = (function() {
			wpadmin = ef('#wpadminbar').length ? 32 : 0;
			ef('.ef-gal-img').each(function() {
				ef(this).css({
					marginTop: (ef(this).parent().parent().height() - ef(this).outerHeight()) / 2
				});
			});
			if (ef(window).width() >= breakpoint && body_.hasClass(full_page_class)) {
				ef('#ef-gallery-wrapper').css({
					marginTop: (ef(window).height() - wpadmin - ef('#ef-gallery-info-pane').outerHeight() - page_head_.height() - footer_.outerHeight() - ef('#ef-gallery-wrapper').height())/2
				});			
			} else {
				ef('#ef-gallery-wrapper').css({
					marginTop: 'auto'
				});
			}
		}),

		vertCenterCaption = (function(desc_obj) {
			header_hgt = ef(window).width() <= breakpoint && ef(window).height() <= 480 ? head_.height() : 0;
			desc_obj.css({
				top: (ef('.fireform-slider-wrapper').height()-desc_obj.height())/2+header_hgt
			});
		}),

		resetFlexInterval = (function(_data){
			if (_data.vars.slideshow) {
				clearInterval(_data.animatedSlides);
				_data.animatedSlides = null;
				_data.animatedSlides = setInterval(_data.animateSlides, _data.vars.slideshowSpeed);
				ef('#progress-bar').finish();
			}
		}),

		getSlideCounter = (function(activeIndex, totalLength){
			return (activeIndex+1) + " / " + totalLength;
		}),

		shifTSb = (function(){
			efSidebar.css({
				marginTop: ef(window).width()>breakpoint ? ef('.ef-logo-wrapper').height()+ef('#ef-topbar-wrapper').height()-9 : 'auto'
			});
		}),

		colWidth = (function(){
			var w = ef(window).width(),
				columnWidth = 0,
				columnNum = 0;

			if (body_.hasClass('ef-classic-blog')) {
				columnNum = 1;
			} else if (body_.hasClass(full_page_class)) {
				if (w <= 1600 && w > 1200) {
					columnNum = 6;
				} else if (w <= 1200 && w > 990) {
					columnNum = 5;
				} else if (w <= 990 && w > breakpoint) {
					columnNum = 4;
				} else if (w <= breakpoint && w > 680) {
					columnNum = 3;
				} else if (w <= 680 && w > 481) {
					columnNum = 2;
				} else if (w <= 481) {
					columnNum = 1;
				} else {
					columnNum = 7;
				}
			} else {
				if (blog_.length) {
					if (w <= 990 && w > breakpoint) {
						columnNum = 1;
					} else if (w <= breakpoint && w > 481) {
						columnNum = 2;
					} else if (w <= 481) {
						columnNum = 1;
					} else {
						columnNum = 2;
					}
				} else {
					if (w <= 481) {
						columnNum = 1;
					} else {
						columnNum = 2;
					}
				}
			}

			columnWidth = Math.floor(isotope_container.width()/columnNum)-1;

			if (body_.hasClass(full_page_class)) {
				fake_head_.css({
					height: w > breakpoint ? (ef('.ef-logo-wrapper').height()+ef('#ef-topbar-wrapper').height())-page_head_.height() : '',
					width: columnWidth
				});
			}

			ef('.ef-post').each(function() {
				ef(this).css({
					width: columnWidth
				});
			});

			return columnWidth;
		}),

		triggerIsotope = (function(){
			isotope_container.isotope({
				masonry: {
					columnWidth: colWidth()
				}
			});
		}),

		refreshShadowbox = (function(){

			var VisibleItems = ef('.ef-lightbox').filter(':visible');

			Shadowbox.clearCache();
			Shadowbox.setup(VisibleItems, {
				gallery: portfolio_group
			});

			return true;
		}),

		adjustAdaptiveHead = (function(){
			if (adaptiveHead_ && body_.hasClass(full_page_class)) {

				var topBhgt,
					topBopacity,
					offsetWin,
					generOffset;

				if (ef(window).width() >= breakpoint) {

					topBhgt = ef('#ef-topbar-wrapper').height()-10;
					offsetWin = ef(window).scrollTop();
					generOffset = topBhgt - offsetWin;
					topBopacity = (generOffset * 100 / topBhgt) * 0.01;
					margTopBar = generOffset > 0 ? -offsetWin : -topBhgt;

					ef('.top-bar').css({
						opacity: topBopacity,
						marginTop: margTopBar
					});

				} else {
					ef('.top-bar').css({marginTop: '', opacity: ''});
				}
			}
		});

	ef.fn.percentAge = function(pers){
		ef(this).animate({
			width: '100%'
		}, pers, function(){
			ef(this).css({width: '0px'});
		});
	};

	ef.fn.adjustImagePositioning = function() {
		var wdt = ef(this).parent().width(),
			hgt = ef(this).parent().height();

		ef(this).find('img').each(function(){
			var efimg = ef(this);

			var r_w = hgt / wdt,
				i_w = efimg.width(),
				i_h = efimg.height(),
				r_i = i_h / i_w,
				new_w, new_h, new_left, new_top;

			if (r_w > r_i || (typeof(slider_options.cover) != 'undefined' && !slider_options.cover)) {
				new_h = hgt;
				new_w = hgt / r_i;
			} else {
				new_h = wdt * r_i;
				new_w = wdt;
			}

			efimg.css({
				width: new_w,
				height: new_h,
				left: (wdt - new_w) / 2,
				top: (hgt - new_h) / 2
			});
		});
	};

	ef.fn.appendLoadingMsg = function() {

		$addTop = '';
		wpadmin = ef('#wpadminbar').height();

		ef(this).append('<p id="ef-loading-msg"><span data-text="'+loading_p+'">'+loading_p+'</span></p>');

		if (!body_.hasClass(home_class)) {
			if (ef(window).width() >= breakpoint) {
				if (!gallery.length) {
					$addTop = ( ef(window).height()-page_head_.height()-wpadmin )/2;
				}
			} else {
				if (!gallery.length) {
					$addTop = '200px';
				}
			}
		}
		
		ef('#ef-loading-msg').css({
			top: $addTop,
			marginTop: - ef('#ef-loading-msg').height() / 2
		});
	};

	/* Ultra simple slideshow for portfolio feed */

	ef.fn.fadeShow = (function(){

		return ef(this).each(function() {

			if (ef(this).find('img').length < 2) return;

			var efthis_ = ef(this),
				slides = efthis_.find('li'),
				ImgLowest = slides.eq(0).find('img'),
				ImgFirst = ImgLowest;

				slides.each(function(){
					var thisImg = ef(this).find('img');
					if (thisImg.height() < ImgLowest.height()) {
						ImgLowest = ef(thisImg);
					}
				});

			var	lowestSlideHt = ImgLowest.height(),
				lowestSlideWt = ImgLowest.width();
				
				efthis_.css({
					height: lowestSlideHt
				});

				slides.not(":first").css({
					display: 'none'
				});

			var	lastElem = slides.length-1,
				target,
				prevItem,
				propIndex = lowestSlideHt/lowestSlideWt,
				newFadeShowHeight = (function(){
					efthis_.add(slides).css({
						height: Math.round(slides.width()*propIndex)
					});
				}),
				fadeSpeed = 1000,
				slideInterval = (efthis_.data('interval') && efthis_.data('interval') !== '') ? efthis_.data('interval') : 4000,
				sliderResponse = (function(target) {

					if (efthis_.is(':visible') && (triggerIsotope_ === true || efthis_.height() < slides.width()*propIndex)) {
						triggerIsotope_ = false;

						newFadeShowHeight();
						isotope_container.isotope('layout');
					
					}

					slides.css({zIndex: ''}).eq(target).css({
						display: 'block',
						zIndex: '1',
						opacity: '0'
					}).global_transition({
						opacity: '1'
					}, fadeSpeed, function(){
						prevItem = target === 0 ? slides.eq(lastElem) : ef(this).prev();
						prevItem.css({
							display: 'none'
						});
					});
					slides.removeClass('ef-active-slide').eq(target).addClass('ef-active-slide');
				}),
				sliderTiming = (function() {
					if (efthis_.is(':visible')) {
						target = efthis_.find('.ef-active-slide').index();
						target = target === lastElem ? 0 : target+1;
						sliderResponse(target);
					}
				}),
				stopSlider = (function(){
					clearInterval(timingRun);
				}),
				timingRun = (function(){
					setInterval(function() {
						sliderTiming();
					},slideInterval);
				}),
				resetTiming = (function() {
					clearInterval(timingRun);
					timingRun = setInterval(function() {
						sliderTiming();
					},slideInterval);
				});

			ef(window).smartresize(function() {
				newFadeShowHeight();
				triggerIsotope_ = true;
			});

			slides.first().addClass('ef-active-slide');
			newFadeShowHeight();
			slides.css({position: 'absolute'});
			resetTiming();
		});
	});

	ef.fn.img_loaded = function(){
		ef(this).each(function(){
			var thisImgContainer = ef(this);
			thisImgContainer.imagesLoaded(function(){
				thisImgContainer.find('.ef-preloader').fadeOut();
			});
		});
	};

	var buildSliderVideo = (function() {

		if (body_.hasClass('fireform-slider')) {

			ef('#ef-header').after('<div class="fireform-slider-wrapper"></div>');

			if (!body_.hasClass(full_page_class) || (body_.hasClass(home_class) && body_.hasClass(full_page_class))) {
				
				ef('#ef-page-controls').append('<a href="#" id="ef-tray-button" class="icn-ef disabled"><span id="progress-back"><span id="progress-bar"></span></span></a>');
				
				if (video_.length) {
					ef('#ef-copyrights').prepend('<div id="ef-slider-controls"><div class="ef-slider-ctrl-inner"><a href="#" id="ef-video-play" class="icn-pause"></a><a href="#" id="ef-video-sound" class="icn-volume-up"></a></div></div>');
				} else {

					if (typeof(slider_options.slides) != 'undefined' && slider_options.slides.length > 1) {
						ef('#ef-copyrights').prepend('<div id="ef-slider-controls"><div class="ef-slider-ctrl-inner" style="display: none;"><a id="prevslide" class="icn-ef"></a><div id="slidecounter"></div><a id="nextslide" class="icn-ef"></a></div></div>');
					}

					/* Build main slider structure */

					ef('.fireform-slider-wrapper').html('<div class="fireform-slider-inner"><ul class="slides"></ul></div>');

					if (body_.hasClass(home_class)){
						ef('.fireform-slider-wrapper').appendLoadingMsg();
					}
					
					ef('<div id="ef-thumb-list"><div id="ef-thumb-list-inner"><ul class="slides"></ul></div></div>').insertAfter('.fireform-slider-wrapper');
					ef.each(slider_options.slides, function(ind) {
						var slide, thumb;
						if (typeof(slider_options.slides[ind].image) !== 'undefined'){
							var img_ = isMobile && ef(window).width() <= 1025 && typeof(slider_options.slides[ind].mobile_image) !== 'undefined' ? slider_options.slides[ind].mobile_image : slider_options.slides[ind].image,
								img_m = slider_options.slides[ind].mobile_image,
								thumb_ = typeof(slider_options.slides[ind].thumb) !== 'undefined' ? slider_options.slides[ind].thumb : img_;

							slide = '<li class="ef-slide"><img src="'+img_+'" alt="" /></li>';
							thumb = '<li class="ef-thumb"><img src="'+thumb_+'" alt="" /></li>';
						}
						ef('.fireform-slider-inner .slides').append(slide);
						ef('#ef-thumb-list-inner .slides').append(thumb);
						ind++;
					});
				}
			}
		} else if (video_.length) {
			ef('#ef-page-controls').append('<a href="#" id="ef-tray-button" class="icn-ef disabled"><span id="progress-back"><span id="progress-bar"></span></span></a>');
			ef('#ef-copyrights').prepend('<div id="ef-slider-controls"><div class="ef-slider-ctrl-inner"><a href="#" id="ef-video-play" class="icn-pause"></a><a href="#" id="ef-video-sound" class="icn-volume-up"></a></div></div>');
		}
	});

	/* Lightbox init */

	var play = false,
		cycle,
		slideSpeed = 4000,
		keycodes = new Array(37, 39),
		runSBslideshow = (function(){
			cycle = setTimeout(function(){
				Shadowbox.next();
			}, slideSpeed);
			ef('#sb-progress').find('span').finish().css({width: '0'}).animate({
				width: '100%'
			}, slideSpeed);
			play = true;
		}),
		stopSlideshow = (function(){
			clearTimeout(cycle);
			ef('#sb-progress').find('span').finish().css({width: '0'});
			ef('#sb-info-inner').removeClass('sb-playing');
			play = false;
		});

	Shadowbox.init({
		overlayOpacity: 0.85,
		viewportPadding: 20,
		continuous: true,
		modal: false,
		enableKeys: true,
		onOpen: function() {

			/* Close button */

			ef('<div id="sb-custom-close">&times;</div>').bind('click', function() {
				Shadowbox.close();
			}).appendTo('#sb-container');

			/* Title */


			var sbTitle = ef('#sb-title').clone();
			ef('#sb-title').remove();
			sbTitle.prependTo('#sb-info');

			/* Navigation */

			if (Object.keys(Shadowbox.cache).length > 1) {
				ef('<div id="sb-custom-prev"></div><div id="sb-custom-next"></div><div id="sb-custom-play"></div>').appendTo('#sb-info-inner');
				ef('<div id="sb-progress"><span></span></div>').appendTo('#sb-info');
				
				ef('#sb-custom-prev').bind('click', function() {
					Shadowbox.previous();
				});
				ef('#sb-custom-next').bind('click', function() {
					Shadowbox.next();
				});
				ef('#sb-custom-play').bind('click', function() {
					_this = ef(this);
					if (play === false) {
						runSBslideshow();
						_this.parent().addClass('sb-playing');
						ef(document).bind('keydown', function(e) {
							if (ef.inArray(e.which, keycodes) > -1) stopSlideshow();
						});
					} else {
						stopSlideshow();
					}
				});
				ef('#sb-info-inner').css({display: 'block'});
			}
			
			ef('#sb-title, #sb-custom-close').css({display: 'block'});
		},
		onFinish: function(){
			ef('#sb-container').addClass('sb-opened');
			if (play === true) runSBslideshow();
		},
		onClose: function(){
			stopSlideshow();
			ef('#sb-container').removeClass('sb-opened');
			ef('#sb-custom-prev, #sb-progress, #sb-custom-next, #sb-custom-play, #sb-custom-close').remove();
			ef('#sb-custom-close, #sb-info-inner, #sb-title').css({display: 'none'});
		},
		displayNav: false
	});

ef(document).ready(function() {

	/* Sidebar */

	setTimeout(function() {
		efSidebar.css({opacity: 1});
		shifTSb();
	}, 1000);

	adjustAdaptiveHead();

	ef(document).on('scroll', function() {
		adjustAdaptiveHead();
	});
	

	/* Replacing *.svg by *.png in old browsers. Make sure you have 2 copies (svg+png) if you are using svg on your site */

	if (!Modernizr.svg) {
		ef('img[src*="svg"]').attr('src', function() {
			return ef(this).attr('src').replace('.svg', '.png');
		});
	}

	/* Tweaking submit */

	ef('#commentform').find('input#submit').addClass('btn btn-sm btn-primary');

	/* Preventing empty search */

	ef('.ef-searchform').submit(function(a) {
		var s = ef(this).find("#s");
		if (!s.val()) {
			a.preventDefault();
			s.focus();
		}
	});

	/* Search in footer */

	ef('#ef-show-hide-search').click(function() {
		ef('.ef-footer-search').toggleClass('ef-open-search');
		if (ef('.ef-footer-search').hasClass('ef-open-search')) {
			ef('.ef-copyright-text').css({display: 'none'});
			ef(this).removeClass('icn-search').addClass('icn-cancel').next().find('#s').focus();
		} else {
			ef('.ef-copyright-text').css({display: ''});
			ef(this).removeClass('icn-cancel').addClass('icn-search');
		}
	});

	/* Lightbox requires rel attribute, but it isn't valid in this context, so... */

	ef('a[data-sbrel]').each(function() {
		ef(this).attr('rel', ef(this).data('sbrel'));
	});

	/* Lightbox for WP native gallery */

	ef('div.gallery').each(function() {
		var gsrc = ef('a:first > img', this).attr('src');
		var gurl = ef('a:first', this).attr('href');
		if (gurl.substr(-3, 3) == gsrc.substr(-3, 3)) {
			ef('a', this).addClass('ef-lightbox').attr('data-sbrel', 'wp-native-gallery');
		}
	});

	/* Portfolio lightbox */

	Shadowbox.setup('.ef-lightbox',{
		gallery: portfolio_group
	});

	/* Html injections */

	if (typeof(slider_options.slides) != 'undefined' || video_.length) {
		buildSliderVideo();
	}

	var tray_button_ = ef('#ef-tray-button');

	/* Preloader */

	ef('.ef-slider-holder, .ef-proj-img, .ef-featured-img').img_loaded();

	/* Fullscreen background video */

	var vid_loaded = (function() {
		tray_button_.removeClass('disabled');
		body_.append('<div id="ef-thumb-list" style="height: 0;"></div>');
		ef('#big-video-wrap').css({
			display: 'block',
			opacity: '0'
		}).global_transition({
			opacity: '1'
		},1000);
		vidDesc();
	});

	if (typeof(vids) == 'object' && video_.length && (!body_.hasClass(full_page_class) || body_.hasClass(home_class))) {

		var d = typeof(vids.description) !== 'undefined' ? vids.description : 'ef-top-left',
			pos = typeof(vids.position) !== 'undefined' ? vids.position : '',
			vidDesc = (function(){
				ef('#slide_desc').addClass(pos).html(d).css({
					display: 'block',
					opacity: '0'
				}).global_transition({
					opacity: '1'
				},1000);
			});

		if (Modernizr.video && !(isMobile || ef.browser.opera || /opr/.test(navigator.userAgent.toLowerCase()))) {
			var vid_source = vids.mp4V,
				vid_alt_source = Modernizr.video.webm && typeof(vids.webmV) !== 'undefined' ? vids.webmV : '',
				bigVid = new ef.BigVideo({useFlashForFirefox:false});

			bigVid.init();
			bigVid.show(vid_source,{altSource: vid_alt_source, ambient: false, doLoop:true});
			var player = bigVid.getPlayer();
			player.on('loadeddata', vid_loaded);
		} else if (typeof(vids.imageV) !== 'undefined') {
			ef('#ef-header').after('<div class="fireform-slider-wrapper"></div>');
			body_.addClass('fireform-slider');
			var vid_img = ef('.fireform-slider-wrapper');
			vid_img.html('<div class="fireform-slider-inner"><img src="'+vids.imageV+'" alt="" /></div>');
			vid_img.imagesLoaded(function(){
				ef('.fireform-slider-inner').css({
					visibility: 'visible',
					opacity: '0',
					overflow: 'hidden'
				}).global_transition({
					opacity: '1'
				},1000).adjustImagePositioning();
				vid_loaded();
			});
		}
		var vid_play = true;
		ef('#ef-video-play').click(function() {
			if (vid_play) {
				ef(this).removeClass('icn-pause').addClass('icn-play');
				bigVid.getPlayer().pause();
			} else {
				ef(this).removeClass('icn-play').addClass('icn-pause');
				bigVid.getPlayer().play();
			}
			vid_play = !vid_play;
			return false;
		});
		var vid_sound = true;
		ef('#ef-video-sound').click(function() {
			if (vid_sound) {
				ef(this).removeClass('icn-volume-up').addClass('icn-volume-off');
				bigVid.getPlayer().volume(0);
			} else {
				ef(this).removeClass('icn-volume-off').addClass('icn-volume-up');
				bigVid.getPlayer().volume(1);
			}
			vid_sound = !vid_sound;
			return false;
		});
	}

	/* Main Nicescroll */

	if (!isMobile && hasNiceScroll) {
		body_.niceScroll({
			cursorcolor: main_color_,
			cursorwidth: '10px',
			cursorborder: 'none',
			cursorborderradius: '0',
			zindex: 11,
			autohidemode: body_.hasClass(full_page_class) ? true : false,
			background: 'rgba(255,255,255,0.4)'
		});
		body_.getNiceScroll().hide();
	}

	/* Widgets pane */

	var pane_height = (function(){
		if (Modernizr.mq('only screen and (min-width: '+breakpoint+'px)')) {
			widgets.css({
				maxHeight: ef(window).height()-page_head_.height()-ef('#wpadminbar').height()-footer_.height()
			});
		} else {
			widgets.css({
				maxHeight: '280px'
			});
		}
	});

	pane_height();

	if (widgets_pane.length) {
		widgets_pane.global_transition({
			y: -widgets_pane.outerHeight()
		},1);

		if (!isMobile && hasNiceScroll) {
			widgets.niceScroll({
				cursorcolor: main_color_,
				cursorwidth: '10px',
				cursorborder: 'none',
				cursorborderradius: '0',
				autohidemode: true,
				background: 'rgba(255,255,255,0.2)'
			}).hide();
		}
	}

	widgets_tab.click(function(a) {

		ef(this).toggleClass('ef-show-widgets');
		if (ef(this).hasClass('ef-show-widgets')) {
			widgets_pane.css({
				display: 'block'
			}).global_transition({
				y: '0px'
			}, 400, "easeOutCubic", function(){
				ef(this).getNiceScroll().show();
				widgets.addClass('w-opened');
			});
		} else {
			widgets.removeClass('w-opened');
			widgets_pane.global_transition({
				y: -widgets_pane.outerHeight()
			}, 400, "easeOutCubic", function(){
				ef(this).css({
					display: 'none'
				});
			}).getNiceScroll().hide();
		}
		
		a.preventDefault();
	});

	ef('html').click(function(a){
		if ( (ef(a.target).closest('#ef-page-header *, #sb-container *').length === 0) && widgets_tab.hasClass('ef-show-widgets') ) {
			widgets_tab.click();
		}
	});

	/* Fullscreen mode */

	if (!body_.hasClass(full_page_class)) {
		var anim_duration = 500;

		tray_button_.click(function() {
			var this_b = ef(this);

			if (support_transitions && css_engine) {

				if (!body_.hasClass(fullscreen_class)) {

					this_b.addClass('disabled');
					body_.css({
						height: '100%'
					}).getNiceScroll().hide();
					footer_.transition({
						y: footer_.height(),
						duration: anim_duration,
						easing: 'easeOutCubic',
						complete: function() {
							ef(this).css({
								display: 'none'
							});
						}
					});
					page_head_.transition({
						opacity: '0',
						left:  body_.hasClass(home_class) ? '' : '-150px',
						y: -page_head_.outerHeight()
					});
					page_.css({
						maxHeight: '100%',
						overflow: 'hidden'
					}).transition({
						y: -ef(window).height(),
						x: '-150px',
						opacity: '0',
						duration: anim_duration,
						easing: 'easeOutCubic',
						complete: function() {
							if (widgets_tab.hasClass('ef-show-widgets')) {
								widgets_tab.click();
							}
							page_.css({display: 'none'});
							body_.addClass(fullscreen_class);
							head_.transition({
								y: -head_.height(),
								x: '-150px',
								opacity: '0',
								duration: anim_duration,
								easing: 'easeOutCubic',
								complete: function(){
									ef(this).css({
										display: 'none'
									});
									ef('#ef-thumb-list').css({
										visibility: 'visible'
									}).transition({
										y: -ef('#ef-thumb-list').outerHeight(),
										duration: anim_duration,
										easing: 'easeOutCubic',
										complete: function(){
											overlay_.transition({
												opacity: '0',
												complete: function(){
													ef(this).css({
														display: 'none'
													});
												}
											});
											page_head_.css({
												left: '0px'
											}).transition({
												x: '0px',
												y: '0px',
												opacity: '1'
											});
											page_.transition({
												duration: anim_duration,
												complete: function(){
													this_b.removeClass('disabled');
													if (full_slider && typeof(main_slideshow) != 'undefined') {
														main_slideshow.parent().css({zIndex: 'auto'});
													}
												}
											});
										}
									});
								}
							});
						}
					});

				} else {

					this_b.addClass('disabled');

					if (full_slider && typeof(main_slideshow) != 'undefined') {
						main_slideshow.parent().css({zIndex: ''});
					}

					page_head_.transition({
						y: -page_head_.outerHeight(),
						opacity: '0',
						complete: function() {
							body_.removeClass(fullscreen_class);
							ef(this).css({left: ''});
							ef('#ef-thumb-list').transition({
								y: '0px',
								duration: anim_duration,
								easing: "easeOutCubic",
								complete: function() {
									ef(this).css({
										visibility: 'hidden'
									});
									head_.css({
										display: 'block'
									}).transition({
										y: '0px',
										x: '0px',
										opacity: '1',
										duration: anim_duration,
										easing: "easeOutCubic",
										complete: function() {
											footer_.css({
												display: 'block'
											}).transition({
												y: '0px',
												duration: anim_duration,
												easing: "easeOutCubic"
											});

											page_.css({
												display: 'block'
											}).transition({
												y: '0px',
												x: '0px',
												opacity: '1',
												duration: anim_duration,
												easing: "easeOutCubic",
												complete: function() {
													page_head_.transition({
														y: '0px',
														opacity: '1'
													});

													if (isotope_container.length) triggerIsotope();

													page_.css({
														overflow: 'visible',
														maxHeight: 'none'
													});
													body_.css({
														height: 'auto'
													}).getNiceScroll().show().resize();
													overlay_.css({
														display: 'block'
													}).transition({
														opacity: '1'
													});
													this_b.removeClass('disabled');
												}
											});
										}
									});
								}
							});
						}
					});
				}

			} else {

				if (!body_.hasClass(fullscreen_class)) {
					this_b.addClass('disabled');
					body_.css({
						height: '100%'
					}).getNiceScroll().hide();
					footer_.animate({
						bottom: -footer_.height()
					}, {
						duration: anim_duration,
						specialEasing: {
							bottom: "easeOutCubic"
						}, complete: function() {
							ef(this).css({
								display: 'none'
							});
						}
					});
					page_head_.animate({
						opacity: '0',
						top: -page_head_.outerHeight()
					}, anim_duration, "easeOutCubic");
					page_.css({
						maxHeight: '100%',
						overflow: 'hidden'
					}).animate({
						top: '-100%',
						opacity: '0',
						left: '-150px'
					}, {
						duration: anim_duration,
						specialEasing: {
							top: "easeInCubic",
							opacity: "easeOutCubic",
							left: "easeInCubic"
						}, complete: function() {
							if (widgets_tab.hasClass('ef-show-widgets')) {
								widgets_tab.click();
							}
							body_.addClass(fullscreen_class);
							head_.animate({
								top: -head_.height(),
								opacity: '0',
								left: '-150px'
							}, {
								duration: anim_duration,
								specialEasing: {
									top: "easeInCubic",
									opacity: "easeOutCubic",
									left: "easeInCubic"
								}, complete: function() {
									ef(this).css({
										display: 'none'
									});
									ef('#ef-thumb-list').css({
										visibility: 'visible'
									}).animate({
										bottom: '0px'
									}, {
										duration: anim_duration,
										specialEasing: {
											bottom: "easeOutCubic"
										}, complete: function(){
											overlay_.fadeOut();
											page_head_.css({left: '0px'}).animate({
												opacity: '1',
												top: '0px'
											});
											page_.animate({
												opacity: '1'
											}, anim_duration);
											this_b.removeClass('disabled');
											if (full_slider && typeof(main_slideshow) != 'undefined') {
												main_slideshow.parent().css({zIndex: 'auto'});
											}
										}
									});
								}
							});
						}
					});

				} else {
					this_b.addClass('disabled');

					if (full_slider && typeof(main_slideshow) != 'undefined') {
						main_slideshow.parent().css({zIndex: ''});
					}

					page_.css({
						opacity: '0'
					});
					page_head_.animate({
						opacity: '0',
						top: -page_head_.outerHeight()
					}, anim_duration, "easeInCubic");
					ef('#ef-thumb-list').animate({
						bottom: -ef('#ef-thumb-list').outerHeight()
					}, {
						duration: anim_duration,
						specialEasing: {
							bottom: "easeInCubic"
						}, complete: function() {
							body_.removeClass(fullscreen_class);
							ef(this).css({
								visibility: 'hidden'
							});
							head_.css({
								display: 'block'
							}).animate({
								top: '0px',
								opacity: '1',
								left: '0px'
							}, {
								duration: anim_duration,
								specialEasing: {
									top: "easeOutCubic",
									opacity: "easeInCubic",
									left: "easeOutCubic"
								}, complete: function() {
									footer_.css({
										display: 'block'
									}).animate({
										bottom: '0px'
									}, {
										duration: anim_duration,
										specialEasing: {
											bottom: "easeOutCubic",
										}
									});
									page_.animate({
										top: '0px',
										opacity: '1',
										left: '0px'
									}, {
										duration: anim_duration,
										specialEasing: {
											top: "easeOutCubic",
											opacity: "easeInCubic",
											left: "easeOutCubic"
										}, complete: function() {

											if (isotope_container.length) triggerIsotope();

											page_head_.css({left: ''}).animate({
												opacity: '1',
												top: '0px'
											});
											page_.css({
												overflow: 'visible',
												maxHeight: 'none'
											});
											body_.css({
												height: 'auto'
											}).getNiceScroll().show().resize();
											overlay_.fadeIn();
											this_b.removeClass('disabled');
										}
									});
								}
							});
						}
					});
				}
			}

			return false;

		});

		ef(document).keyup(function(e) {
			var _code = (e.keyCode ? e.keyCode : e.which);
			if (_code === 27 && body_.hasClass(fullscreen_class)) {
				tray_button_.click();
			}
		});

	}
	

	/* Portfolio layout and filtering */

	var toggleFilter = (function(){
		if ( ef('#ef-filter').width() > page_head_.width()-(ef('#ef-page-title').find('span').width()+ef('#ef-page-controls').width()+50) ) {
			ef('#ef-filter').hide();
			ef('.ef-select-menu').show();
		} else {
			ef('#ef-filter').show();
			ef('.ef-select-menu').hide();
		}
	});

	if (isotope_container.length){

		var hasFileringClass;

		if (isotope_container.hasClass('ef-portfolio')) {
			isotope_container.parent().appendLoadingMsg();
		}

		isotope_container.imagesLoaded(function() {

			/* Start isotope */

			var itemReveal = Isotope.Item.prototype.reveal;
			Isotope.Item.prototype.reveal = function() {
				itemReveal.apply(this, arguments);
				ef(this.element).removeClass('isotope-hidden');
			};

			var itemHide = Isotope.Item.prototype.hide;
			Isotope.Item.prototype.hide = function() {
				itemHide.apply(this, arguments);
				ef(this.element).addClass('isotope-hidden');
			};

			fake_head_.css({
				position: 'absolute',
			});

			isotope_container.isotope({
				itemSelector: '.ef-post',
				transitionDuration: blog_.length ? 0 : isotope_speed+'ms',
				stamp: fake_head_,
				resizable: false,
				hiddenStyle: {
					opacity: 0
				},
				visibleStyle: {
					opacity: 1
				},
				masonry: {
					columnWidth: colWidth()
				}
			});
			isotope_container.isotope('stamp', fake_head_);

			/*  */

			if (isotope_container.hasClass('ef-portfolio')) {

				ef('.pagination').delay(1200).fadeIn();

				ef('.ef-fadeshow').fadeShow();

				if (ef('#ef-filter').length) {
					ef('#ef-filter').mobileMenu({
						defaultText: 'Choose a category...',
						className: 'ef-select-menu',
						subMenuClass: 'dropdown',
						appendMenu: '#ef-select-wrapper'
					}).parent('#ef-select-wrapper').show();
					toggleFilter();
				}

				ef('#ef-loading-msg').remove();

				isotope_container.children('.ef-post').each(function(ii) {
					var elem = ef(this);
					setTimeout(function() {
						elem.addClass('ef-show-item');
					}, 150*ii);
				});

				var hiddenInfilter = (function(thisElem_){
					if (thisElem_.attr('data-filter') !== '*') {
						hasFileringClass = thisElem_.attr('data-filter').slice(1);
						if (!ef('.ef-post').hasClass(hasFileringClass)) {
							if (thisElem_.prop('tagName') == "OPTION") {
								thisElem_.hide().attr('disabled', true).addClass('ef-no-posts');
							} else {
								thisElem_.parent('li').hide().addClass('ef-no-posts');
							}
						}
					}
				});

				thisElem_ = false;

				ef('.ef-select-menu').find('option').each(function() {
					thisElem_ = ef(this);
						hiddenInfilter(thisElem_);
				});

				portfolio_filter.find('a').each(function() {
					thisElem_ = ef(this);
					hiddenInfilter(thisElem_);
				}).on('click', function(){

					toggleFilter();

					var selector = ef(this).attr('data-filter');
					isotope_container.isotope({
						filter: selector
					});

					delay_fn(function(){
						body_.getNiceScroll().resize();
					}, isotope_speed);
					
					portfolio_filter.find('a').parent().removeClass('ef-currentClass');
					ef(this).parent().addClass('ef-currentClass');

					return false;
				});

				ef('.ef-select-menu').on('change', function(){
					var selector = ef(this).find('option:selected').attr('data-filter');
					portfolio_filter.find('a').each(function(){
						if (ef(this).attr('data-filter') == selector) ef(this).click();
					});
				}).change();
			}

		});

		isotope_container.infinitescroll({
			localMode: 'true',
			navSelector: '.page-nav',
			nextSelector: '.page-nav a',
			itemSelector: '.ef-post',
			prefill: false,
			loading: {
				speed: 1,
				selector: 'body',
				finishedMsg: finishedMsg_,
				msgText: msgText_,
				img: 'data:image/gif;base64,R0lGODlhAQABAHAAACH5BAUAAAAALAAAAAABAAEAAAICRAEAOw==',
				finished: function() {
					ef('#infscr-loading').css({display: 'block'});
				}
			},
			errorCallback: function() {
				ef('#infscr-loading').addClass('infscr-loaded');
			}
		}, function(newElements){

			var _newElems = ef(newElements).hide();
			isotope_container.append(_newElems);

			_newElems.imagesLoaded(function(){

				isotope_container.isotope('appended', _newElems);

				infiniteScrollDid = triggerIsotope_ = true;

				ef(window).trigger('resize');

				if (blog_.length) {
					_newElems.find('.ef-preloader').fadeOut();
					ef('#infscr-loading').css({display: 'none'});
				} else {
					if (portfolio_filter.length) {
						portfolio_filter.find('li').each(function() {
							var this_p = ef(this),
								_class = this_p.children('a').attr('data-filter').slice(1);

							if (ef('.ef-post').hasClass(_class)) {
								this_p.show().removeClass('ef-no-posts');
							}
						});
						ef('.ef-select-menu').find('option').each(function() {
							var this_p = ef(this),
								_class = this_p.attr('data-filter').slice(1);

							if (ef('.ef-post').hasClass(_class)) {
								this_p.show().attr('disabled', false).removeClass('ef-no-posts');
							}
						});
					}

					ef('a[data-sbrel]').each(function() {
						ef(this).attr('rel', ef(this).data('sbrel'));
					});

					_newElems.find('.ef-fadeshow').fadeShow();

					delay_fn(function(){
					if (ef('.ef-lightbox').length) refreshShadowbox();
						ef('#infscr-loading').css({display: 'none'});
						_newElems.addClass('ef-show-item');
					}, isotope_speed);
				}

			});
		});

	}

	/* Main background slideshow */

	if (typeof(slider_options.slides) != 'undefined' && body_.hasClass('fireform-slider') && !body_.hasClass('ef-video-bg')) {

		var main_slideshow = ef('.fireform-slider-inner'),
			thumbs = ef('#ef-thumb-list-inner'),
			flexSlider;

		if (slider_options.slides.length <= 1) {
			ef('#ef-thumb-list').css({display: 'none'});
		}

		/* Init */

		main_slideshow.imagesLoaded(function(){

			ef(window).smartresize(function() {
				main_slideshow.find('img').css({width: '', height: ''});
				main_slideshow.adjustImagePositioning();
				centerFlexThumbs();
			});

			main_slideshow.flexslider({
				animation: slider_options.transition,
				slideshow: slider_options.auto,
				slideshowSpeed: parseInt(slider_options.slide_interval, null),
				animationSpeed: parseInt(slider_options.transition_speed, null),
				useCSS: slider_options.css_engine,
				controlNav: false,
				directionNav: false,
				keyboard: true,
				multipleKeyboard: true,
				animationLoop: true,
				pauseOnAction: false,
				reverse: slider_options.reverse,
				start: function(slider){

					main_slideshow.parent().find('#ef-loading-msg').remove();

					flexSlider = slider;

					flexSlider.adjustImagePositioning();
					flexSlider.css({visibility: 'visible', opacity: '0'}).slideshow_transition({
						opacity: '1'
					}, slider_options.slide_interval*0.3);
					tray_button_.removeClass('disabled');
					niceScroll_pos();

					if (body_.hasClass(home_class)) {
						if (slider_options.caption_zoom) {
							ef('#slide_desc').addClass('ef-desc-scale');
						}
						caption(flexSlider.currentSlide);
					}

					ef('.ef-slider-ctrl-inner').css({display: ''});
					ef('#slidecounter').html(getSlideCounter(flexSlider.currentSlide, flexSlider.count));
					thumbs.find('.ef-thumb').first().addClass('flex-active-slide');
					if (flexSlider.vars.slideshow) {
						ef('#progress-bar').percentAge(flexSlider.vars.slideshowSpeed);
					}
				},
				before: function(flexSlider){
					if (isMobile) {
						ef('#slide_desc').css({opacity: '0'});
					} else {
						ef('#slide_desc').slideshow_transition({opacity: '0'});
					}
				},
				after: function(flexSlider){
					if (flexSlider.vars.slideshow) {
						ef('#progress-bar').percentAge(flexSlider.vars.slideshowSpeed);
					}
					if (body_.hasClass(home_class)) {
						caption(flexSlider.currentSlide);
					}
					ef('#slidecounter').html(getSlideCounter(flexSlider.currentSlide, flexSlider.count));
					thumbs.find('.ef-thumb').removeClass('flex-active-slide').eq(flexSlider.data('flexslider').currentSlide).addClass('flex-active-slide');
					if (thumbs.data('flexslider').pagingCount > 1) {
						thumbs.data('flexslider').flexAnimate(flexSlider.currentSlide);
					}

					if (!flexSlider.playing && slider_options.auto) {
						ef('#progress-bar').finish();
						flexSlider.play();
					}
				}
			});
		});

		ef('#prevslide').on('click', function(e){
			e.preventDefault();
			_data = main_slideshow.data('flexslider');
			_data.flexAnimate(_data.getTarget("prev"));
			resetFlexInterval(_data);
		});
		ef('#nextslide').on('click', function(e){
			e.preventDefault();
			_data = main_slideshow.data('flexslider');
			_data.flexAnimate(_data.getTarget("next"));
			resetFlexInterval(_data);
		});

		/* Thumbs */

		var centerFlexThumbs = (function(){
			flexSlider = thumbs.data('flexslider');
			if (thumbs.data('flexslider').pagingCount == 1) {
				flexSlider.find('.ef-thumb').first().css({
					marginLeft: (flexSlider.width()-flexSlider.vars.itemWidth*flexSlider.count)/2
				});
			} else {
				flexSlider.find('.ef-thumb').first().css({
					marginLeft: flexSlider.vars.itemMargin
				});
			}
		});

		thumbs.flexslider({
			animation: 'slide',
			animationLoop: false,
			controlNav: false,
			directionNav: false,
			pauseOnAction: false,
			useCSS: slider_options.css_engine,
			itemWidth: 109,
			itemMargin: 2,
			keyboard: false,
			start: function(flexSlider){
				centerFlexThumbs();
			}
		});

		thumbs.find('.ef-thumb').on('click', function(){
			_data = main_slideshow.data('flexslider');
			_data.flexAnimate(ef(this).index());
			resetFlexInterval(_data);
		});
	}

	/* Main slideshow captions */

	var old_positn = '';

	var caption = (function(activeind){

		var positn = slider_options.slides[activeind].position,
			desc_obj = ef('#slide_desc'),
			header_hgt;

		if (desc_obj.length){
			if (slider_options.slides[activeind].description) {

				if (typeof positn !== 'undefined'){
					desc_obj.removeClass(old_positn).addClass(positn);
				} else {
					desc_obj.addClass('ef-top-left');
				}

				old_positn = positn;

				desc_obj.html(slider_options.slides[activeind].description).css({display: 'block'});
				var mR,
					mL,
					intV = main_slideshow.parent().width()*0.2,
					trans = slider_options.transition_speed*0.5;

				if (!slider_options.reverse) {
					mR = -intV +'px';
					mL = intV +'px';
				} else {
					mR = intV +'px';
					mL = -intV +'px';
				}

				if (desc_obj.hasClass('re-center')) {
					vertCenterCaption(desc_obj);
					ef(window).resize(function(){
						vertCenterCaption(desc_obj);
					});
				} else {
					desc_obj.css({
						top: ''
					});
				}

				if (slider_options.caption_zoom) {

					desc_obj.children().each(function(ia) {
						var child_ = ef(this);
						setTimeout(function(){
							child_.addClass('ef-scale-up');
						}, 200*ia);					
					});
				}

				if (slider_options.transition == 'slide' ) {
					if (support_transitions && slider_options.css_engine) {
						desc_obj.css({transform: 'translate('+mL+', 0)'});
						desc_obj.transition({
							x: '0px', opacity: '1'
						}, trans, slider_options.caption_easing);
					} else {
						if (desc_obj.hasClass('ef-top-right') || desc_obj.hasClass('ef-bottom-right')) {
							desc_obj.css({marginRight: mR});
							desc_obj.animate({
								marginRight: '0px', opacity: '1'
							}, trans, slider_options.caption_easing);
						} else if (desc_obj.hasClass('ef-top-left') || desc_obj.hasClass('ef-bottom-left')) {
							desc_obj.css({marginLeft: mL});
							desc_obj.animate({
								marginLeft: '0px', opacity: '1'
							}, trans, slider_options.caption_easing);
						}
					}
				} else {
					desc_obj.slideshow_transition({
						opacity: '1'
					}, trans, slider_options.caption_easing);
				}

			} else {
				desc_obj.slideshow_transition({opacity: '0'}, slider_options.transition_speed, slider_options.caption_easing, function(){
					ef(this).html('');
				});
			}
		}
	});

	/* Exif slider */

	if (exifSlider.length) {
		exifSlider.flexslider({
			slideshow: false,
			animationLoop: false,
			controlNav: false,
			directionNav: false,
			pauseOnAction: false,
			touch: false,
			smoothHeight: true
		});
	}

	/* Post slider */

	if (postslider.length) {
		postslider.imagesLoaded(function(){
			postslider.flexslider({
				animation: postslider_options.transition,
				slideshowSpeed: postslider_options.slide_interval,
				animationSpeed: postslider_options.transition_speed,
				slideshow: postslider_options.autoplay,
				animationLoop: postslider_options.loop,
				controlNav: false,
				directionNav: false,
				smoothHeight: true,
				pauseOnAction: false,
				start: function(slider){
					ef(".ef-post-slider-counter").html(getSlideCounter(slider.currentSlide, slider.count));
					ef('.ef-post-slider-ctrls').css({display: 'block'}).global_transition({bottom: '0px'});
				},
				after: function(slider){
					ef(".ef-post-slider-counter").html(getSlideCounter(slider.currentSlide, slider.count));
					if (exifSlider.length) {
						exifSlider.data('flexslider').flexAnimate(slider.currentSlide);
					}
				}
			});

			ef('.post-slider-prev').on('click', function(e){
				e.preventDefault();
				postslider.data('flexslider').flexAnimate(postslider.data('flexslider').getTarget("prev"));

			});
			ef('.post-slider-next').on('click', function(e){
				e.preventDefault();
				postslider.data('flexslider').flexAnimate(postslider.data('flexslider').getTarget("next"));
			});
		});
	}

	/* Gallery */

	if (ajax_posts) {
		var post_per = ajax_posts.offset,
			offset = post_per,
			total = ajax_posts.postscount;
	}

	if (gallery.length) {

		var oneSlide_ = gallery.find('.ef-slide').length == 1 ? true : false;
		if (!oneSlide_ && gallery_options.navigation) {
			ef('#ef-gallery-ctrls').append('<ul class="flex-direction-nav"><li><a class="flex-prev" href="#">'+gallery_options.prevText+'</a></li><li><a class="flex-next" href="#">'+gallery_options.nextText+'</a></li>')
		}

		ef('.ef-featured-img').appendLoadingMsg();
		gallery.imagesLoaded(function(){
			gallery.flexslider({
				animation: 'slide',
				slideshow: false,
				slideshowSpeed: 4000,
				animationSpeed: gallery_options.transition_speed,
				animationLoop: false,
				controlNav: false,
				directionNav: false,
				prevText: gallery_options.prevText,
				nextText: gallery_options.nextText,
				pauseOnAction: false,
				startAt: !oneSlide_ ? gallery_options.startAt : 0,
				keyboard: true,
				start: function(slider){
					ef('#ef-loading-msg').remove();
					ef('.ef-featured-img').css({
						maxHeight: 'none'
					});
					ef('#ef-gallery-info-pane').css({
						display: 'block'
					});
					vertCenterGallery();
					slider.resize().find('a').each(function(){
						ef(this).attr('data-title', ef(this).attr('title')).removeAttr('title');
					});
					gtitle = slider.slides.eq(slider.currentSlide).find('a').attr('data-title');
					ef('#ef-gallery-title').html(gtitle ? gtitle : '');
					slider.css({visibility: 'visible', opacity: '0'}).global_transition({
						opacity: '1'
					}, 1000, function(){
						gallery.addClass('gallery-loaded');
					});
					ef("#ef-counter").html('[ '+getSlideCounter(slider.currentSlide, slider.count)+' ]');
					ef('.flex-direction-nav').find('a').on('click',function() {
						if (ef(this).hasClass('flex-prev')){
							slider.flexslider("prev");
						} else {
							slider.flexslider("next");
						}
						return false;
					});
					slider.slides.on('click',function() {
						slider.flexAnimate(ef(this).index());
					});
				},
				before: function(slider){
					slider.find('a').attr('disabled', 'disabled').find('img').addClass('speedup');
				},
				after: function(slider){
					gtitle = slider.slides.eq(slider.currentSlide).find('a').removeAttr('disabled').attr('data-title');
					ef('#ef-gallery-title').html(gtitle ? gtitle : '');
					slider.find('img').removeClass('speedup');
					ef("#ef-counter").html('[ '+getSlideCounter(slider.currentSlide, slider.count)+' ]');
				},
				end: function(slider) {

					if (ajax_posts && offset < total && ajax_posts.gallery_type != 'regular') {

						ef.ajax({
							type: "post",
							cache: false,
							timeout: 8000,
							url: ajax_posts.ajaxurl,
							data: ({
								action: 'ef_ajax_posts',
								offset: offset,
								posts_per : post_per,
								postCommentNonce: ajax_posts.postCommentNonce,
								lb_lnk: ajax_posts.lb_lnk,
								terms: ajax_posts.terms
							}),

							beforeSend: function() {
								ef('.pace').css({display: 'block'});
								ef('.flex-direction-nav').css({display: 'none'});
							},

							success: function(data, textStatus, jqXHR) {

								var newSlides = ef(data).find('.ef-slide'),
										newElCount = newSlides.length,
										count = slider.count;

								newSlides.css({opacity: '0'}).imagesLoaded(function(){
									slider.addSlide(newSlides);
									slider.count = count + newElCount;
									slider.last = slider.count - 1;
									slider.find('a').each(function(){
										ef(this).attr('data-title', ef(this).attr('title')).removeAttr('title');
									});

									ef(window).trigger('resize');

									newSlides.delay(300).global_transition({opacity: '1'}, 800);
									ef('.pace').css({display: 'none'});
									ef('.flex-direction-nav').css({display: 'block'});

									gallery.data('flexslider').slides.on('click',function() {
										gallery.data('flexslider').flexAnimate(ef(this).index());
									});
									
								});
							},

							complete: function(jqXHR, textStatus) {
								offset = parseInt(offset, null) + parseInt(post_per, null);
							}
						});
					}
				}
			});
		});

	}

	/* Google maps */

	var parsedMarkers = [];

	ef.map(map_markers, function(n) {
		parsedMarkers.push({
			'latitude' : parseFloat(n['latitude'], null),
			'longitude' : parseFloat(n['longitude'], null),
			'id' : n['id'].toString()
		});
	});

	if (googmap.length && map_markers) {
		googmap.goMap({
			maptype: map_type,
			zoom: zoomLevel,
			scaleControl: false,
			navigationControl: false,
			scrollwheel: false,
			mapTypeControl: false,
			mapTypeControlOptions: {
				position: 'RIGHT',
				style: 'DROPDOWN_MENU'
			},
			markers: parsedMarkers,
			icon: ef_js_vars.map_icon,
			hideByClick: true,
			addMarker: false,
			html: {
				popup: false
			}
		});

		var currentMarker = false;

		ef('#ef-show-map').click(function() {
			if (currentMarker) {
				ef('#ef-map-overlay').fadeIn();
				ef(this).removeClass('active');
			} else {
				ef('#ef-map-overlay').fadeOut();
				ef(this).addClass('active');
			}
			currentMarker = !currentMarker;
			return false;
		});

		ef('.ef-marker').click(function () {
			var str_ = parseInt(ef(this).attr('data-id'), null)-1,
				center_ = new google.maps.LatLng(parsedMarkers[str_]['latitude'], parsedMarkers[str_]['longitude']);

			ef.goMap.map.setCenter(center_);
			ef('.ef-marker').parent().removeClass('ef-currrent-marker');
			ef(this).parent().addClass('ef-currrent-marker');

			return false;
		});
	}

	/* On window resize */

	ef(window).smartresize(function() {
		shifTSb();
		pane_height();
		if (gallery.length) vertCenterGallery();		
		if (body_.hasClass(fullscreen_class) && Modernizr.mq('only screen and (max-width: '+breakpoint+'px)')){
			tray_button_.click();
			if (isotope_container.length) {
				setTimeout(function(){
					ef(window).trigger('resize');
				}, 2000);
			}			
		}
		if (isotope_container.length) triggerIsotope();
		if (full_slider && typeof(main_slideshow) != 'undefined' && slider_options.auto && main_slideshow.data('flexslider').playing) {
			main_slideshow.data('flexslider').pause();
			main_slideshow.data('flexslider').play();
		}
	});

	ef(window).on('resize', function() {
		ef('.ef-video-bg').find('.fireform-slider-inner').adjustImagePositioning();
		if (gallery.length) gallery.trigger('updateSizes');
		if (ef('#ef-filter').length) toggleFilter();
		if (!isMobile) {
			niceScroll_pos();
			if (!infiniteScrollDid) {
				body_.getNiceScroll().hide();

				delay_fn(function(){
					body_.getNiceScroll().show().resize();
				}, 500);
			} else {
				infiniteScrollDid = false;
			}
		}
	});
});

ef(window).load(function() {
	if (typeof twttr != 'undefined') {
		twttr.events.bind('rendered', function () {
			if (isotope_container.length) {
				setTimeout(function(){
					isotope_container.isotope('layout');
				}, 500);
			} else {
				scrolls_.getNiceScroll().resize();
			}			
		});
	}

	if (!isMobile) {
		niceScroll_pos();
		if (!body_.hasClass(full_page_class)) {
			scrolls_.getNiceScroll().show();
		} else {
			ef(document).one('scroll', function(){
				scrolls_.getNiceScroll().show();
			});
		}
		if (ef.browser.msie) {
			ef(window).trigger('resize');
		}
	}
});