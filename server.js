var express = require('express');
var mongo = require('mongodb');
var client  = require('socket.io').listen(8080).sockets;
var cors = require('cors');

var app = express();
app.use(cors());

console.log("Server Running on Port 3000");
app.listen(3000);
app.use('/', express.static(__dirname + '/public'));


mongo.connect('mongodb://admin:admin@ds017688.mlab.com:17688/simple-chat-app', function(error, db){
	if(error){
		console.log("Cannot Connect To DB");
		throw error;
	}
	else{
		console.log("Connection To Server Established");
	}

	var collection = db.collection('messages');


	client.on('connection', function(socket){
		console.log("Someone has connected");

		socket.on('input', function(data){
			var name = data.name;
			var message = data.message;
			var whiteSpacePattern = /^\s*$/;

			if(whiteSpacePattern.test(name) || whiteSpacePattern.test(message)){

				console.log("Incorrect Input");
				
			}
			else{

				collection.insert({name: name, message: message}, function(){
					console.log("Inserted");
				});

			}

			
		});

	});
});



