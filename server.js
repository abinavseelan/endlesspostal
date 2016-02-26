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
	

	client.on('connection', function(socket){
		console.log("Someone has connected");

		var collection = db.collection('messages');


		var sendStatus = function(status){
			socket.emit('status',status);
		}


		collection.find().limit(20).sort({_id: 1}).toArray(function(error,result){
			if(error){
				throw error;
			}
			//console.log(result);
			socket.emit('output', result);
		})

		socket.on('input', function(data){
			var name = data.name;
			var message = data.message;
			var whiteSpacePattern = /^\s*$/;

			if(whiteSpacePattern.test(name) || whiteSpacePattern.test(message)){
				sendStatus("Incorrect Input. Name and Message is required!");
				console.log("Incorrect Input");

			}
			else{
				var result = {
					"clear" : true,
					"message": "Message Sent"
				};
				sendStatus(result);
				//Broadcast on all sockets
				client.emit('output',[data]);
				collection.insert({name: name, message: message}, function(){
					console.log("Inserted");
				});

			}

			
		});

	});
});



