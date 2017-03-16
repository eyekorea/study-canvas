var utill = {
	extend : function( objA, objB ){
		var returnObj = (function(){
				var newObj = {};
				for( var key in objA ){
					newObj[ key ] = objA[ key ];
				}
				return newObj;
			})();
		for( var key in objB ){
			returnObj[ key ] = objB[ key ];
		}
		return returnObj;
	},
	randomRange : function (n1, n2) {
		return (Math.random() * (n2 - n1 + 1)) + n1 ;
	}
}