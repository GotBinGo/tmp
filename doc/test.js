var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({ port: 80 });

wss.on('connection', function connection(ws) 
{
    ws.on('message', function (msg) 
    {
        console.log(msg);
        ws.send(msg. toUpperCase());
    });
});
