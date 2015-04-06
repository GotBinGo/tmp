module.exports = new rm();
function rm() 
{	
	var game = require('./game.js');
	game.rm = this;
	Object.defineProperty(this,"g", {writable: false, value: game});	
	var group_man = require('./group_manager.js')(this);
	Object.defineProperty(this,"gm", {writable: false, value: group_man});
	var command_ip = require('./command_ip.js')(this);
	Object.defineProperty(this,"cip", {writable: false, value: command_ip});
	var connection = require('./connection.js')(8080,this);
	
	console.log("rm loaded");
}
