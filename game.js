var posx = 0;
var posy = 0;
var selfid = -1;
var width = 500;
var height = 500;
function onLobby(data)
{
	console.log("olobb "+ data);
	d_main_container.innerHTML = "<canvas id='canvas' width='1000' height='1000' style='max-width:100%;max-height:100%;position:absolute;margin:auto;top:0;right:0;left:0;bottom:0;border:1px solid #000000;'>></canvas>";
	c = document.getElementById("canvas");
	ctx = c.getContext("2d");
}
function onGameUpdate(data)
{
	draw(JSON.parse(data));
}
function draw(data)
{
	clear();
	data.forEach(function (e){drawElement(e);});				
}
function drawElement(e)
{
	if(e.type == "self")
	{						
			posx = e.px;
			posy = e.py
			selfid = e.id
			//console.log(selfid);
	}
	if(e.type == "ball")
		if(e.id != selfid)
			circle(e.px, e.py, 20);
		else
			circle(0+posx, 0+posy, 20);
	else if(e.type == "wall")
		line(e.x, e.y, e.x+e.w, e.y+e.h);
	else if(e.type == "circle")
			circle(e.x, e.y, e.r-10);
}
function line(x,y,x2,y2)
{
	ctx.beginPath();
	ctx.moveTo(x+width/2-posx,y+height/2-posy);
	ctx.lineTo(x2+width/2-posx,y2+height/2-posy);
	ctx.stroke();
}
function circle(x,y,r)
{			
	ctx.beginPath();
	ctx.arc(x+width/2-posx, y+height/2-posy, r, 0, 2 * Math.PI, false);
	ctx.fill();
	ctx.stroke();
}
function clear()
{
	c.width = c.width;	
	ctx.fillStyle="white";
	ctx.globalAlpha=0.03;
	ctx.fillRect(0,0,1000,1000); 
	ctx.globalAlpha=1;
	ctx.fillStyle="red";
}