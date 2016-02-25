var express = require('express');

var app = express();

var server = require('http').createServer(app);

io = require('socket.io').listen(server);

var nicknames = [];

console.log("Server Running on Port 3000");
server.listen(3000);


app.get('/', function(request,response){

	response.sendFile(__dirname + "/index.html");

}); 

io.sockets.on('connection', function(socket){
	socket.on('send message', function(data){
		io.sockets.emit('new message', data);
	});

	socket.on('new user', function(data,callback){
		if(nicknames.indexOf(data) != -1){
			console.log("false");
			callback(false);
		}
		else{
			console.log("true");
			callback(true);
			socket.nickname = data;
			nicknames.push(socket.nickname);
			socket.emit('usernames',nicknames);
		}
	});
})