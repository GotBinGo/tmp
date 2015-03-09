/*var group_man = require('./group_manager.js');
group_man.a = "tomi";
var command_ip = require('./command_ip.js')(group_man);
//command_ip.run('hey');
var connection = require('./connection.js')(80,command_ip);
console.log("done with start");
*/
require('./root_manager.js');
var readline = require('readline');
var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
rl.on('line', function (cmd) {
	process.exit();
});