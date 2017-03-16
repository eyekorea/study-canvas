//= require ../_vendor/jquery-1.11.1.min.js
//= require ../_vendor/jquery-ui.min.js

(function(){
	var width = window.innerWidth,
		height = window.innerHeight,
		gr1S = {
			now : 160,
			min : 160,
			max : 245,
			full : 'rgba(0, {{changeColor}}, 255, 1 )',
			distance : 'up'
		},
		gr1E = {
			now : 0,
			min : 0,
			max : 255,
			full : 'rgba(255, 140, {{changeColor}}, 1 )',
			distance : 'up'
		},
		gr2S = {
			now : 105,
			min : 105,
			max : 235,
			full : 'rgba(255, {{changeColor}}, 50, .4 )',
			distance : 'up'
		},
		gr2E = {
			now : 85,
			min : 85,
			max : 205,
			full : 'rgba(80, {{changeColor}}, 255, .4 )',
			distance : 'up'
		};

	/*
		color 1 : 0, 160 ~ 245, 200 (green ~ blue)
		color 2 :  255, 140, 0 ~ 255 ( orange ~ pink)
		color 3 : 235, 105 ~ 235, 50 ( yellow ~ orange )
		color 4 : 80, 85 ~ 205, 205 ( blue ~ pouple )
	*/

	function colorReturn ( obj ) {
		var str = obj.full;
		if( obj.distance === 'up' ) {
			if( obj.now >= obj.max ) {
				obj.distance = 'down';
				obj.now --;
			} else {
				obj.now ++;
			}
		} else {
			if( obj.now <= obj.min ){
				obj.distance = 'up';
				obj.now ++;
			} else {
				obj.now --;
			}
		}

		return str.replace('{{changeColor}}', obj.now);
	}
	canvas('gradient', {
		width : $(window).width(),
		height : $(window).height(),
		frameRate : 'auto',
		callback : null,
		enterFrame : function( context, frame, all ){
			var gr = context.createLinearGradient( 0, 0, width, height );
			var gr2 = context.createLinearGradient( width, 0, 0, height );
			gr.addColorStop(0, colorReturn ( gr1S ) );
			gr.addColorStop(1, colorReturn ( gr1E ) );
			gr2.addColorStop(0, colorReturn ( gr2S ) );
			gr2.addColorStop(1, colorReturn ( gr2E ) ); 
			
			// context.clearRect( 0, 0, width, height );
			context.fillStyle = gr;
			context.fillRect( 0, 0, width, height );
			context.fillStyle = gr2;
			context.fillRect( 0, 0, width, height );

			// context.globalCompositeOperation = 'source-over'

		}
	});

	


	// mouse x, y 좌표.
	$(window).on('resize', function(){
		width = $(window).width();
		height = $(window).height();
		canvas('gradient', 'resize', {
			'width' : width,
			'height' : height
		} );
	});
})();