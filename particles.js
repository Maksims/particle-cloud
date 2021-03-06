/*
The MIT License (MIT)
--

Copyright © 2013 Maciej Baron

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

*/

(function (ParticleCloud, $, undefined) {
	var mycanvas, context, well, vec, particlearray;

	var numParticles = 200;
	var wellRadius = 120;
	var atr = 0.9;
	var vmax = 20;
	var det = 1.2;

	function Particle(px, py, psize, pid, pcolour) {
		this.size = psize;
		this.id = pid;
    this.pos = Vec2.new(px, py);
		this.v = 0;
  	this.colour = pcolour;
  	this.dir = 0;
  	this.ddir = 0;
  	this.dirc = 0;
	}

	function drawParticle(p) {
		context.fillStyle = p.colour;
		context.beginPath();
		context.arc(p.pos[0],p.pos[1],p.size,0,Math.PI*2,true);
		context.closePath();
		context.fill();
	}

	function resizeCanvas() {
		mycanvas.width = window.innerWidth;
		mycanvas.height = window.innerHeight;
	}

	function moveParticle(p) {
    vec[0] = well[0] - p.pos[0];
    vec[1] = well[1] - p.pos[1];
    var distance = vec.len();

		p.dir = vec.rad();

    if (distance < 5) {
    	p.v = -5;
    } else if (distance <= wellRadius) {
    	p.v -= det;
    	p.dir += Math.cos(p.id);
    } else if (distance > wellRadius) {
    	p.dir -= Math.sin(p.id);
    	if (p.v < vmax) p.v += atr;
    }

    p.pos[0] += Math.cos(p.dir) * p.v * (p.size/8);
		p.pos[1] += Math.sin(p.dir) * p.v * (p.size/8);
	}

	ParticleCloud.drawFrame = function() {
    context.clearRect(0, 0, mycanvas.width, mycanvas.height);

    var i = numParticles;
    while(i--) {
			moveParticle(particlearray[i]);
			drawParticle(particlearray[i]);
		}
	}

	ParticleCloud.init = function(canvasID, numberOfParticles) {

		mycanvas = document.getElementById(canvasID);
		context = mycanvas.getContext('2d');

	 	if (typeof numberOfParticles === "number") numParticles = numberOfParticles;

		particlearray = new Array(numParticles);

		resizeCanvas();

    well = Vec2.new(mycanvas.width/2, mycanvas.height/2);
    vec = Vec2.new();

    var i = numParticles;
    while(i--) {
			randsize = 5 + Math.floor(Math.random()*5);
			randx = Math.floor(Math.random()*(mycanvas.width-randsize));
			randy = Math.floor(Math.random()*(mycanvas.height-randsize));
			colour = rgbToHex(Math.floor(Math.random()*255), Math.floor(Math.random()*255), Math.floor(Math.random()*255));
			particlearray[i] = new Particle(randx,randy,randsize,i,colour);
		}

		$(window).resize(resizeCanvas);

		$(window).mousemove(function(event){
			well[0] = event.clientX;
			well[1] = event.clientY;
		});

		$(window).mousedown(function(event){
			wellRadius += 100;
			det *= 3;
		});

		$(window).mouseup(function(event){
			wellRadius -= 100;
			det /= 3;
		});

		mycanvas.addEventListener("touchstart", touchStart, false);
		mycanvas.addEventListener("touchmove", touchMove, false);

		var self = this;

		(function animate() {
			requestAnimationFrame(animate);
			self.drawFrame();
		})();
	}

	function touchStart(event) {
		event.preventDefault();
	}

	function touchMove(event) {
		event.preventDefault();
		well[0] = event.touches[0].pageX;
		well[1] = event.touches[0].pageY;
	}

  function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
  }
  function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
  }
})(window.ParticleCloud = window.ParticleCloud || {}, jQuery);