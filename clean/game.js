module.exports = game;
function game(rm)
{
	var players = [];
	this.state = "lobby";
	this.join_running = true;
	var timer;
	this.join = function(user)
	{
		players[user.id] = {name:user.name, team:-1, score: 0};
		console.log(user.name+"joined the game");
		if(this.state == "lobby")
			this.start();
	}
	this.leave = function(user)
	{		
		delete players[user.id];
		if(players.filter(function(value) { return value !== undefined }).length == 0)
			this.close();
	}
	this.start = function()
	{
		this.state = "running";
		timer = setInterval(function(){ console.log("game running" + players.length) }, 1000);
	}
	this.close = function()
	{
		clearInterval(timer);
	}
	
}
