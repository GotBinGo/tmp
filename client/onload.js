window.onload = function()
{
	var ip = "localhost";
	onResize();
	console.log("loaded");
	d_messages = document.getElementById('messages');
	d_main_container = document.getElementById('main_container');
	d_info_area_container = document.getElementById('info_area_container');
	d_info_area_header = document.getElementById('info_area_header');
	var dcd;
	var start = function () {
		window.open = false;	
		var wsImpl = window.WebSocket || window.MozWebSocket;           
//		window.ws = new wsImpl('ws://s13.webtar.hu:80/');
		//window.ws = new wsImpl('ws://192.168.15.106:80');
		console.log("connecting to: " + ip);
		window.ws = new wsImpl('ws://'+ip+':8080/');
		
		
		ws.onmessage = function (evt) 
		{
			//console.log(evt.data);
			//pre.innerHTML += evt.data; 
			
			var hel = evt.data.split("&nbsp;").join(" ");
			if(evt.data[0] == "/")
				onCommand(hel);
			else
				printMessage(hel);
		};
		ws.onopen = function () {
			printMessage("Connected");
			var bname = "";
			var good = false;
			var errors = "";
			while(!good)
			{							
				bname = prompt("Enter your nickname:"+errors);
				if(bname === null)
					location.reload();
					//bname = "";
				errors = "";				
				if(bname.length < 1)
					errors+= "\nmin. 1 character";
				if(bname.length > 23)
					errors+= "\nmax. 23 characters";
				if(bname.match(/^[A-Za-z0-9áÁéÉíÍóÓöÖőŐúÚüÜűŰ\ ]+$/) != bname || bname.trim() == "")
					errors+= "\nletters, space and numbers only";
				if (errors == "")
					good = true;
			}
			bname = bname.split(" ").join("&nbsp;")
			ws.send("/sn "+bname);
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
	xmlhttp=new XMLHttpRequest();
	xmlhttp.onreadystatechange= function()
	{
		if (xmlhttp.readyState==4 && xmlhttp.status==200)
		{
			ip = xmlhttp.responseText;
			//alert(ip)
			reconn();
		}
	}
	xmlhttp.open("GET","conn.html",true);
	xmlhttp.send();
	
	
	//start();
	window.addEventListener("keydown",onKeyDown);
	window.addEventListener("keyup",onKeyUp);	
	window.addEventListener("touchstart",function(e){down(e.changedTouches[0].pageX,e.changedTouches[0].pageY);});
	window.addEventListener("touchend",function(e){up(e.changedTouches[0].pageX,e.changedTouches[0].pageY);});
	function down(x,y)
	{
		//document.title = d_main_container.clientHeight;
		if(y < d_main_container.clientHeight/3)
			ws.send("/game keys 1 1");
			//up
		if(y > d_main_container.clientHeight/3*2)
			ws.send("/game keys 3 1");
			//down
			
		if(x < d_main_container.clientWidth/3)
			ws.send("/game keys 0 1");
			//left
		if(x > d_main_container.clientWidth/3*2)
			ws.send("/game keys 2 1");
			//right			
	}
	function up()
	{
		ws.send("/game keys 0 0");
		ws.send("/game keys 1 0");
		ws.send("/game keys 2 0");
		ws.send("/game keys 3 0");
	}
	//window.addEventListener("touchmove",function(){document.title += "b"});
	//d_messages.innerHTML = "asd";
	function reconn()
	{					
		console.log("reconn called");
		window.setTimeout(function (){start()},500);			
	}
}
function onCommand(msg)
{
	var cmd = [msg.substring(0,msg.indexOf(" "))].concat(msg.substring(msg.indexOf(" ")+1,msg.length));
	if(cmd[0] == "/ourc")
		onUserRoster(cmd[1]);
	else if(cmd[0] == "/ogrc")
		onGroupRoster(cmd[1]);
	else if(cmd[0] == "/gu")
		onGameUpdate(cmd[1]);

}