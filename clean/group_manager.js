module.exports = new manager();
function manager() 
{	
	//pirvate---------------
	var groups = [];
	var group_counter = 0;
	function onUserRoster(gid)
	{
		send(gid, "/ourc")
	}
	function onGroupRoster()
	{
		send(gid, "/ogrc")
	}
	//public----------------	
	function create(user, name, pw)
	{
		var new_group = {};
		new_group.owner = user;
		new_group.id = group_counter;
		group_counter++;
		if(name == "" || name === undefined)
			new_group.name = "";
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
		join(user, new_group.id);
	}
	function remove(user, gid)
	{
		onGroupRoster();
	}
	function join(user, gid)
	{
		if(groups[gid] !== undefined)
		{
			if(user.gid != gid)
			{
				if(user.gid !== undefined) //intial condition
				{
					delete groups[user.gid].users[user.id];	
					if(groups[user.gid].users.filter(function(value) { return value !== undefined }).length) == 0)
						remove();
					send(user.gid, user.name + " left the group.");
					onUserRoster(user.gid);
				}
				user.gid = gid;
				groups[gid].users[user.id] = user;
				send(user.gid, user.name+" joined the room.");
				console.log(user.id + "user joined "+ user.gid)	
				onUserRoster(gid);
			}
			else
			{
				user.send("already in that group" + user.gid + " " + gid);
			}
		}
		else
		{
			user.send("group does not exist" + gid);
		}
	}
	function leave(user) //intentionally not put in any new group
	{
		delete groups[user.gid].users[user.id];	
		send(user.gid, user.name + " left the group.");
		onUserRoster(gid);		
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
			groups.forEach(function (e){tmp.push(e.id)});	
		return tmp;
	}
	function listGroup(gid)
	{
		var tmp = [];
	  	if(groups[gid] !== undefined)
		{
			groups[gid].users.forEach(function (e){tmp.push(e.name)});
		}		
		return tmp;
	}
	create({},"");
	Object.defineProperty(this,"create", {writable: false, value: create});
	Object.defineProperty(this,"join", {writable: false, value: join});
	Object.defineProperty(this,"leave", {writable: false, value: leave});
	Object.defineProperty(this,"send", {writable: false, value: send});
	Object.defineProperty(this,"sendUser", {writable: false, value: sendUser});
	Object.defineProperty(this,"sendAll", {writable: false, value: sendAll});
	Object.defineProperty(this,"list", {writable: false, value: list});
	Object.defineProperty(this,"listGroup", {writable: false, value: listGroup});
	console.log("module loaded");
}
