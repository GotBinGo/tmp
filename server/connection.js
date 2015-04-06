function start(port,rm)
{
	cip = rm.cip;	
	gm = rm.gm;
	
	var WebSocketServer = require('ws').Server;
	wss = new WebSocketServer({port: port});
	console.log("listening on " + port)

	var socket_counter = 0;
	wss.on('error', function(ws) 
	{
		console.log("error");		
		console.log("\t" + ws.code);		
	});
	wss.on('connection', function(ws) 
	{
		//console.log("connect" + socket_counter)
		ws.id = socket_counter;
		socket_counter++; 

		var new_user = {};
		new_user.active = false;
		new_user.ws = ws;
		new_user.id = ws.id;
		new_user.name = ws.id;
		new_user.score = 0;

		ws.on('message', function(message) 
		{			
			//console.log(message);
			if(message.split(' ')[0] == "/sn")
			{			
				new_user.name = message.split(' ')[1];
				new_user.active = true;
				gm.join(new_user, 0);
			}
			else if(new_user.active)
				cip.run(new_user, message);
		});

		ws.on("close",function(a)
		{	
			if(new_user.active)
				gm.leave(new_user);	
		});

		ws.on("error",function(error){
			console.log("hiba: " + error);
		});
		
		ws.u_send = ws.send;
		ws.send = function (msg)
		{
			if(ws.readyState == 1)
				ws.u_send(msg)
			else
				console.log(ws.id+"must have left")
		}
		new_user.send = ws.send;		
		
	});
	console.log("listener running");
}
module.exports = start;
