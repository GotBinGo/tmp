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
	var bx = false;
	var by = false;
	var objects = [];
	function close ()
	{
		clearInterval(timer);
	}
	function tick()
	{
		elapsed = Date.now()-last_time;
		update()
		sendBalls();
		last_time = Date.now();
	}
	function update()
	{
		players.forEach(function (e)
		{
			e.vx *= 0.9789;
			e.vy *= 0.9789;

/*
			if(e.px <= 10)
			{
				e.vx = Math.abs(e.vx);
				e.px += Math.abs(e.px-10);
			}
			if(e.px >= 100)
			{
				e.vx = -Math.abs(e.vx);
				e.px -= Math.abs(e.px-100);
			}
			if(e.py <= 10)
			{
				e.vy = Math.abs(e.vy);
				e.py += Math.abs(e.py-10);
			}
			
			if(e.py >= 100)
			{
				e.vy = -Math.abs(e.vy);
				e.py -= Math.abs(e.py-100);
			}*/
			var collx = false;
			var colly = false;
			var coll = false;
			objects.forEach(function (f)
			{
				var c = f.collide(e.px,e.py,e.vx*elapsed/1000,e.vy*elapsed/1000);
				e.vx = c.vx*1000/elapsed;
				e.vy = c.vy*1000/elapsed;
				e.px = c.px;
				e.py = c.py;
				if(c.collx)
					collx = true;
				if(c.colly)
					colly = true;
				if(c.coll)
				{
					collx = true;
					colly = true;
				}
			});
			if(e.keys[0])
				e.vx-=1;
			if(e.keys[1])
				e.vy-=1;
			if(e.keys[2])
				e.vx+=1;
			if(e.keys[3])
				e.vy+=1;
			if(!collx && !coll)
				e.px += e.vx * elapsed/1000;
			if(!colly && !coll)
				e.py += e.vy * elapsed/1000;


		});
	}
	function sendBalls()
	{
		var tmp = [];
		objects.forEach(function (e){
			tmp.push({x:e.x, y:e.y, w:e.w, h:e.h ,type:e.type,r:e.r});
		});
		players.forEach(function (e){
			tmp.push({name:e.user.name, px:e.px, py:e.py,type:'ball'});
		});		
		players.forEach(function (e){		
			e.user.send("/gbm " + JSON.stringify(tmp));
		});
/*		var tmp = [];
		objects.forEach(function (e){
			tmp.push({x:e.x, y:e.y, w:e.w, h:e.h,type:'wall'});
		});
		players.forEach(function (e){
			e.user.send("/gbm " + JSON.stringify(tmp));
		});*/

	}
	function vline(x,y,h)
	{
		this.x = x;
		this.y = y;
		this.h = h;
		this.w = 0;
		this.type = "wall";
		this.collide = function (px, py, vx, vy)
		{
			var e = {px:px,py:py,vx:vx,vy:vy};
			//console.log(this.x+" "+e.px+" "+(e.px+e.vx));
			var collx = false;
			
			if(py+vy >this.y && py+vy <= this.y+h)
			{
				this.x -= 10;
				if(e.px < this.x && e.px+e.vx >= this.x-1)
				{
					e.px = this.x-Math.abs(px+vx-this.x);
					e.vx = -Math.abs(vx);
					console.log("be");
					collx = true;
				}
				this.x += 20;
				if(e.px > this.x && e.px+e.vx <= this.x+1)
				{
					e.px = this.x + Math.abs(px+vx-this.x);
					e.vx = Math.abs(vx);
					console.log("bc");
					collx = true;
				}
				this.x -=10;
			}
			e.collx = collx;
			return e;
		}	
	}
	function hline(y,x,w)
	{
		this.x = x;
		this.y = y;
		this.h = 0;
		this.w = w;
		this.type = "wall";
		this.collide = function (px, py, vx, vy)
		{
			var e = {px:px,py:py,vx:vx,vy:vy};
			//console.log(this.x+" "+e.px+" "+(e.px+e.vx));
			var colly = false;
			
			if(px+vx >this.x && px+vx <= this.x+w)
			{
				this.y -= 10;
				if(e.py < this.y && e.py+e.vy >= this.y-1)
				{
					e.py = this.y-Math.abs(py+vy-this.y);
					e.vy = -Math.abs(vy);
					console.log("be");
					colly = true;
				}
				this.y +=20;
				if(e.py > this.y && e.py+e.vy <= this.y+1)
				{
					e.py = this.y + Math.abs(py+vy-this.y);
					e.vy = Math.abs(vy);
					console.log("bc");
					colly = true;
				}
				this.y -=10;
			}
			e.colly = colly;
			return e;
		}
	}
	function circle(x, y, r)
	{
		this.x = x;
		this.y = y;
		this.r = r;
		this.type = "circle";
		this.collide = function (px, py, vx, vy)
		{
			var e = {px:px,py:py,vx:vx,vy:vy};
			var coll = false;
			var dx = px-this.x;
			var dy = py-this.y;
			var ds = dx*dx +dy*dy;
			if(ds<(r+0)*(r+0))
			{
				var mag = vx*dx+vy*dy;
				if(!(mag>0))
				{
					mag /= ds;
					e.vx -= 2*dx*mag;
					e.vy -= 2*dy*mag;
					colly = true;
				}
			}
			
			e.coll = coll;
			return e;
		}	
	}

	//public
	function join(user)
	{			
		players[user.id] = {user:user, team:-1, score: 0, px:10, py:10, vx:0, vy:0, r:10, keys:[false, false, false, false]};
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
		objects.push(new vline(100,0,50));
		objects.push(new vline(150,50,500));
		objects.push(new hline(50,100,500));
		objects.push(new circle(110,40,21));
		var tmp = [];
		objects.forEach(function (e){
			tmp.push({x:e.x, y:e.y, w:e.w, h:e.h,type:'wall'});
		});
		players.forEach(function (e){
			e.user.send("/gbm " + JSON.stringify(tmp));
		});

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
