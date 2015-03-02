module.exports = game;
function game(gid)
{
	//private
	var players = [];
	var gid = gid;
	var state = "lobby";
	var join_running = true;	
	var timer;
	var last_time = Date.now();
	var elapsed;
	function close ()
	{
		clearInterval(timer);
	}
	function tick()
	{
		elapsed = Date.now()-last_time;
		update()
		send();		
		last_time = Date.now();
	}
	function update()
	{
		players.forEach(function (e)
		{
			e.vx *= 0.9389;
			e.vy *= 0.9389;
			if(e.keys[0])
				e.vx-=0.01;
			if(e.keys[1])
				e.vy-=0.01;
			if(e.keys[2])
				e.vx+=0.01;
			if(e.keys[3])
				e.vy+=0.01;
			e.px += e.vx * elapsed;
			e.py += e.vy * elapsed;
		});	
	}
	function send()
	{
		var tmp = [];
		players.forEach(function (e){
			tmp.push({name:e.user.name, px:e.px, py:e.py});
		});		
		players.forEach(function (e){		
			e.user.send("/gbm " + JSON.stringify(tmp));
		});		
	}
	//public
	function join(user)
	{			
		players[user.id] = {user:user, team:-1, score: 0, px:0, py:0, vx:0, vy:0, keys:[false, false, false, false]};
		console.log(user.name+"joined the game");
		user.send("/olobb this is a game");
		if(state == "lobby")
			start();
	}
	function leave (user)
	{		
		delete players[user.id];
		if(players.filter(function(value) { return value !== undefined }).length == 0)
			close();
	}
	function start()
	{
		state = "running";		
		timer = setInterval(function (){tick()}, 10);
	}
	function message(user, msg)
	{
		var arr = msg.split(" ");
		players[user.id].keys[arr[2]] = arr[3] == '1' ? true : false;
		//console.log("gamemessage " + players[user.id].keys)
	}
	Object.defineProperty(this,"join", {writable: false, value: join});	
	Object.defineProperty(this,"leave", {writable: false, value: leave});
	Object.defineProperty(this,"start", {writable: false, value: start});
	Object.defineProperty(this,"message", {writable: false, value: message});
}
