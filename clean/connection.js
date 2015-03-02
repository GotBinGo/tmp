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
		new_user.ws = ws;
		new_user.name = ws.id;
		new_user.id = ws.id;

		ws.on('message', function(message) 
		{
			cip.run(new_user, message);
		});

		ws.on("close",function(a)
		{	
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
		gm.join(new_user, 0);
	});
	console.log("listener running");
}
module.exports = start;
