//= require ../_vendor/jquery-1.11.1.min.js
//= require ../_vendor/jquery-ui.min.js

(function(){
	var width = window.innerWidth,
		height = window.innerHeight,
		gr1S = {
			now : 155,
			min : 155,
			max : 255,
			full : 'rgba(120, 70,  {{changeColor}}, 1 )',
			distance : 'up'
		},
		gr1E = {
			now : 95,
			min : 95,
			max : 255,
			full : 'rgba(95, 158, {{changeColor}}, 1 )',
			distance : 'up'
		},
		gr2S = {
			now : 165,
			min : 165,
			max : 255,
			full : 'rgba(152, 100, {{changeColor}}, .4 )',
			distance : 'up'
		},
		gr2E = {
			now : 83,
			min : 83,
			max : 203,
			full : 'rgba(57, {{changeColor}}, 207, .4 )',
			distance : 'up'
		},
		circles = {
			minLen : 4,
			maxLen : 6,
			createRadius : height,
			circleObj : [],
			isFirst : true,
			posFix : 0, // 0, 1, 2, 3 으로 화면을 4분할 하여 순차로 배치.
			creat : function( ) {
				var returnCircle = {
					radius : utill.randomRange( height / 10 ,height / 1.5 ),
					opacity : 0,
					state : 'show',
					opacityMax : ( Math.random() * 3 ) / 10,
					x : (function(){
						if( circles.posFix === 0 || circles.posFix === 2 ){
							return Math.random() * width - ( width / 2 );
						} else {
							return Math.random() * width + ( width / 2 );
						}
					})(),
					y : (function(){
						if( circles.posFix === 0 || circles.posFix === 1 ) {
							return Math.random() * height - ( height / 2 );
						} else {
							return Math.random() * height + ( height / 2 );
						}
					})()
					// x : 100,
					// y : 100
				}
				if( circles.posFix < 3 ) {
					circles.posFix ++;
				} else {
					circles.posFix = 0;
				}
				return returnCircle;
			},
			mot : function( context , frame) {
				
				if( circles.circleObj.length < circles.maxLen  ) {
					if( circles.isFirst || frame % 50 === 0  ) {
						circles.circleObj.push( circles.creat() );

						if( circles.circleObj.length > circles.minLen ){
							circles.isFirst = false;
						}
					}
					
				}

				for( var i = 0; i < circles.circleObj.length; i++ ){
					var obj = circles.circleObj[ i ];
					if( obj.x <= 0 ){
						obj.x += 1 * 0.25 ;
					} else if( obj.x >= width ) {
						obj.x -= 1 * 0.25 ;
					} else {
						obj.x += 1 * 0.25 ;
					}

					if( obj.y <= 0 ){
						obj.y += 1 * 0.25 ;
					} else if( obj.y >= height ) {
						obj.y -= 1 * 0.25 ;
					} else {
						obj.y += 1 * 0.25 ;
					}

					obj.radius += Math.random() * 1.5 * 0.15;

					context.beginPath();
					context.fillStyle = 'rgba(255,255,255,' + obj.opacity.toFixed(3) + ')';
					context.arc( obj.x, obj.y, obj.radius, 0, (Math.PI/180)*360, false );
					context.closePath();
					context.fill();


					if( obj.state === 'show' ) {
						obj.opacity += 0.01 * 0.08;
						if( obj.opacity > obj.opacityMax ){
							obj.state = 'hide'
						}
					} else {
						obj.opacity -= 0.01 * 0.08;
						if( obj.opacity <= 0 ) {
							circles.circleObj.splice( i, 1 );
						}
					}
				}
			}
		}

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


	canvas('circle', {
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

			circles.mot( context, frame );

		}
	});

	


	// mouse x, y 좌표.
	$(window).on('resize', function(){
		width = $(window).width();
		height = $(window).height();
		canvas('circle', 'resize', {
			'width' : width,
			'height' : height
		} );
	});
})();