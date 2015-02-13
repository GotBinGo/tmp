module.exports = new manager();
function manager()
{
	var groups = [];
	var group_counter = 0;
	this.createGroup = function(owner, gname, pw)
	{
		new_group = {};
		new_group.owner = owner;
		new_group.id = group_counter;
		group_counter++;
		if(gname == "" || gname === undefined)
			new_group.name = "";
		else
			new_group.name = gname;

		if(pw == "" || pw === undefined)
			new_group.pw = "";
		else
			new_group.pw = pw;	
		new_group.users = [];
		groups[new_group.id] = new_group;
		console.log("group " + new_group.id + " was created");	
	}
	/*
	function loginUser(uid, ws)
	{
	console.log("user added");
	}
	function logoutUser(uid)
	{
	console.log("user removed");
	}
	*/
	this.getGroup = function (gid) //to be avoided
	{
		return groups[gid];
	}
	this.sendGroup = function(user, message)
	{
		//console.log(gid);
		this.getGroup(user.gid).users.forEach(function (e){e.ws.send(message);});
	}
	this.dc = function (user)
	{
		this.leaveGroup(user);
		/*
		var ctx = this;
		user.gids.forEach(function(e){
		ctx.leaveGroup(user,e);
		});
		*/

	}
	this.joinGroup = function(user, gid)
	{		
		if(groups[gid] !== undefined)
		{
			if(user.gid != gid)
			{
				if(user.gid !== undefined) //intial condition
					this.leaveGroup(user);

				user.gid = gid;
				groups[gid].users[user.id] = user;
				this.sendGroup(user, user.name+" joined the room.");
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

	this.leaveGroup = function(user)
	{	
		delete groups[user.gid].users[user.id];	
		this.sendGroup(user, user.name + " left the group.");
		user.gid = 0;
		console.log("user left group");
	}


	console.log("groups constructed");
	this.createGroup({},"default"); //create default group
}
