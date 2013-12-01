var util = require('util');
var sleep = require('sleep');
var fs = require('fs');
var https = require('https');
var CONSTANTS = require('../constants')

console.log(CONSTANTS.ACCESS_TOKEN)

var API_USERS = "https://api.instagram.com/v1/users/";

var friendsList = {}
friendsList.data = []

/*
 * GET home page.
 */

exports.index = function(req, res){
  
  var action = req.query.action
  if(action === "start"){
  	getFollows("5302638", "wenggunner007", 0, undefined, undefined, "http://images.ak.instagram.com/profiles/profile_5302638_75sq_1373385152.jpg")	
  	res.send("")
  }else{
	res.header("Content-Type", "application/json");
	res.send(JSON.stringify(friendsList))
	
  }
};


//
// retrieve all the users that this user is following

function getFollows(id, name, degree, cursor, data, photo){
	
	var responseParts = [];
	https.get(API_USERS + "/"+id+"/follows?access_token=" + CONSTANTS.ACCESS_TOKEN + "&count=500&cursor=" + cursor, function(res) {
	  res.on('data', function (chunk) {
	    responseParts.push(chunk)
	  });

	  res.on('end', function (chunk) {	
	  	sleep.sleep(1)
	  	var remainingAPICall = res.headers['x-ratelimit-remaining'];
	  	
	  	console.log("remainingAPICall::: " + remainingAPICall);

	  	var obj = JSON.parse(responseParts.join(''))
	  	
	  	var follows = obj.data;

	  	if(data && follows){
	  		follows = follows.concat(data)
	  	}

	  	if(obj.pagination){
	  		cursor = obj.pagination.next_cursor	
	  	}else{
	  		cursor = undefined
	  	}
	  	

	  	if(cursor){
	  		getFollows(id, name, degree, cursor, follows)
	  	}else{

	  		if(follows){
	  			console.log(name + " follows "+ follows.length + " users:: degree=" + degree)

		  		friendsList.data.push({
	  				id: id,
	  				name: name,
	  				photo: photo,
	  				follows: follows
	  			})

		  		if(degree < 1){
		  			for(var i=0; i < follows.length; i++){
		  				var person = follows[i]	
		  				getFollows(person.id, person.username, degree + 1, undefined, undefined, person.profile_picture);			
		  			}
		  		}
	  		}
	  	}
	  });  
	}).on('error', function(e) {
	  console.log("Got error: " + e.message);
	});

}

