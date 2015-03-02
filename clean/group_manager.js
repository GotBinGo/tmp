module.exports = load;
function load(rm)
{
	return new manager(rm);
}
function manager(rm) 
{	
	//pirvate---------------
	var groups = [];
	var group_counter = 0;
	function onUserRoster(gid)
	{		
		send(gid, "/ourc "+listGroup(gid))
	}
	function onGroupRoster()
	{
		send(0,"/ogrc " + list())
	}
	//public----------------	
	function create(user, name, pw)
	{
		var new_group = {};
		new_group.owner = user;
		new_group.id = group_counter;		
		group_counter++;
		if(name == "" || name === undefined)
			new_group.name = user.name +"'s game";
		else
			new_group.name = name;
		if(pw == "" || pw === undefined)
			new_group.pw = "";
		else
			new_group.pw = pw;	
		new_group.users = [];		
		groups[new_group.id] = new_group;
		onGroupRoster();
		console.log("group " + new_group.id + " was created");	
		if(new_group.id != 0)
		{
			new_group.game = new rm.g(new_group.id);
			join(user, new_group.id);
		}
	}
	function remove(user)
	{
		console.log("rem");
		if( user.gid != 0)	
		{
			delete groups[user.gid];	
			onGroupRoster();		
		}
	}
	function join(user, gid)
	{
		if(groups[gid] !== undefined)
		{
			if(user.gid != gid)
			{
				if(user.gid !== undefined) //intial condition
				{
					if(user.gid != 0)
						groups[user.gid].game.leave(user);
					delete groups[user.gid].users[user.id];	
					if(groups[user.gid].users.filter(function(value) { return value !== undefined }).length == 0)
						remove(user);
					else
					{
						send(user.gid, user.name + " left the group.");						
						onUserRoster(user.gid);
					}
				}
				user.gid = gid;
				groups[gid].users[user.id] = user;
				send(user.gid, user.name+" joined "+ groups[gid].name+".");
				console.log(user.id + " user joined "+ user.gid)	
				if(gid != 0)
					groups[gid].game.join(user);
				onUserRoster(gid);
				onGroupRoster();
			}
			else
			{
				user.send("already in that group");
			}
		}
		else
		{
			user.send("group does not exist" + gid);
		}
	}
	function leave(user)
	{
		if(user.gid != 0)
		groups[user.gid].game.leave(user);
		delete groups[user.gid].users[user.id];	
		if(groups[user.gid].users.filter(function(value) { return value !== undefined }).length == 0)
			remove(user);
		else		
		{
			send(user.gid, user.name + " left the group.");
			onUserRoster(user.gid);		
		}
		user.ws.close();		
		console.log("user left group");
	}	
	function send(gid, msg)
	{
		groups[gid].users.forEach(function (e){e.ws.send(msg);});
	}
	function sendUser(user, msg)
	{
		groups[user.gid].users.forEach(function (e){e.ws.send(user.name+": " + msg);});
	}
	function sendAll(msg)
	{
		groups.forEach(function (g){
			g.users.forEach(function (e){e.ws.send(msg);});
		});
	}
	function list()
	{
		var tmp = [];
			groups.forEach(function (e){if(e.id != 0)tmp.push({name:e.name,id:e.id})});	
		return JSON.stringify(tmp);
	}
	function listGroup(gid)
	{
		var tmp = [];
	  	if(groups[gid] !== undefined)
		{
			groups[gid].users.forEach(function (e){tmp.push({name:e.name,id:e.id})});
		}		
		return JSON.stringify(tmp);
	}
	function gameMessage(user, msg)
	{
		if(groups[user.gid].game !== undefined)
			groups[user.gid].game.message(user, msg);
	}
	create({},"root");
	Object.defineProperty(this,"create", {writable: false, value: create});
	Object.defineProperty(this,"join", {writable: false, value: join});
	Object.defineProperty(this,"leave", {writable: false, value: leave});
	Object.defineProperty(this,"send", {writable: false, value: send});
	Object.defineProperty(this,"sendUser", {writable: false, value: sendUser});
	Object.defineProperty(this,"sendAll", {writable: false, value: sendAll});
	Object.defineProperty(this,"list", {writable: false, value: list});
	Object.defineProperty(this,"listGroup", {writable: false, value: listGroup});
	Object.defineProperty(this,"gameMessage", {writable: false, value: gameMessage});
	console.log("gm loaded");
}
