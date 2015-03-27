var posx = 0;
var posy = 0;
var selfid = -1;
var mul = 1;
var width = 2000;
var height = 1000;
var objects = [];
var posx;
var posy;
var c;
var ctx;
var c2;
var ctx2;
var c3;
var ctx3;
var tmp = posy;
function onGameUpdate(m)
{
	var data = JSON.parse(m);
	//console.log(m);
	if(data.mode)
	{
		if(d_main_container.innerHTML.substring(1,7) != "canvas")
		{
			
			//d_main_container.innerHTML = "<canvas id='canvas' width='"+width+"' height='"+height+"' style='box-shadow: 0px 10px 6px -6px #000; max-width:100%;max-height:100%;position:absolute;margin:auto;top:0;right:0;left:0;bottom:0;border:1px solid #000000;'>></canvas>";
			d_main_container.innerHTML = "<canvas id='canvas' width='"+width+"' height='"+height+"' style='box-shadow: 0px 10px 6px -6px #000;  position:absolute; border:1px solid #000000;'>></canvas>";
			d_main_container.innerHTML += "<canvas id='canvas2' width='"+width+"' height='"+height+"' style='box-shadow: 0px 10px 6px -6px #000; position:absolute; border:1px solid #000000;'>></canvas>";
			d_main_container.innerHTML += "<canvas id='canvas3' width='"+width+"' height='"+height+"' style='box-shadow: 0px 10px 6px -6px #000; position:absolute; border:1px solid #000000;'>></canvas>";
			 
			onResize();
			window.setInterval(function(){draw();}, 15);
			c = document.getElementById("canvas");
			ctx = c.getContext("2d");
			c2 = document.getElementById("canvas2");
			ctx2 = c2.getContext("2d");
			c3 = document.getElementById("canvas3");
			ctx3 = c3.getContext("2d");
		}

		objects = data.value;
	}
	else
	{
		d_main_container.innerHTML = data.value;
	}
}

