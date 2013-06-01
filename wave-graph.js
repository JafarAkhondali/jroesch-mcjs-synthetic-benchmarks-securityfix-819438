/* Adapted from http://js1k.com/2010-first/demo/154 */
var WIDTH = 640;
var HEIGHT = 400;
var context;
var zzdir = -1;
	
var canvas = document.getElementById("c");
canvas.width = WIDTH;
canvas.height = HEIGHT;
context = canvas.getContext("2d");

function draw(z, red, green, blue, zz) {
	context.strokeStyle = "rgb(" + red + "," + green + "," + blue + ")";

	context.beginPath();
	y = ((HEIGHT/2-zz) * Math.sin((Math.PI*2)*(z/WIDTH))) + HEIGHT/2;
	context.moveTo(0, y);
	for(var x = 0; x < WIDTH; x+=10) {
		y = (HEIGHT/2-zz) * Math.sin((Math.PI*2)*((x+z)/WIDTH)) + HEIGHT/2;
		context.lineTo(x,y);
		context.moveTo(x,y);
	}
	context.stroke();
	context.closePath();
	
	z--;
	zz += zzdir;
	if(z <= 0) {
		z = WIDTH;
	}
	if(zz <= 0) {
		zzdir = 1;
	}
	if(zz >= HEIGHT) {
		zzdir = -1;
	}
	red+=Math.round(Math.sin(z)*20)-10;
	green+=Math.round(Math.cos(z)*20)-10;
	blue+=Math.round(Math.tan(z)*20)-10;
	if(red > 255 || red < 0) {
		red = Math.round(Math.random()*255);
	}
	if(green < 0 || green > 255) {
		green = Math.round(Math.random()*255);
	}
	if(blue < 0 || blue > 255) {
		blue = Math.round(Math.random()*255);
	}
	call = "draw(" + z + "," + red + "," + green + "," + blue + "," + zz + ")";
	setTimeout(call, 0);
}

draw(WIDTH, Math.round(Math.random()*255), Math.round(Math.random()*255), Math.round(Math.random()*255), HEIGHT);

