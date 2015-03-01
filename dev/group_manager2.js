module.exports = new manager();
function manager() 
{	
	//pirvate---------------
	var groups = [];
	var group_counter = 0;
	//public----------------	
	function create(user, name, pw)
	{
		tmp = {};
		tmp.owner = user;
		tmp.id = group_counter;
		tmp++;
		if(name == "" || name === undefined)
			tmp.name = "";
		else
			tmp.name = name;
		if(pw == "" || pw === undefined)
			tmp.pw = "";
		else
			tmp.pw = pw;	
		tmp.users = [];
		groups[tmp.id] = tmp;
		console.log("group " + tmp.id + " was created");	
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
			user.send("group does not exist");
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
		groups[gid].users.forEach(function (e){e.ws.send(message);});
	}
	function sendUser(user, msg)
	{
		groups[gid].users.forEach(function (e){e.ws.send(user.name+": "+message);});
	}
	function listGroup()
	{
		var tmp = [];
	  	if(groups[gid] !== undefined)
		{
			groups[gid].users.forEach(function (e){tmp.push(e.name)});
		}		
		return tmp;
	}
	Object.defineProperty(this,"create", {writable: false, value: create});
	Object.defineProperty(this,"join", {writable: false, value: join});
	Object.defineProperty(this,"leave", {writable: false, value: leave});
	Object.defineProperty(this,"send", {writable: false, value: send});
	Object.defineProperty(this,"sendUser", {writable: false, value: sendUser});
	Object.defineProperty(this,"listGroup", {writable: false, value: listGroup});
	console.log("module loaded");
}
