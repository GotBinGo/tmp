module.exports = new manager();
function manager() 
{	
	//pirvate---------------
	var groups = [];
	var group_counter = 0;
	//public----------------	
	function create(user, name, pw)
	{
		var new_user = {};
		new_user.owner = user;
		new_user.id = group_counter;
		group_counter++;
		if(name == "" || name === undefined)
			new_user.name = "";
		else
			new_user.name = name;
		if(pw == "" || pw === undefined)
			new_user.pw = "";
		else
			new_user.pw = pw;	
		new_user.users = [];
		groups[new_user.id] = new_user;
		console.log("group " + new_user.id + " was created");	
	}	
	function join(user, gid)
	{
		if(groups[gid] !== undefined)
		{
			if(user.gid != gid)
			{
				if(user.gid !== undefined) //intial condition
				{
					leave(user);
					console.log("WHAT");
				}
				user.gid = gid;
				groups[gid].users[user.id] = user;
				send(user.gid, user.name+" joined the room.");
				console.log(user.id + "user joined "+ user.gid)	
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
	function leave(user)
	{
		delete groups[user.gid].users[user.id];	
		send(user.gid, user.name + " left the group.");
		user.gid = 0;
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
	function list()
	{
		var tmp = [];
			groups.forEach(function (e){tmp.push(e.name)});	
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
	Object.defineProperty(this,"list", {writable: false, value: listGroup});
	Object.defineProperty(this,"listGroup", {writable: false, value: listGroup});
	console.log("module loaded");
}
