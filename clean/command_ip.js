module.exports = load;
function load(rm)
{
	return new commandInterpreter(rm);
}
function commandInterpreter(rm)
{
	gm = rm.gm
	this.run = function(user, msg)
	{
		console.log(user.name + " sent " + msg);		
		if(msg[0] == "/")
		{
			console.log("command");			
			cmd = [msg.substring(0,msg.indexOf(" "))].concat(msg.substring(msg.indexOf(" ")+1,msg.length).split(" "));
			if(cmd[0] == "/group" || cmd[0] == "/g")
			{	
				console.log("\tgroup");							
				if(cmd[1] == "j" || cmd[1] == "join")
				{
					console.log("\t\tjoin");
					console.log("user wants to join " + cmd[2]);
					gm.join(user, cmd[2]);
				}
				else if(cmd[1] == "c" || cmd[1] == "create")
				{
					console.log("\t\tcreate");
					console.log("user wants to create " + cmd[1]);
					gm.create(user, cmd[2]);
				}
				else if(cmd[1] == "l" || cmd[1] == "leave") //useless
				{
					gm.join(user, 0);
				}
				else if(cmd[1] == "li" || cmd[1] == "list")
				{
					user.send(gm.listGroup(user.gid))
				}
				else if(cmd[1] == "gl" || cmd[1] == "grouplist")
				{
					user.send(gm.list(user.gid))
				}
				else
					user.send("unknown command");
			}
			else if(cmd[0] == "/sa")
				gm.sendAll(cmd[1]);
			else
				user.send("unknown command");
		}
		else
			gm.sendUser(user, msg);
	}
}
