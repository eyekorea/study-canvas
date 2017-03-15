//= require ../_vendor/jquery-1.11.1.min.js
//= require ../_vendor/jquery-ui.min.js

(function(){
	// canvas object;
	var canvas = document.getElementById('wave'),
		context = canvas.getContext('2d'),
		width = canvas.width = $(window).width(),
		height = canvas.height = $(window).height(),
		target = {
			x : width - 200,
			y : height / 2
		},
		defaultPath = {
			x1 : -200,
			x2 : width + 200,
			y1 : height / 2,
			y2 : height / 2
		},
		waveLen = 3,
		point = 6,
		ease = .8,
		points = [],
		bounces = [], // 해당 값이 커지면 높아진다.
		colors = [ 'rgba(255,0,0,.5)','rgba(0,255,0,.5)',  'rgba(0,0,255,.5)'],
		benchmark = 0,
		benchmarks = [0,1,2],
		k,
		i;


	// mouse x, y 좌표.
	$(window).on('mousemove', function ( event ){
		target.x = event.clientX;
		target.y = event.clientY;
	}).on('resize', function(){
		width = canvas.width = $(window).width();
		height = canvas.height = $(window).height();
		pointSet();
	});

	function bounceCheck (){
		var wavePoint = (width + 200) / point,
			eventPoint = Math.floor( target.x / wavePoint );
	}

	function pointSet(){
		for( k=0; k<waveLen; k++ ) {
			if( typeof points[k] === 'undefined' ) {
				points[k] = [];
			}
			if( typeof bounces[k] === 'undefined' ) {
				bounces[k] = [];
			}
			if( points[k].length !== 0 ){
				points[k] = [];
				bounces[k] = [];
			}
			for( i=0; i<point; i++ ){
				bounces[k].push( 10 + i*2 );
				points[k].push( {
					x : (width + 200) / point * (i+1),
					y : defaultPath.y1,
					cx : 0,
					cy : (function(){
						if( i%2 !== 0 ) {
							return defaultPath.y1 - bounces[k][i];
						} else {
							return defaultPath.y1 + bounces[k][i];
						}
					})(),

					maxLeft : (width + 200) / point * (i+1) - 80,
					maxRight : (width + 200) / point * (i+1) + 80,
					maxCy : defaultPath.y1 + bounces[k][i],
					minCy : defaultPath.y1 - bounces[k][i],
					distance : (function(){
						if( i%2 !== 0 ) {
							return 'up';
						} else {
							return 'down';
						}
					})(),
					distance2 : 'right'
				} );
			}
		}
	};


	function toRadian(deg){
		return deg * (Math.PI/180);
	};

	var frame = 0;
	// canvas draw
	function draw(){
		var j=0,
			l = 0,
			ty = target.y,
			tx = target.x;
			
		context.clearRect(0,0,width, height); // canvas 를 지움.

		for( l = 0; l < waveLen; l++ ) {
			var cp1x = points[l][0].x/2,
				cp1y = 0,
				distance = 'up';
			context.beginPath();
			context.fillStyle = colors[l];
			context.moveTo( defaultPath.x1, defaultPath.y1 ); // 시작점 (차후 변경 필요)

			for(j=0; j < point; j++) {
				// if( j === 0 ) {
				// 	console.log( benchmarks[l] )
				// }
				var p = points[l][j];
				p.cx = (j === 0) ? cp1x : p.x - cp1x;

				if( j !== benchmarks[l] ) {
					var n = ( j !== 0 ) ? j-1 : point-1;
					if(  points[l][ n ].distance === 'up' ) {
						p.distance = 'down';
					} else {
						p.distance = 'up';
					}
				} else {
					if( p.cy  >= p.maxCy && p.distance === 'down' ) {
						p.distance = 'up';
						benchmarks[l] = Math.ceil( Math.random() * point ) - 1;
					} else if( p.cy <= p.minCy && p.distance === 'up' ) {
						p.distance = 'down';
					}
				}


				if( p.x  > p.maxRight && p.distance2 === 'right' ) {
					p.distance2 = 'left';
			} else if( p.x < p.maxLeft && p.distance2 === 'left' ) {
					p.distance2 = 'right';
				}

				if( p.distance2 === 'right' ) {
					if( l === 0 ){
						p.x += Math.ceil( ( p.maxRight - p.x ) / 100  ) * ( Math.random( ) * 1.5 * 0.5 ) ;
					} else {
						p.x = points[l-1][j].x;
					}
					
				} else {
					if( l === 0 ){
						p.x -= Math.ceil( ( p.x - p.maxLeft ) / 100  ) * ( Math.random( ) * 1.5 * 0.5 ) ;
					} else {
						p.x = points[l-1][j].x;
					}
					
				}

				if( p.distance === 'down' ){
					p.cy += Math.ceil( ( p.maxCy - p.cy ) / 30  ) * ( Math.random( ) * 1.5 * 0.5 ) ;
				} else {
					p.cy -= Math.ceil( ( p.cy - p.minCy ) / 30  ) * ( Math.random( ) * 1.5 * 0.5 ) ;
				}
				context.quadraticCurveTo(p.cx, p.cy, p.x, p.y); // cp1x, cp1y, cp2x, cp2y, x, y)
			}


			context.lineTo( defaultPath.x2, defaultPath.y2 );
			context.lineTo( defaultPath.x2, height );
			context.lineTo( defaultPath.x1, height );
			context.lineTo( defaultPath.x1, defaultPath.y1 );
			// context.stroke();
			context.globalCompositeOperation = 'lighterxor';
			context.fill();
			context.closePath();
		}


		requestAnimationFrame(draw);
		frame ++;
	};

	setInterval( function(){
		$('#output').val( 'FRAME : ' + frame );
		frame = 0;
	}, 1000 );

	pointSet();
	draw();


})();