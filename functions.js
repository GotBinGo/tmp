var pageleave = false;
window.addEventListener("beforeunload", function (event) {
	pageleave = true;
});
var posx = 0;
var posy = 0;
var selfid = -1;
var width = 500;
var height = 500;
function printMessage(message)
{
	var on_bottom = false;
	//console.log(d_messages.scrollTop + parseInt(window.getComputedStyle(d_messages, null).getPropertyValue("height"))+" "+ d_messages.scrollHeight);
	if(d_messages.scrollTop + 10 + parseInt(window.getComputedStyle(d_messages, null).getPropertyValue("height")) >= d_messages.scrollHeight)
		on_bottom = true;
	
	var new_span = document.createElement("SPAN");
	var new_br = document.createElement('br');
	new_span.style.display = "block";
	new_span.style.lineHeight = "17px";
	new_span.textContent = message;
	d_messages.appendChild(new_span);
	//d_messages.appendChild(new_br);	
	if(on_bottom)
		d_messages.scrollTop = d_messages.scrollHeight;
}
function onCommand(msg)
{
	var cmd = [msg.substring(0,msg.indexOf(" "))].concat(msg.substring(msg.indexOf(" ")+1,msg.length));
	if(cmd[0] == "/ourc")
		onUserRoster(cmd[1]);
	else if(cmd[0] == "/ogrc")
		onGroupRoster(cmd[1]);
	else if(cmd[0] == "/olobb")
		onLobby(cmd[1]);
	else if(cmd[0] == "/gbm")
		onGameUpdate(cmd[1]);
}
function onLobby(data)
{
	console.log("olobb "+ data);
	d_main_container.innerHTML = "<canvas id='canvas' width='1000' height='1000' style='max-width:100%;max-height:100%;position:absolute;margin:auto;top:0;right:0;left:0;bottom:0;border:1px solid #000000;'>></canvas>";
	c = document.getElementById("canvas");
	ctx = c.getContext("2d");
}
function onUserRoster(data)
{
	console.log("ourc"+ data);
	var arr = JSON.parse(data);
	d_info_area_container.innerHTML = "";
	d_info_area_header.innerHTML = "";
	for(var i = 0; i< arr.length; i ++)
	{
		var new_div = document.createElement("DIV");
		var a = "<div style='margin-bottom:5px; width:100%; position:relative; box-sizing:border-box; padding:5px 5px 5px 5px; background-color:#333; color:#ddd'>"+arr[i].name+"</div>";
		new_div.innerHTML = a;
		//d_main_container.appendChild(new_div);
		
		if(i == 0)
		{
			var a = "<div style='margin-bottom:5px; height:100%; width:100%; position:relative; box-sizing:border-box; padding:5px 5px 5px 5px; background-color:#333; color:#ddd'><h3 style='margin:0;'>"+arr[i].name+"</h3></div>";
			new_div.innerHTML = a;
			d_info_area_header.appendChild(new_div);
		}
		else
			d_info_area_container.appendChild(new_div);
	}		
}
function onGroupRoster(data)
{
	console.log("ogrc " + data);
	var arr = JSON.parse(data);
	d_main_container.innerHTML = "";
	for(var i = 0; i< arr.length; i ++)
	{
		var new_div = document.createElement("DIV");
		var a = "<div style='margin-bottom:5px; width:100%; position:relative; box-sizing:border-box; padding:5px 105px 5px 5px; background-color:#333; color:#ddd'><h3 style='margin:0;'>"+arr[i].name+"</h3>Players: 1, 2, 3<div style='position:absolute; top:0;bottom:0;right:0;width:100px;'><input type='button' value='Join' onclick='ws.send(\"/g j "+arr[i].id+"\");'style='width: 100%; height:100%;'/></div></div>";
		new_div.innerHTML = a;
		d_main_container.appendChild(new_div);
		//d_info_area_container.appendChild(new_div);
	}				
	//console.log(a);				
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
			console.log(selfid);
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
var sent = [];
var currup = 0;
function sendinp()
{				
	if(inp.value != "")
	{
		ws.send(inp.value);			
		currup = 0;
		sent.push(inp.value)
		inp.value = "";
		document.getElementById('inp').focus()
		return false;
	}
}		

var d_messages;
var d_main_container;
var d_info_area_container;
var d_info_area_header;
var c;
var ctx;
var keys = [false, false, false, false];
window.onload = function()
{
	console.log("loaded");
	d_messages = document.getElementById('messages');
	d_main_container = document.getElementById('main_container');
	d_info_area_container = document.getElementById('info_area_container');
	d_info_area_header = document.getElementById('info_area_header');
	var dcd;
	var start = function () {
		window.open = false;	
		var wsImpl = window.WebSocket || window.MozWebSocket;           
		//window.ws = new wsImpl('ws://s13.webtar.hu:80/');
		window.ws = new wsImpl('ws://192.168.0.67:80');

		ws.onmessage = function (evt) 
		{
			//pre.innerHTML += evt.data; 
			if(evt.data[0] == "/")
				onCommand(evt.data);
			else
			printMessage(evt.data);
		};
		ws.onopen = function () {
			printMessage("Connected");
			dcd = false;
			window.open = true;
		};
		ws.onclose = function () {
			if(dcd === undefined)							
				printMessage("Unable to connect, reconnecting...");																		
			else if(!dcd)							
				printMessage("Disconnected, reconnecting...");																		
			dcd = true;
			if (!pageleave)
				reconn();
		};       
	}
	reconn();
	//start();
	window.addEventListener("keydown",onKeyDown);
	window.addEventListener("keyup",onKeyUp);
	//d_messages.innerHTML = "asd";
	function reconn()
	{					
		console.log("reconn called");
		window.setTimeout(function (){start()},500);			
	}
}

function onKeyDown(e)
{
	if(e.keyCode == 13)
	{			
		if(document.activeElement.id == "inp")
			sendinp();
	}
	if(e.keyCode == 37)
	{
		if(document.activeElement.id != "inp")
		{
			if(!keys[0])
			{
				keys[0] = true;
				ws.send("/game keys 0 1");
			}
		}
	}
	if(e.keyCode == 38) //up
	{	
		if(document.activeElement.id == "inp")
		{
			if(currup < sent.length)
			{
				currup++;				
				inp.value = sent[sent.length-currup];
			}
			e.preventDefault();
		}
		else 
		{
			if(!keys[1])
			{
				keys[1] = true;
				ws.send("/game keys 1 1");
			}
		}

	}
	if(e.keyCode == 39 )
	{
		if(document.activeElement.id != "inp")
		{
			if(!keys[2])
			{
				keys[2] = true;
				ws.send("/game keys 2 1");
			}
		}
	}
	if(e.keyCode == 40) //down
	{			
		if(document.activeElement.id == "inp")
		{
			if(currup > 1)
			{
				currup--;			
				inp.value = sent[sent.length-currup];
			}						
		}
		else 
		{
			if(!keys[3])
			{
				keys[3] = true;
				ws.send("/game keys 3 1");
			}
		}
	}					
}
function onKeyUp(e)
{
	if(e.keyCode == 37)
	{
		if(keys[0])
		{
			keys[0] = false;
			ws.send("/game keys 0 0");
		}
	}
	if(e.keyCode == 38)
	{
		if(keys[1])
		{
			keys[1] = false;
			ws.send("/game keys 1 0");
		}
	}
	if(e.keyCode == 39)
	{
		if(keys[2])
		{
			keys[2] = false;
			ws.send("/game keys 2 0");
		}
	}
	if(e.keyCode == 40)
	{
		if(keys[3])
		{
			keys[3] = false;
			ws.send("/game keys 3 0");
		}
	}
}
function getSelectionText() 
{
	var text = "";
	if (window.getSelection) {
	text = window.getSelection().toString();
	} else if (document.selection && document.selection.type != "Control") {
		text = document.selection.createRange().text;
	}
	return text;
}
function focusIf(input)
{
	if(getSelectionText() == "")
		document.getElementById('inp').focus();	
}