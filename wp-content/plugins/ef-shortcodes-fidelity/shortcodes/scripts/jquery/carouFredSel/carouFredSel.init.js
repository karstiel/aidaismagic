var ef = jQuery;
ef.noConflict();

ef(document).ready(function() {

	if (typeof(ef_slider_vars) !== 'undefined') {

		for (var ind = 1; ind <= parseInt(ef_slider_vars.s_ind, null); ind++) {

			$simpleCarousel = ef('.ef-simple-carousel-' + ind + '');

			if ($simpleCarousel.length > 0) {

				$type = eval('ef_slider_vars.s_type' + ind) ? eval('ef_slider_vars.s_type' + ind) : 'slider';
				$auto = eval('ef_slider_vars.s_autoplay' + ind) && eval('ef_slider_vars.s_autoplay' + ind) == 'yes' ? true : false;
				$infinite = eval('ef_slider_vars.s_infinite' + ind) && eval('ef_slider_vars.s_infinite' + ind) == 'yes' ? true : false;
				$duration = eval('ef_slider_vars.s_duration' + ind) ? parseInt(eval('ef_slider_vars.s_duration' + ind), null) : 2000;
				$fx = eval('ef_slider_vars.s_fx' + ind) ? eval('ef_slider_vars.s_fx' + ind) : 'slide';

				$simpleCarousel.find('.ef-slide').css({display: 'block'});
				$simpleCarousel.carouFredSel({
					responsive: true,
					transition: true,
					circular: $infinite,
					prev: '.post-slider-prev.index-' + ind + '',
					next: '.post-slider-next.index-' + ind + '',
					auto: $auto,
					scroll: {
						fx: $fx,
						duration: 1000,
						timeoutDuration: $duration,
						easing: 'easeInOutExpo',
						pauseOnHover: true
					},
					swipe: {
						onTouch: true
					},
					pagination: {
						container: '.carousel-pagintation-' + ind + ''
					},
					items: {
						height: 'variable'
					}
				});
			}
		}
	}

	if (typeof(ef_slider_vars1) !== 'undefined' && ef('.ef-simple-carousel').length > 0) {

		$auto = ef_slider_vars1.autoplay && ef_slider_vars1.autoplay == 'yes' ? true : false;
		$infinite = ef_slider_vars1.infinite && ef_slider_vars1.infinite == 'yes' ? true : false;
		$duration = ef_slider_vars1.duration ? parseInt(ef_slider_vars1.duration, null) : 2000;
		$fx = ef_slider_vars1.fx ? ef_slider_vars1.fx : 'slide';

		ef('.ef-simple-carousel').find('.ef-slide').css({display: 'block'});
		ef('.ef-simple-carousel').carouFredSel({
			responsive: true,
			transition: true,
			circular: $infinite,
			auto: $auto,
			scroll: {
				fx: $fx,
				duration: 1000,
				timeoutDuration: $duration,
				easing: 'easeInOutExpo',
				pauseOnHover: true
			},
			swipe: {
				onTouch: true
			},
			pagination: {
				container: '.carousel-pagintation'
			},
			items: {
				height: 'variable'
			}
		});
	}
});