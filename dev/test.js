"use strict";
var util = require('util');
var gm = require('./group_manager2.js');

console.log(util.inspect(gm, true, 0));

var readline = require('readline');
var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
rl.on('line', function (cmd) {
	process.exit()
});