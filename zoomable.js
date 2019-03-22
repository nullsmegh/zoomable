(function(){


	zoomable = function(element, config){
		this.init(element, config);
	}


	zoomable.prototype.init = function(element, config){

		this.touchMatrix = {};

		this.config = _replaceValues(config, {
			zoom: {
				transition: "0.5s",
				animate: true,
				sensitivity:"1",
				centerZoom: false,
			},
			bounds: {
				resistance: "1",
				matrix: false
			},
			onPress: null,
			onTouch: null,
			pressEnd: null,
			touchEnd:null
		});

		this.element = element;

		this.updateNodeMatrix();

		this.attachTouchListeners();

	}

	zoomable.prototype.destroy = function(){
			
	}

	zoomable.prototype.updateNodeMatrix = function(){

		var nodeRect = this.element.getBoundingClientRect();

		var transformMatrix = new WebkitCSSMatrix(getComputedStyle(this.element).getPropertyValue("transform"));

		this.matrix = {

			offsetTop: rect.top,

			offsetLeft: rect.left,
			
			offsetBottom: rect.bottom,
			
			offsetRight: rect.right,
			
			realWidth: rect.width,
			
			realHeight: rect.height,

			translateX: transformMatrix.m41,

			translateY: transformMatrix.m42,

			scaleX: transformMatrix.m11,

			scaleY: transformMatrix.m22
		};

	};

	zoomable.prototype.attachTouchListeners = function(){

		this.__touchStart = __touchStart.bind(this);
		this.__touchMove = __touchMove.bind(this);
		this.__touchEnd = __touchMove.bind(this);

		this.element.addEventListener('touchstart', this.__touchStart);
		this.element.addEventListener('touchmove', this.__touchMove);
		this.element.addEventListener('touchend', this.__touchMove);

	}

	zoomable.prototype.getTouchX = function(x1, x2){

		return (x1 + x2) / 2 / this.matrix.ratio - this.matrix.translateX; 
	}

	zoomable.prototype.getTouchY = function(y1, y2){

		return (y1 + y2 - 2 * (this.matrix.top + window.scrollY)) / 2 / this.matrix.ratio - this.matrix.translateY; 
	}	

	zoomable.prototype.detachTouchListners = function(){

		this.element.removeEventListener('touchstart', this.__touchStart);
		this.element.removeEventListener('touchmove', this.__touchMove);
		this.element.removeEventListener('touchend', this.__touchEnd);

	}

	zoomable.prototype.transform = function(scale, translate){

		this.element.style.transform = "translate3d("+translate[0]+","+translate[1]+",0) scale("+scale+")";
		this.matrix.scaleX = this.matrix.scaleY = scale;
		this.matrix.translateX = translate[0];
		this.matrix.transformY = translate[1];

	}

	function __touchStart(event){

		event.preventDefault();

		this.touchMatrix.x = this.getTouchX(event.touches[0].pageX, event.touches[1].pageX);

		this.touchMatrix.y = this.getTouchY(event.touches[0].pageY, event.touches[1].pageY);

		this.touchMatrix.cD = _getDistance(_extractCoords(event)); 

	}


	function __touchMove(event){

		if ( event.touches.length === 2) {

			event.preventDefault();

			this.touchMatrix.dD = (_getDistance(_extractCoords(event)) / this.touchMatrix.cD);

			this.touchMatrix.fD = this.touchMatrix.pD * this.touchMatrix.dD;

			if(this.outOfBounds() === true){
				this.transform()
			} else {
				this.transform(this.touchMatrix.fD, [ (1  - this.touchMatrix.dD) * this.touchMatrix.x + this.matrix.translateX, (1  - this.touchMatrix.dD) * this.touchMatrix.y + this.matrix.translateY ] );
			}

		}
	}


	function __touchEnd(event){

	}

	function _extractCoords(event){
		return [event.touches[0].pageX, event.touches[0].pageY, event.touches[1].pageX, event.touches[1].pageY];
	}

	function _getDistance(coords){
		return Math.sqrt(Math.pow((c1[0] - c2[2]), 2) + Math.pow((c1[1] - c2[3]), 2));
	}


	function _replaceValues(obj, default){
		for(var key in default){
			if(obj.hasOwnProperty(key)) default[key] = obj[key];
		}
		return default;
	}

})();