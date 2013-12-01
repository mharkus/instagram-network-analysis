var fs = require('fs');
var https = require('https');
var sleep = require('sleep');
var json = require('/Users/i071571/Desktop/nodes.json');
var util = require('util');
var CONSTANTS = require('./constants')
var lineReader = require('line-reader');

var ACCESS_TOKEN = CONSTANTS.ACCESS_TOKEN;
var API_USERS = "https://api.instagram.com/v1/users/";
var data = json.data
var closeFriend = new Array();

// filter our all the users that is not following my wife
var item = data[0]
var follows = item.follows
var followCount = follows.length
var totalNodes = 0;

for(var j=0; j < followCount; j++){
	var follow = follows[j]
	setTimeout(checkRel(j, follow, follows), 1500 + j * 1000)
}


function checkRel(index, item){
	var responseParts = [];
	https.get(API_USERS + "/"+item.id+"/relationship?access_token=" + ACCESS_TOKEN, function(res) {
	  res.on('data', function (chunk) {
	    responseParts.push(chunk)
	  });

	  res.on('end', function (chunk) {	
	  	var remainingAPICall = res.headers['x-ratelimit-remaining'];
	  	
	  	console.log("remainingAPICall::: " + remainingAPICall);


	  	var obj = JSON.parse(responseParts.join(''))
	  	var status = obj.data;
	  	if(status.outgoing_status === "follows" && status.incoming_status === "followed_by"){
	  		console.log("weng and " + item.username + " follows each other");
	  		closeFriend.push(item.username)
	  	}

	  	// if this is the last item, retrieve close friend's follows
	  	if(index == followCount - 1){
	  		// save to file for later use
	  		fs.writeFile("/Users/i071571/Desktop/closefriends.txt", closeFriend.join('\n\r'), function(err) {
			    if(err) {
			        console.log(err);
			    } else {
			        console.log("The file was saved!");
			    }
			}); 
	  	}

	  });
	}).on('error', function(e) {
	  console.log("Got error: " + e.message);
	});
}

