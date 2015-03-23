//basic html page functions
var pageleave = false;
window.addEventListener("beforeunload", function (event) {
	pageleave = true;
});
var down = false;
function mdown(evt)
{
	var d = document.getElementById('drag');
	down = true;
}
function mup(evt)
{
	down = false;
}
function mmove(evt)
{
	var y = evt.clientY;
	var d = document.getElementById('drag');
	if(down)
	{
		if(document.body.clientHeight-120 < y ) 
			y = document.body.clientHeight-120;
		if(y < 200)
			y = 200;
			
		//console.log(y);
		d.style.top = y-6;
		var b = document.getElementById('bottom');
		b.style.height = document.body.clientHeight-y-18;
		var m = document.getElementById('main');
		m.style.height = y-20;
	}
	evt.preventDefault();
	return false;
}
function focusIf(input)
{
	if(getSelectionText() == "")
		document.getElementById('inp').focus();	
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
function onUserRoster(data)
{
	//console.log("ourc"+ data);
	var arr = JSON.parse(data);
	d_info_area_container.innerHTML = "";
	d_info_area_header.innerHTML = "";
	for(var i = 0; i< arr.length; i ++)
	{
		var new_div = document.createElement("DIV");
		var a = "<div style='margin-bottom:5px; width:100%; position:relative; box-sizing:border-box; padding:5px 5px 5px 5px; background-color:#333; color:#ddd'>"+arr[i].name+" "+ (arr[i].score === undefined ? " ":"Score: "+arr[i].score)+"</div>";
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
function helper()
{
	ws.send("/g c " + document.getElementById("gname").value);
}
function onGroupRoster(data)
{
	//console.log("ogrc " + data);	
	var arr = JSON.parse(data);
	d_main_container.innerHTML = "";	
	
	var new_div = document.createElement("DIV");
	var a = "<div style='margin-bottom:5px; width:100%; height:50px; position:relative; box-sizing:border-box; padding:10px 105px 5px 5px; background-color:#333; color:#ddd'><h3 style='margin:0;'>Create room: <input id='gname' style='background:grey; border:none; color:#DDD; font-size: 16px;padding-left: 3px;padding-top: 2px;padding-bottom: 2px;'></input></h3><div style='position:absolute; top:0;bottom:0;right:0;width:100px;'><input type='button' value='Create' onclick='helper();'style='width: 100%; height:100%;'/></div></div>";
	new_div.innerHTML = a;
	d_main_container.appendChild(new_div);
	
	
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
//keys
function onResize(e)
{	
	
	var b = document.getElementById('bottom');
	var m = document.getElementById('main');
	console.log(b.clientHeight);
	m.style.height = window.innerHeight-38 - b.clientHeight;
	var d = document.getElementById('drag');
	d.style.top = window.innerHeight-24 - b.clientHeight;
/*
	var c = document.getElementById('canvas');
	c.width = document.getElementById('main_container').clientWidth*2;
	c.height = document.getElementById('main_container').clientHeight*2;
	width = c.width;
	height = c.height;*/
}
var keys = [false, false, false, false];
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
	if(e.keyCode == 9) //TAB
	{	
		ws.send("/game keys 4 1");
		e.preventDefault();	
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
	if(e.keyCode == 9) //TAB
	{	
		ws.send("/game keys 4 0");
		e.preventDefault();	
	}	
}