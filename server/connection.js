function start(port,interpreter)
{
	var WebSocketServer = require('ws').Server;
	wss = new WebSocketServer({port: port});
	console.log("listening on " + port)
	var sockets = [];
	var socket_counter = 0;


	wss.on('connection', function(ws) 
	{

		console.log("connect" + socket_counter)
		ws.id = socket_counter;
		socket_counter++; 
		//ws.name = ws.id;
		sockets[ws.id] = ws;


		var new_user = {};
		//new_user.gid = -1;
		new_user.ws = ws;
		new_user.name = ws.id;
		new_user.id = ws.id;

		//interpreter.joinGroup(new_user, 0);


		ws.on('message', function(message) 
		{
			interpreter.run(new_user, message);
		});

		ws.on("close",function(a)
		{	
			console.log("close"+ws.id);
			console.log("dc with "+new_user.id);
			interpreter.ddc(new_user);

		});

		ws.on("error",function(error){
			console.log("B.F.E." + error);
			console.log("I repeat, code B.F.E.");
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
		interpreter.joinGroup(new_user, 0);
	});
	console.log("listener running");
}
module.exports = start;
