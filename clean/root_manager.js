module.exports = new rm();
function rm() 
{	
	var group_man = require('./group_manager.js');
	Object.defineProperty(this,"gm", {writable: false, value: group_man});
	var command_ip = require('./command_ip.js')(this);
	Object.defineProperty(this,"cip", {writable: false, value: command_ip});
	var connection = require('./connection.js')(80,this);	
	
	console.log("rm loaded");
}
