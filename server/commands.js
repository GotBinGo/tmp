//commands to be evaluated right, without typing full command
//probably unnecessary since noone will type commands
//in early stage!
function commands()
{
this.run = function()
{

}
this.children = function()
{

}

}
function command(name,parent,arguments)
{
	this.name = name;
	this.parent = parent;	
	this.arguments = arguments;
	this.childern = [];
}
function load()
{

	return new commands();
}
module.exports = load;
