var requestAnimationFrame =  
	window.requestAnimationFrame ||
	window.webkitRequestAnimationFrame ||
	window.mozRequestAnimationFrame ||
	window.msRequestAnimationFrame ||
	window.oRequestAnimationFrame ||
	function(callback) {
	  return setTimeout(callback, 1);
	};

var createStepFunc = function(step) {
	var currTime;
	var prevTime = new Date().getTime();

	return function() {
		currTime = new Date().getTime();
		var timeDelta = currTime - prevTime;	
		prevTime = currTime;
		step(timeDelta);	
	}
};

var WindGust = function(bezPath) {
	this.bezPath = bezPath;
	this.paramVel = 0.001;
	this.t = 0;
	this.prevt = 0;
	this.done = false;
};

WindGust.prototype.animate = function(onFinish) {
	// create the step function and start updating
	var that = this;
	var stepFunc = createStepFunc(function(timeDelta) {
		that.prevt = that.t;
		that.t += timeDelta * that.paramVel; 	
		if (that.t <= 1) {
			requestAnimationFrame(stepFunc);
		}
		else {
			that.done = true;
			onFinish();
		}
	});
	requestAnimationFrame(stepFunc);
	requestAnimationFrame(this.draw.bind(this));
};

WindGust.prototype._thicknessFunc = function(t) {
	return (-4 * t * t) + (4 * t);
};

WindGust.prototype.draw = function() {
	if (this.done)
		return;

	ctx.strokeStyle = '#1B2B45';
	ctx.beginPath();
	ctx.lineWidth = 3 * this._thicknessFunc(this.t);
	var p0 = this.bezPath.getPoint(this.prevt - 0.001);
	ctx.moveTo(p0.x, p0.y);
	var p1 = this.bezPath.getPoint(this.t);
	ctx.lineTo(p1.x, p1.y);
	ctx.stroke();
	requestAnimationFrame(this.draw.bind(this));
};


var canvas = null;
var buffer = null; 
var ctx = null;
var pointBuffer = [];

var genRandCurve = function(minX, maxX, minY, maxY, xDev) {
	var yDelta = maxY - minY;
	var xDelta = maxX - minX;

	return [{
		x: minX,
		y: yDelta * Math.random() + minY,
	},{
		x: minX + (1/3) * xDelta + Math.random() * xDev,
		y: yDelta * Math.random() + minY,
	},{
		x: minX + (2/3) * xDelta + Math.random() * xDev,
		y: yDelta * Math.random() + minY,
	},{
		x: maxX,
		y: yDelta * Math.random() + minY
	}];
};

var initCanvasSize = function(canvas) {
	var canvasAspectRatio = 3;
	var canvasMaxWidth = 900; 
	var canvasMinHeight = 70;

	canvas.width = Math.min(window.innerWidth, canvasMaxWidth);
	canvas.height = Math.max(window.innerHeight / canvasAspectRatio, canvasMinHeight);
};

var resizeTimeout = undefined;
window.onresize = function() {
	if (typeof resizeTimeout !== 'undefined') {
		clearTimeout(resizeTimeout);
	}
	resizeTimeout = setTimeout(function() {
		initCanvasSize(canvas);
		ctx.fillStyle = 'white';
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		buffer.width = canvas.width;
		buffer.height = canvas.height;
		bufferCtx.globalCompositeOperation = "lighter";

		resizeTimeout = undefined;
		console.log('Resized');
	}, 1000);
};

window.onload = function() {
	canvas = document.getElementById("front-wind");
	canvas.addEventListener("click", function(event) {
		pointBuffer.push(getMousePos(canvas, event));
	});
	initCanvasSize(canvas);

	ctx = canvas.getContext("2d");
	ctx.beginPath();
	ctx.fillStyle = 'white';
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	var createAnimatedGust = function() {
		new WindGust(new Bezier(genRandCurve(0, canvas.width, 0, canvas.height, 50))).animate(function() {
			window.setTimeout(createAnimatedGust, Math.random() * 2000);
		});
	};

	for (var i = 0; i < 3; i++) {
		createAnimatedGust();
	}

	var fadingRate = 0.0005;
	var opacity = 1;
	var fadingStep = createStepFunc(function(timeDelta) {
		opacity = fadingRate * timeDelta;	
		requestAnimationFrame(fadingStep);
	});
	
	buffer = document.createElement('canvas');
	buffer.width = canvas.width;
	buffer.height = canvas.height;
	bufferCtx = buffer.getContext('2d');
	bufferCtx.globalCompositeOperation = "lighter";

	var applyFade = function() {
		var fadeColor = Math.floor(opacity * 255);
		bufferCtx.clearRect(0, 0, buffer.width, buffer.height);
		bufferCtx.beginPath();
		bufferCtx.fillStyle = "rgb(" + fadeColor + ", " + fadeColor + ", " + fadeColor + ")";
		bufferCtx.fillRect(0, 0, buffer.width, buffer.height);
		bufferCtx.fill();
		bufferCtx.drawImage(canvas, 0, 0); 
		ctx.drawImage(buffer, 0, 0);

		requestAnimationFrame(applyFade);
	};

	requestAnimationFrame(fadingStep);
	requestAnimationFrame(applyFade);
};
