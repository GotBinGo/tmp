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
	function custcoll(m1, m2, R, e, f)
	{
		var mode = 'f';
		var r1 = e.r;
		var r2 = f.r;
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
       var a=Math.tan(gammav + alpha);

       var dvx2=-2*(vx21 +a*vy21) /((1+a*a)*(1+m21));
       
       vx2=vx2+dvx2;
       vy2=vy2+a*dvx2;
       vx1=vx1-m21*dvx2;
       vy1=vy1-a*m21*dvx2;
	   //console.log(y2+""+x2);
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
		var elapsed = Date.now()-last_time+0.00001;
		
		players.forEach(function (e)
		{
			//console.log(e.r);
			var data = {mode:canvasMode};			
			if(canvasMode)
			{
				var collx;
				var colly;
				var coll;
				players.forEach(function (f)
				{
					if(e.px == f.px && e.py == f.py && f.user.id != e.user.id)
					{
						e.px+= 1;
						e.py+= 1;
					}
				});
				objects.forEach(function (f)
				{
					//console.log(objects.length);
					if(f.type == "circle")
					{
						var dx = e.px-f.x;
						var dy = e.py-f.y;
						var ds = dx*dx +dy*dy;
						if(ds<(e.r+f.r)*(e.r+f.r))
						{
							var mag = e.vx*dx+e.vy*dy;
							if(!(mag>=0))
							{
								mag /= ds;
								e.vx -= 1.7*dx*mag;
								e.vy -= 1.7*dy*mag;
								// e.vx = 0;
								// e.vy = 0;
								e.px += e.vx*(elapsed/1000);
								e.py += e.vy*(elapsed/1000);
								// e.px += e.vx;
								// e.py += e.vy;

								coll = true;
							}
						}
					}
					if(f.type == "wall")
					{
						e.vx = e.vx*(elapsed/1000);
						e.vy = e.vy*(elapsed/1000);
						if(isVertical(f))
						{
							if(e.py+e.vy > f.y && e.py+e.vy <= f.y2)
							{
								f.x -= e.r;
								if(e.px < f.x && e.px+e.vx >= f.x-1)
								{
									//e.px = f.x-Math.abs(e.px+e.vx-f.x);
									e.vx = -Math.abs(e.vx);
									collx = true;
								}
								f.x += 2*e.r;
								if(e.px > f.x && e.px+e.vx <= f.x+1)
								{
									//e.px = f.x + Math.abs(e.px+e.vx-f.x);
									e.vx = Math.abs(e.vx);
									collx = true;
								}
								f.x -= e.r;
							}						
						}
						else if(isHorizontal(f))
						{
							if(e.px+e.vx > f.x && e.px+e.vx <= f.x2)
							{
								f.y -= e.r;
								if(e.py < f.y && e.py+e.vy >= f.y-1)
								{
									//e.px = f.x-Math.abs(e.px+e.vx-f.x);
									e.vy = -Math.abs(e.vy);
									colly = true;
								}
								f.y += 2*e.r;
								if(e.py > f.y && e.py+e.vy <= f.y+1)
								{
									//e.px = f.x + Math.abs(e.px+e.vx-f.x);
									e.vy = Math.abs(e.vy);
									colly = true;
								}
								f.y -= e.r;
							}						
						}
						else
						{
							//throw "as"
						}
						e.vx = e.vx/(elapsed/1000);
						e.vy = e.vy/(elapsed/1000);
					}					
					if(f.type == "flag")
						if(inRange(f.x,f.y,f.r, e.px, e.py, e.r)) 
						{

							if(e.team == f.team && !f.taken)//home
							{								
								e.flags.forEach(function (g)
								{
									//console.log(g.x+" "+g.y);
									e.user.score += 10;
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
								Object.defineProperty(f, "y", { get: function () { return e.py-22.5-12; } });
								e.flags.push(f);
								//f.x = e.px
								//f.y = e.py
								f.taken = true;
							}

						}
					if(f.type == "hole")
						if(inRange(f.x,f.y,f.r, e.px, e.py, e.r)) 
						{
						
							var dx = (f.x-e.px);		
							var dy = (f.y-e.py);
							var dd = Math.sqrt(dx*dx+dy*dy)
							/*					
							e.vy += dx/30;
							e.vx -= dy/30;
							*/
							e.vy += dx/10;
							e.vx -= dy/10;
							/*
							e.vx += dx/18;
							e.vy += dy/18;
							*/
							e.vx += dx/5;
							e.vy += dy/5;
							if(dd > 80)
							{
							    e.vx *= 1.01;
							    e.vy *= 1.01;
    							}
							else
							{
							    e.vx *= 0.98;
							    e.vy *= 0.98;
							}


							e.r = 30*Math.sqrt(dx*dx+dy*dy)/100;
							e.r =  parseInt(e.r < 10? 10:e.r > 30? 30 : e.r);
							
							//e.r = .98;
						}
					if(f.type == "mine")
						if(inRange(f.x,f.y,f.r, e.px, e.py, e.r)) 
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
							}
							init(e);
						}
				});
				players.forEach(function (f)
				{				
					if(inRange(f.px,f.py,f.r, e.px, e.py, e.r) && e.team != f.team) //coll with flag
					{
						var fa = 0;
						var fb = 0;						
						if(e.flags.length > 0)
						{
							
							e.flags.forEach(function (g)
							{
								fa++;
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
								fb++;
								delete g.x;
								delete g.y;
								g.x = g.ox;
								g.y = g.oy;
								g.taken = false;
							});
							f.flags = [];
							init(f);
						}
						
						f.user.score +=(fa-fb) > 0 ? fa-fb : 0;
						e.user.score +=(fb-fa) > 0 ? fb-fa : 0;
						rm.gm.onUserRoster(e.user.gid);
					}
					
					if(f.user.id != e.user.id)
					{
						var dx = e.px-f.px;
						var dy = e.py-f.py;
						if(inRange(f.px,f.py,f.r, e.px, e.py, e.r))
						{		
							if(e.vx*dx+e.vy*dy <= 0)
							{
								var c = custcoll(1,1,1,e,f);	
								e.r-=2;
								if(e.r < 10)
								    init(e)
								f.r-=2;
								if(f.r < 10)
								    init(f)
								coll = c.coll;
								
								e.vx = c.e.vx;
								e.vy = c.e.vy;
								f.vx = c.f.vx;
								f.vy = c.f.vy;								
			
								e.px = c.e.px;
								e.py = c.e.py;
								f.px = c.f.px;
								f.py = c.f.py;					
							}
						}
					}				
				});				
				
				e.vx *= 0.99;
				e.vy *= 0.99;
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
				

				if(collx || colly || coll)
				{
				    e.r -= 2;
				}
				if(e.r<10)
	    			    init(e);

				if(!collx && !coll)
				e.px += e.vx * elapsed/1000;
					if(!colly && !coll)
				e.py += e.vy * elapsed/1000;
				
				data.value = [];
				data.value.push({type:"pos",x:e.px,y:e.py});					
				if(e.keys[4])
					data.value.push({type:"line",x:50,y:50,w:20,h:10,position:"absolute"});
				
				
				//data.value.push({type:"circle",x:0,y:0,r:100,c:"green"});
				players.forEach(function (f)
				{
					data.value.push({type:"circle",x:f.px,y:f.py,r:f.r,c:f.team==0 ? "red" : "blue"});
					data.value.push({type:"text",x:f.px+15,y:f.py-27,text:f.user.name});
				});
				
				objects.forEach(function (f)
				{
					data.value.push(f);
					//data.value.push({type:"text",x:f.px,y:f.py,text:f.user.name});
				});
				var ssum = 0;
				team(0).forEach(function (e){ssum+= e.user.score});
				data.value.push({type:"text",x:900,y:100,text:ssum,position:"absolute",size:100, color:"red", align:"center"});
				ssum = 0;
				team(1).forEach(function (e){ssum+= e.user.score});
				data.value.push({type:"text",x:1100,y:100,text:ssum,position:"absolute",size:100, color:"blue", align:"center"});

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
				data.value += "<br>";				
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
	function isHorizontal(a)
	{
		if(a.y == a.y2)
			return true;
		else
			return false;
	}
	function isVertical(a)
	{
		if(a.x == a.x2)
			return true;
		else
			return false;
	}
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
			e.px = e.ox;
			e.py = e.oy;
			e.vx = e.px/5+(Math.random()*5)-2.5;
			e.vy = e.py/5+(Math.random()*5)-2.5;
			e.r = 30;
		}
	}
	function vwall(x, y1, y2)
	{
			if(y1 > y2)
			{
				y1 ^= y2;
				y2 ^= y1;
				y1 ^= y2;
			}
			objects.push({type:"wall",x:x, y:y1, x2:x, y2:y2});
			objects.push({type:"circle",x:x, y:y1, r:1});
			objects.push({type:"circle",x:x, y:y2, r:1});
			//objects.push({type:"wall",x:0, y:0, x2:0, y2:100});
	}
	function hwall(y, x1, x2)
	{
		if(x1 > x2)
		{
			x1 ^= x2;
			x2 ^= x1;
			x1 ^= x2;
		}
		objects.push({type:"wall",x:x1, y:y, x2:x2, y2:y});
		objects.push({type:"circle",x:x1, y:y, r:1});
		objects.push({type:"circle",x:x2, y:y, r:1});
	}
	//public
	function join(user)
	{			
		players[user.id] = {type:"player",flags:[], user:user, team:-1, score: 0, px:0, py:0, ox:0, oy:0, vx:0, vy:0, r:30, keys:[false, false, false, false,false], out:""};
		players[user.id].team = team(1).length < team(0).length ? 1 : 0;			
		if(players[user.id].team == 0)
		{
			players[user.id].ox = -800;
			players[user.id].oy = 800;
		}
		else if(players[user.id].team == 1)
		{
			players[user.id].ox = 800;
			players[user.id].oy = -800;
		}
		init(players[user.id]);
		
			
		console.log(user.name+"joined the game");		
		if(state == "lobby")
			start();
	}
	function leave (user)
	{		
		players[user.id].user.score = 0;
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
		objects.push({type:"flag",ox:-550, oy:550, r:40,team:0,taken:false});
		objects.push({type:"flag",ox:550, oy:-550, r:40,team:1,taken:false});
//		objects.push({type:"circle",x:0, y:0, r:100});
		//objects.push({type:"hole",x:0, y:0, r:90});
		objects.push({type:"hole",x:500, y:500, r:90});
		objects.push({type:"hole",x:-500, y:-500, r:90});
		
		
		
		hwall(-1000,-1000,1000);
		vwall(-1000,-1000,1000);
		vwall(1000,-1000,1000);
		hwall(1000,-1000,1000);	
		
		hwall(300,-800,-300);
		vwall(-300,800,300);
		hwall(-300,800,300);
		vwall(300,-800,-300);
		
		objects.push({type:"mine",x:-150, y:250, r:20});
		objects.push({type:"mine",x:-250, y:150, r:20});
		objects.push({type:"mine",x:100, y:600, r:20});
		objects.push({type:"mine",x:300, y:500, r:20});
		objects.push({type:"mine",x:500, y:300, r:20});
		objects.push({type:"mine",x:600, y:100, r:20});
		objects.push({type:"mine",x:0, y:900, r:20});

		hwall(400,-100,100);
		vwall(0,300,500);
		
		vwall(-400,-100,100);
		hwall(0,-300,-500);
		//jf
		
		objects.push({type:"mine",x:150, y:-250, r:20});
		objects.push({type:"mine",x:250, y:-150, r:20});
		objects.push({type:"mine",x:-100, y:-600, r:20});
		objects.push({type:"mine",x:-300, y:-500, r:20});
		objects.push({type:"mine",x:-500, y:-300, r:20});
		objects.push({type:"mine",x:-600, y:-100, r:20});
		objects.push({type:"mine",x:0, y:-900, r:20});
		
		hwall(0,300,500);
		vwall(400,-100,100);
		
		hwall(-400,-100,100);
		vwall(0,-300,-500);
		
		
		
		
		
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