function draw()
{
	if(d_main_container.innerHTML.substring(1,7) == "canvas")
	{
		clear();
		tmp = posy-550;
		tmp2 = posy+550;
		
		//tmp--;
		
		ctx2.fillStyle="white";
		ctx2.fillRect((-posx+400),400, 100, 100); 
		
		ctx3.fillStyle="white";
		//ctx3.fillRect(-posx+1500,400, 100, 100); 
		flag(-posx+1550,475,40,1,20, ctx3)
		
		//flag(,400, 100, 100,ctx3); 
		//ctx.translate(width, height);
		
				
		
		ctx.translate(width/2,height/2);
		ctx.scale(1/mul,1/mul);
		ctx.translate(-width/2,-height/2);
		/*
		ctx.scale(1/mul,1/mul);
		ctx.translate(width/2,height/2);
		*/
		/*var ptrn = ctx.createPattern(document.getElementById("tile"), 'repeat'); // Create a pattern with this image, and set it to "repeat".
		ctx.fillStyle = ptrn;
		ctx.translate(-posx, -posy);
		ctx.fillRect(0, 0, width, height);
		ctx.translate(posx, posy);*/
/*
		ctx.fillStyle="white";
		ctx.fillRect(width/2-posx,height/2-posy,width,height); 
		ctx.fillStyle="black";*/
		//text(0, 50, "Tomi", 50, "red");
		for(var i = 0; i < objects.length; i++)
		{
			drawElement(objects[i]);
		}
		var tm = ctx.globalCompositeOperation;
		ctx.globalCompositeOperation='destination-over';
		ctx.strokeStyle = 'rgba(70,70,255,0.3)';
		for(var i = -1000; i <= 1000; i+= 100)
		{
			//for(var j = -800; j < 900; j+= 100)
				line(i+width/2-posx, -1000+height/2-posy, i+width/2-posx, 1000+height/2-posy,5);
				line(-1000+width/2-posx, i+height/2-posy, 1000+width/2-posx, i+height/2-posy,5);
//				image(i,j);
		}
		/*
		ctx.fillStyle="#222";
		 
		ctx.fillRect(0,0,-1000+width/2-posx, height); 
		ctx.fillRect(2000-posx,0,posx, height); 	
		ctx.fillRect(0,0,width, -1000+height/2-posy);
		ctx.fillRect(0,1000,width, height/2-posy);
		*/

		ctx.fillStyle="#ddd";
		ctx.fillRect(-1000+width/2-posx, -1000+height/2-posy, 2000, 2000);
		ctx.fillStyle="#333";
		ctx.fillRect(-2000+width/2-posx, -2000+height/2-posy, 4000, 4000); 
		
		ctx.globalAlpha=1;
		ctx.strokeStyle = 'rgba(0,0,0,1)';		
		ctx.globalCompositeOperation = tm;
		/*
		objects.forEach(function (e)
		{			
			drawElement(e);
		});*/
		$('#canvas').css('transform',' perspective(1500px)   rotate3d(1,0,0,70deg)translate3d(0,0px,0)');
		//tmp = 200;
		$('#canvas2').css('transform',' perspective(1500px)  translate3d(0,'+-tmp/2+'px,'+-tmp+'px) rotate3d(1,0,0,-30deg) translate3d(0px,'+tmp/8+'px,'+tmp/8+'px)');
		$('#canvas3').css('transform',' perspective(1500px)  translate3d(0,'+-tmp2/2+'px,'+-tmp2+'px) rotate3d(1,0,0,-30deg) translate3d(0px,'+tmp2/8+'px,'+tmp2/8+'px)');
	
		//document.title = tmp;
	}
}
function drawElement(e)
{	
	if(e.type == "circle")
		if(e.position == "absolute")
			circle(e.x, e.y, e.r, e.c);
		else
			circle(e.x+width/2-posx, e.y+height/2-posy, e.r, e.c);
	else if(e.type == "line")
		if(e.position == "absolute")
			line(e.x, e.y, e.x+e.w, e.y+e.h);
		else
			line(e.x+width/2-posx, e.y+height/2-posy, e.x+width/2-posx+e.w, e.y+height/2-posy+e.h);
	else if(e.type == "wall")
			line(e.x+width/2-posx, e.y+height/2-posy, e.x2+width/2-posx, e.y2+height/2-posy, 5);
	else if(e.type == "text")
		if(e.position == "absolute")
			text(e.x*width/2000, e.y/*-height/mul*/, e.text, e.size, e.color, e.align);
		else
			text(e.x+width/2-posx, e.y+height/2-posy, e.text, e.size, e.color, e.align);
	else if(e.type == "flag")
		flag(e.x+width/2-posx, e.y+height/2-posy,e.r,e.team, !e.taken);
	else if(e.type == "pos")
	{
		posx = e.x;
		posy = e.y;
	}
}
function line(x,y,x2,y2,w, c)
{	
	if(c==undefined)
		c = ctx;
	if(w == undefined)
		w = 1;
	c.lineWidth = w;	
	c.beginPath();
	c.moveTo(x,y);
	c.lineTo(x2,y2);
	c.closePath();
	c.stroke();
	c.lineWidth = 1;
}
function text(x, y, text, size, color, align)
{
	if(align == "center")
		ctx.textAlign = 'center';
	else
		ctx.textAlign = 'start';
	if(color == undefined)
		color = "black";
	ctx.fillStyle = color;
	if(size == undefined)
		size = 20;
	ctx.font = size+"px arial";
	ctx.fillText(text, x, y);
	//ctx.fillText(text, x, y);

}
function image(x,y)
{			
	ctx.drawImage(document.getElementById("tile"),x+width/2-posx,y+height/2-posy);
}
function circle(x,y,r,c)
{			
	if(r > 10)
	{	
		ctx.shadowBlur = 5;
		ctx.shadowOffsetY = 5;
	}
    ctx.shadowColor = 'rgba(0,0,0,0.5)';
	ctx.beginPath();
	ctx.fillStyle=c;
	ctx.arc(x, y, r, 0, 2 * Math.PI, false);	
	ctx.fill();
	//ctx.stroke();
	ctx.closePath();
	ctx.fillStyle="black";
	ctx.shadowBlur = 0;
	ctx.shadowOffsetY = 0;
}
function flag(x,y,r,team,s, cc)
{	
	var c = cc;
	if (cc === undefined)
		c = ctx; 
		
		
	var col = team == 0 ? "red" : "blue";
	//circle(x,y,r,"green");
	if(s && cc === undefined)
	{
		c.beginPath();
		c.arc(x, y, r, 0, 2 * Math.PI, false);	
		c.stroke();
		c.closePath();
	}
	else
	{
		line(x,y-25,x,y+25,2,c);
		line(x-1,y-25,x-1,y+25,2,c);
		c.fillStyle=col;
		c.beginPath();	
		c.moveTo(x+20,y-10);
		c.lineTo(x,y-25);
		c.lineTo(x,y+5);
		c.lineTo(x+20,y-10);
		c.stroke();
		c.closePath();
		c.fill();
	}

}
function clear()
{
	c.width = c.width;
	c2.width = c.offsetWidth;
	c3.width = c.offsetWidth;
	//c3.width = c.style.width;
	
	/*
	ctx.fillStyle="white";
	//ctx.globalAlpha=0.03;
	ctx.fillRect(0,0,width,height); 
	ctx.globalAlpha=1;
*/
}