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

var http = require('http');

var finalhandler = require('finalhandler');
var serveStatic = require('serve-static');
var path = require('fs'); 
var serve = serveStatic("../client");
var ip = "";
require('dns').lookup(require('os').hostname(), function (err, add, fam) 
{
	ip = add;
	console.log('address: '+add);
})
var server = http.createServer(function(req, res)
{
	//console.log(req.url)
	if(req.url == "/conn.html" && !path.existsSync('../client/conn.html') )
	{
		res.writeHead(200, {'Content-Type': 'text/plain'});
		res.end(ip);
	}		
	else
	{
		var done = finalhandler(req, res)
		serve(req, res, done)
	}
});
server.listen(80);
//finalhandler serve-static
//connect

rl.on('line', function (cmd) {
	process.exit();
});