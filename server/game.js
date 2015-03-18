module.exports = game;
function game(gid, rm)
{
	//private
	var objects = [];
	var players = [];
	var gid = gid;
	var state = "lobby";
	var canvasMode = false;
	var join_running = true;	
	var timer;	
	var last_time = Date.now();
	var elapsed;
	function close()
	{
		clearInterval(timer);
	}
	function gameUpdate()
	{
		
	}
	function update()
	{	
		var elapsed = Date.now()-last_time+0.00001;
		
		players.forEach(function (e)
		{
			
			var data = {mode:canvasMode};			
			if(canvasMode)
			{
				objects.forEach(function (f)
				{					
					if(f.type == "flag")
						if(inRange(f.x,f.y,f.r, e.px, e.py, e.r)) 
						{	

							if(e.team == f.team && !f.taken)//home
							{								
								e.flags.forEach(function (g)
								{
									//console.log(g.x+" "+g.y);
									e.user.score += 1;
									rm.gm.onUserRoster(e.user.gid);
									delete g.x;
									delete g.y;
									g.x = g.ox;
									g.y = g.oy;
									g.taken = false;
									//Object.defineProperty(g, "x", { get: function () { return 0; } });
									//Object.defineProperty(g, "y", { get: function () { return 0; } });
								});
								e.flags = [];
							}
							else if(e.team != f.team && !f.taken)//pickup
							{
								Object.defineProperty(f, "x", { get: function () { return e.px; } });
								Object.defineProperty(f, "y", { get: function () { return e.py; } });
								e.flags.push(f);
								//f.x = e.px
								//f.y = e.py
								f.taken = true;
							}

						}
				});
				players.forEach(function (f)
				{
					if(inRange(f.px,f.py,f.r, e.px, e.py, e.r) && e.team != f.team) //coll with flag
					{
						if(e.flags.length > 0)
						{
							e.flags.forEach(function (g)
							{
								delete g.x;
								delete g.y;
								g.x = g.ox;
								g.y = g.oy;
								g.taken = false;
							});
							e.flags = [];
							init(e);
						}
						if(f.flags.length > 0)
						{
							f.flags.forEach(function (g)
							{
								delete g.x;
								delete g.y;
								g.x = g.ox;
								g.y = g.oy;
								g.taken = false;
							});
							f.flags = [];
							init(f);
						}
					}
				});
				
				
				e.vx *= 0.97;
				e.vy *= 0.97;
				var ex = 0;
				var ey = 0;
				if(e.keys[0])
					ex-=5;
				if(e.keys[1])
					ey-=5;
				if(e.keys[2])
					ex+=5;
				if(e.keys[3])
					ey+=5;
				//console.log(e.keys);
				var length = Math.sqrt(ex * ex + ey * ey);
				if(length != 0)
				{
					//console.log(length);
					// normalize vector
					ex /= length;
					ey /= length;

					// increase vector size
					ex *= 5;
					ey *= 5;
				}
				e.vx += ex;
				e.vy += ey;
					
				e.px += e.vx * elapsed/1000;
				e.py += e.vy * elapsed/1000;
				
				data.value = [];
				data.value.push({type:"pos",x:e.px,y:e.py});					
				if(e.keys[4])
					data.value.push({type:"line",x:50,y:50,w:20,h:10,position:"absolute"});
				
				players.forEach(function (f)
				{
					data.value.push({type:"circle",x:f.px,y:f.py,r:30,c:f.team==0 ? "red" : "blue"});
					data.value.push({type:"text",x:f.px,y:f.py,text:f.user.name});
				});
				objects.forEach(function (f)
				{
					data.value.push(f);
					//data.value.push({type:"text",x:f.px,y:f.py,text:f.user.name});
				});
			}
			else
			{			
				data.value = "";
				/*
				players.forEach(function (f)
				{
					data.value += f.user.name;
				});*/
				
				team(0).forEach(function (f)
				{
					data.value += f.user.name;
				});
				data.value += "<br>"
				team(1).forEach(function (f)
				{
					data.value += f.user.name;
				});
			}
			if(e.out != JSON.stringify(data))
			{
				e.user.send('/gu '+ JSON.stringify(data));
				e.out = JSON.stringify(data);
			}			
		});
		last_time = Date.now();
	}
	function mode(m)
	{
		if(m == 'canvas' || m === true)
		{
			canvasMode = true;		
		}
		else
		{
			canvasMode = false;
		}
	}
	function team(tid)
	{	
		return players.filter(function (e) 
		{
			if(e.team == tid)
				return true;
			else
				return false;
		});
	}
	//helper
	function inRange(x1,y1,r1,x2,y2,r2)
	{
		
		var dist = Math.sqrt((x2-x1)*(x2-x1)+(y2-y1)*(y2-y1));
		//console.log(dist + " " + r1+r2);
		if(dist < r1+r2)
			return true;
		else
			return false;
	}
	function init(e)
	{
		if(e.type == "flag")
		{
			e.x = e.ox;
			e.y = e.oy;
			e.taken = false;
			e.taken = false;
		}
		else if(e.type == "player")
		{
			
			e.px = 0;
			e.py = 0;
		}
	}
	//public
	function join(user)
	{			
		players[user.id] = {type:"player",flags:[], user:user, team:-1, score: 0, px:0, py:0, vx:0, vy:0, r:30, keys:[false, false, false, false,false], out:""};
		players[user.id].team = team(1).length < team(0).length ? 1 : 0;		
		console.log(user.name+"joined the game");		
		if(state == "lobby")
			start();
	}
	function leave (user)
	{		
		players[user.id].flags.forEach(function (g)
		{
			delete g.x;
			delete g.y;
			g.x = g.ox;
			g.y = g.oy;
			g.taken = false;
		});
		delete players[user.id];
		if(players.filter(function(value) { return value !== undefined }).length == 0)
			close();
	}
	function start()
	{
		state = "running";		
		objects.push({type:"flag",ox:-200, oy:0, r:40,team:0,taken:false});
		objects.push({type:"flag",ox:200, oy:0, r:40,team:1,taken:false});
		objects.forEach(function (e){init(e)});
		timer = setInterval(function (){update()}, 10);
		mode(true);
		
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
