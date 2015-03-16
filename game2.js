module.exports = game;
var gr = 20;
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
	function close()
	{
		clearInterval(timer);
	}
	function tick()
	{
		elapsed = Date.now()-last_time+0.00001;
		update()
		sendBalls();
		last_time = Date.now();
	}
	function custcoll(m1, m2, R, e, f)
	{
		var mode = 'f';
		var r1 = gr;
		var r2 = gr;
		var c = {e:e, f:f};
		var x1 = e.px;
		var y1 = e.py;
		var x2 = f.px;		
		var y2 = f.py;
		
		var vx1 = e.vx;
		var vy1 = e.vy;
		var vx2 = f.vx;		
		var vy2 = f.vy;

		var pi2=2*Math.acos(-1);
		var r12=r1+r2;
		var m21=m2/m1;
		var x21=x2-x1;
		var y21=y2-y1;
		var vx21=vx2-vx1;
		var vy21=vy2-vy1;
		
		var vx_cm = (m1*vx1+m2*vx2)/(m1+m2) ;
		var vy_cm = (m1*vy1+m2*vy2)/(m1+m2) ;


		if ( vx21==0 && vy21==0 ) 
			return c;
      
		var gammav = Math.atan2(-vy21,-vx21);        
		var d = Math.sqrt(x21*x21 +y21*y21);

		var gammaxy=Math.atan2(y21,x21);
		var dgamma=gammaxy-gammav;
		if (dgamma>pi2) 
			dgamma=dgamma-pi2;
		else if (dgamma<-pi2) 
			dgamma=dgamma+pi2;
       var dr=d*Math.sin(dgamma)/r12;
       var alpha=Math.asin(dr);
       var a=Math.tan( gammav + alpha);

       var dvx2=-2*(vx21 +a*vy21) /((1+a*a)*(1+m21));
       
       vx2=vx2+dvx2;
       vy2=vy2+a*dvx2;
       vx1=vx1-m21*dvx2;
       vy1=vy1-a*m21*dvx2;
       c.e.vx=(vx1-vx_cm)*R + vx_cm;
       c.e.vy=(vy1-vy_cm)*R + vy_cm;
       c.f.vx=(vx2-vx_cm)*R + vx_cm;
       c.f.vy=(vy2-vy_cm)*R + vy_cm;
	   //console.log(vx_cm + " " +vx1+ " " +R + " " + gammav);
	   c.coll = true;
		return c;
	}
	function update()
	{
		players.forEach(function (e)
		{
			
		/*	e.vx *= Math.pow(1-0.9789,elapsed*5);
			e.vy *= Math.pow(1-0.9789,elapsed*5);

			//for(var i = 0; i < elapsed; i ++)
			
			//	console.log(i);
*/
			e.vx *= 0.99;
			e.vy *= 0.99;
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
			players.forEach(function (f)
			{			
				if(f.user.id != e.user.id)
				{
				var dx = e.px-f.px;
				var dy = e.py-f.py;
				var ds = dx*dx +dy*dy;
				var dss = Math.sqrt(ds);
				if(ds<(gr+gr)*(gr+gr))
				{					
					var mag = e.vx*dx+e.vy*dy;					
					if(!(mag>0))
					{
						var c = custcoll(1,1,1,e,f);	
						coll = c.coll;
						//console.log(c);
						e.vx = c.e.vx;
						e.vy = c.e.vy;
						f.vx = c.f.vx;
						f.vy = c.f.vy;
						
	
						e.px = c.e.px;
						e.py = c.e.py;
						f.px = c.f.px;
						f.py = c.f.py;
						/*
						console.log("coll");
						var tmpp = e.vx;
						e.vx = f.vx;
						f.vx = tmpp;
						
						tmpp = e.vy;
						e.vy = f.vy;
						f.vy = tmpp;
						
					/*
						mag /= ds;
						e.vx -= 2*dx*mag;
						e.vy -= 2*dy*mag;
						e.px += e.vx;
						e.py += e.vy;
						e.px += e.vx;
						e.py += e.vy;
						e.vx += dx*mag;
						e.vy += dy*mag;		*/
					}
				}}
				
			});
			objects.forEach(function (f)
			{
				var c = f.collide(e.px,e.py,e.vx*elapsed/1000,e.vy*elapsed/1000);
				e.vx = c.vx*1000/elapsed;
				e.vy = c.vy*1000/elapsed;
				e.px = c.px;
				e.py = c.py;
				if(isNaN(c.px) || isNaN(c.vx) || isNaN(c.py) || isNaN(c.vy))
				{	
					console.log(e);
					console.log(f);
					console.log(c);
					console.log(elapsed);
					throw "end";
				}
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
				e.vx-=3;
			if(e.keys[1])
				e.vy-=3;
			if(e.keys[2])
				e.vx+=3;
			if(e.keys[3])
				e.vy+=3;
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
			tmp.push({id:e.user.id, name:e.user.name, px:e.px, py:e.py,type:'ball'});
		});		
		players.forEach(function (e){	
			tmp.splice(0, 0, {px:e.px, py:e.py, id:e.user.id, type:"self"});
			e.user.send("/gbm " + JSON.stringify(tmp));
			tmp.shift();
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
				this.x -= gr;
				if(e.px < this.x && e.px+e.vx >= this.x-1)
				{
					e.px = this.x-Math.abs(px+vx-this.x);
					e.vx = -Math.abs(vx);					
					collx = true;
				}
				this.x += 2*gr;
				if(e.px > this.x && e.px+e.vx <= this.x+1)
				{
					e.px = this.x + Math.abs(px+vx-this.x);
					e.vx = Math.abs(vx);					
					collx = true;
				}
				this.x -=gr;
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
				this.y -= gr;
				if(e.py < this.y && e.py+e.vy >= this.y-1)
				{
					e.py = this.y-Math.abs(py+vy-this.y);
					e.vy = -Math.abs(vy);
					//console.log("be");
					colly = true;
				}
				this.y +=2*gr;
				if(e.py > this.y && e.py+e.vy <= this.y+1)
				{
					e.py = this.y + Math.abs(py+vy-this.y);
					e.vy = Math.abs(vy);
					//console.log("bc");
					colly = true;
				}
				this.y -=gr;
			}
			e.colly = colly;
			return e;
		}
	}
	function circle(x, y, r)
	{
		this.x = x;
		this. y = y;
		this.r = r;
		this.type = "circle";
		this.collide = function (px, py, vx, vy)
		{
			var e = {px:px,py:py,vx:vx,vy:vy};
			var coll = false;
			var dx = px-this.x;
			var dy = py-this.y;
			var ds = dx*dx +dy*dy;
			if(ds<(r+gr-10)*(r+gr-10))
			{
				var mag = vx*dx+vy*dy;
				if(!(mag>0))
				{
					mag /= ds;
					e.vx -= 1.7*dx*mag;
					e.vy -= 1.7*dy*mag;
					// e.vx = 0;
					// e.vy = 0;
					e.px += e.vx;
					e.py += e.vy;
					// e.px += e.vx;
					// e.py += e.vy;

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
		
		objects.push(new vline(100,0,50));
		objects.push(new vline(150,50,500));
		objects.push(new hline(50,100,500));
		objects.push(new circle(100,50,11));
		objects.push(new circle(50,200,50));
		/*
		var tmp = [];
		objects.forEach(function (e){
			tmp.push({x:e.x, y:e.y, w:e.w, h:e.h,type:'wall'});
		});
		players.forEach(function (e){
			e.user.send("/gbm " + JSON.stringify(tmp));
		});*/
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


