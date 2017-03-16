(function(){
	'use strict';
	var canvasObj = {};
	var canvasFrames = {
		objs : [],
		draw : function( instance ){
			var frameRate = instance.frameRate;
			if( canvasFrames.timer % frameRate === 0 ){
				
				instance.frame ++;
				// console.log( 'draw' )
				if( instance.settings.enterFrame !== null ) {
					instance.settings.enterFrame( instance.context, instance.frame, instance );
				}
			}
		},
		animationFrame : function(){
			// console.log( this )
			// console.log( canvasFrames.timer )
			var i = 0,
				roof = canvasFrames.objs.length;
			for( i; i< roof; i++ ){
				canvasFrames.draw( canvasFrames.objs[i] );
			}
			requestAnimationFrame( canvasFrames.animationFrame );
		},
		isFrame : false,
		timer : 0
	}

	function Canvas ( canvasElement, options ){
		var opt = {
			width : window.innerWidth,
			height : window.innerHeight,
			frameRate : 'auto',
			callback : null,
			enterFrame : null
		}
		var instance = this;
		instance.rootElement = canvasElement;
		instance.context = canvasElement.getContext('2d');
		instance.settings = ( options ) ? utill.extend( opt, options ) : opt;
		instance.frame = 0;
		instance.frameRate = frameRate( instance.settings.frameRate );
		// console.log( instance )
		instance.CanvasInit( this );
	};

	Canvas.prototype.CanvasInit = function ( instance ){
		canvasFrames.objs.push( instance );
		instance.rootElement.width = instance.settings.width;
		instance.rootElement.height = instance.settings.height;
		if( !canvasFrames.isFrame ){
			canvasFrames.animationFrame();
			// window.setInterval( function(){
				
			// 	canvasFrames.timer ++;
			// },1 );
			canvasFrames.isFrame = true;
		}
		
	}

	function frameRate ( num ){
		if( num === 'auto' ) {
			return 1;
		} else {
			var n = parseInt( num, 10 ),
				interval = Math.floor( 1000 / n );
			return interval;
		}
	}

	function draw ( instance ) {
		
	}

	// Canvas.prototype.draw = function(){

	// 	var instance = this,
	// 		frameRate = instance.frameRate;

	// 	console.log( this )
	// 	if( canvasFrames.timer % frameRate === 0 ){
	// 		instance.frame ++;
	// 		// console.log( 'draw' )
	// 		if( instance.enterFrame !== null ) {
	// 			instance.enterFrame( instance.context, instance.frame, instance );
	// 		}
	// 	}
	// }

	Canvas.prototype.resize = function( size) {
		var instance = this;
		instance.rootElement.width = instance.settings.width = size.width;
		instance.rootElement.height = instance.settings.height = size.height;
	}

	Canvas.prototype.ele = function(){
		return this.rootElement;
	}

	Canvas.prototype.context = function(){
		return this.context;
	}


	function canvas ( id, opt, methodArguments ){
		var options,
			method = '';
		if( opt ) {
			if( typeof opt === 'opject' ) {
				options = opt;
			} 
			if( typeof opt === 'string' ) {
				method = opt;
			}
		}
		if( !canvasObj[id] ){
			var ele = document.getElementById( id );
			canvasObj[id] = {
				element : ele,
				fnc : new Canvas( ele, opt ),
				index : canvasFrames.objs.length
			};
		} else {
			if( methodArguments ) {
				canvasObj[id].fnc[ opt ]( methodArguments );
			} else {
				canvasObj[id].fnc[ opt ]();
			}
			
		}
	};

	window.canvas = canvas;


	
})( window, undefined );