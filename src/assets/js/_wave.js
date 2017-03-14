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
		point = 4,
		ease = .8,
		points = [],
		bounces = [], // 해당 값이 커지면 높아진다.
		Benchmark = 0,
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

	function pointSet(){
		if( points.length !== 0 ){
			points = [];
			bounces = [];
		}
		for( i=0; i<point; i++ ){
			bounces.push( 40 );
			points.push( {
				x : (width + 200) / point * (i+1),
				y : defaultPath.y1,
				cx : 0,
				cy : (function(){
					if( i%2 !== 0 ) {
						return defaultPath.y1 - bounces[i];
					} else {
						return defaultPath.y1 + bounces[i];
					}
				})(),

				maxLeft : (width + 200) / point * (i+1) - 100,
				maxRight : (width + 200) / point * (i+1) + 100,
				maxCy : defaultPath.y1 + bounces[i],
				minCy : defaultPath.y1 - bounces[i],
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
	};


	function toRadian(deg){
		return deg * (Math.PI/180);
	};

	var frame = 0;
	// canvas draw
	function draw(){
		var j=0,
			ty = target.y,
			tx = target.x,
			cp1x = points[0].x/2,
			cp1y = 0,
			distance = 'up';
		var consoleTxt = '';
		context.clearRect(0,0,width, height); // canvas 를 지움.
		

		context.beginPath();
		context.fillStyle = 'rgba(255,0,0,.6)';
		context.moveTo( defaultPath.x1, defaultPath.y1 ); // 시작점 (차후 변경 필요)
		for(j; j < point; j++) {
			var p = points[j];
			p.cx = (j === 0) ? cp1x : p.x - cp1x;

			if( j !== Benchmark ) {
				var n = ( j !== 0 ) ? j-1 : point-1;
				if(  points[  n ].distance === 'up' ) {
					p.distance = 'down';
				} else {
					p.distance = 'up';
				}
			} else {
				if( p.cy  >= p.maxCy && p.distance === 'down' ) {
					p.distance = 'up';
					Benchmark = Math.ceil( Math.random() * point ) - 1;
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
				p.x += Math.ceil( ( p.maxRight - p.x ) / 50  ) * ( Math.random( ) * 4 / 1.2 ) ;
			} else {
				p.x -= Math.ceil( ( p.x - p.maxLeft ) / 50  ) * ( Math.random( ) * 4 / 1.2 ) ;
			}
			
				// if( j === 0 ){
				// 	console.log( p.x, p.maxLeft, p.maxRight, p.distance2 );
				// }
			
			
			if( p.distance === 'down' ){
				p.cy += Math.ceil( ( p.maxCy - p.cy ) / 50  ) * ( Math.random( ) * 4 / 1.2 ) ;
			} else {
				p.cy -= Math.ceil( ( p.cy - p.minCy ) / 50  ) * ( Math.random( ) * 4 / 1.2 ) ;
			}

			context.quadraticCurveTo(p.cx, p.cy, p.x, p.y); // cp1x, cp1y, cp2x, cp2y, x, y)
		}
		context.lineTo( defaultPath.x2, defaultPath.y2 );
		context.lineTo( defaultPath.x2, height );
		context.lineTo( defaultPath.x1, height );
		context.lineTo( defaultPath.x1, defaultPath.y1 );
		context.fill();
		context.closePath();



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