function commandInterpreter(group_man)
{
	this.run = function(user, msg)
	{
		console.log(user.name + " sent " + msg);		
		if(msg[0] == "/")
		{
			console.log("command");
			var cmd = [msg.substring(0,msg.indexOf(" ")),msg.substring(msg.indexOf(" ")+1,msg.length)];				
			if(cmd[0] == "/group" || cmd[0] == "/g")
			{	
				console.log("\tgroup");
				var args = cmd[1].split(" ");				
				if(args[0] == "j" || args[0] == "join")
				{
					console.log("\t\tjoin");
					console.log("user wants to join " + args[1]);
					//group_man.leaveGroup(user);
					group_man.joinGroup(user, args[1]);
				}
				else if(args[0] == "c" || args[0] == "create")
				{
					console.log("\t\tcreate");
					console.log("user wants to create " + args[1]);
					group_man.createGroup(user, args[1]);
				}
				else if(args[0] == "l" || args[0] == "leave")
				{
					//leave
				}
				else if(args[0] == "li" || args[0] == "list")
				{
					user.send(group_man.listGroup(user.gid).join())
				}
				else
					user.send("unknown command");
			}
			else
				user.send("unknown command");
		}
		else
			group_man.sendGroup(user, msg);
	}
	this.ddc = function(user)
	{
		console.log("ci, dc with " + user.id);
		group_man.dc(user);	
	}
	this.joinGroup = function(user, gid)
	{
		group_man.joinGroup(user, gid);
	}
	this.send_group = function (user, message)
	{
		group_man.sendGroup(user.gid, message);
		//	group_man.getGroup(0).users.forEach(function (e){e.ws.send(message);});
	}
}
function load(group_man)
{

	return new commandInterpreter(group_man);
}
module.exports = load;
