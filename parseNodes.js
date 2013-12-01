var fs = require('fs');
var https = require('https');
var sleep = require('sleep');
var json = require('/Users/i071571/Desktop/nodes.json');
var util = require('util');
var CONSTANTS = require('./constants')
var lineReader = require('line-reader');

var ACCESS_TOKEN = CONSTANTS.ACCESS_TOKEN
var API_USERS = "https://api.instagram.com/v1/users/";
var data = json.data
var count = 0;
var closeFriend = new Array();
var nodes = new Array();
var nodeString = new Array();
var edgeString = new Array();


// filter out all the users that is not following my wife
var item = data[0]
var follows = item.follows
var followCount = follows.length
var totalNodes = 0;

lineReader.eachLine('/Users/i071571/Desktop/closefriends.txt', function(line, last) {
  closeFriend.push(line.trim().toString())

  if(last){
		var s = data.filter(function(item){
			return closeFriend.indexOf(item.name) != -1
		});

		nodeString.push("<node id=\"wenggunner007\">")
	  	nodeString.push("</node>")

	  	for(var i=0; i < s.length; i++){
	  		var user = s[i]
	  		edgeString.push("<edge source=\"wenggunner007\" target=\""+user.name+"\"/>")	

	  	}
		

	  	
		for(var i=0; i < s.length; i++){
			var user = s[i]
			//totalNodes = totalNodes + user.follows.length
			//console.log(user.name + " follows " +user.follows.length)
			nodes.push(user.name)
			nodeString.push("<node id=\""+user.name+"\">")
	  		
	  		if(user.photo){
	  			nodeString.push("<data key=\"photo\">"+user.photo+"</data>")	
	  		}

	  		nodeString.push("</node>")

	  		
	  			for(var j=0; j< user.follows.length;j++){
	  			var follow = user.follows[j]
	  			
	  			if(nodes.indexOf(follow.username) == -1){
	  				nodes.push(follow.username)
	  				nodeString.push("<node id=\""+follow.username+"\">")
	  				if(follow.profile_picture){
	  					nodeString.push("<data key=\"photo\">"+follow.profile_picture+"</data>")	
	  				}

	  				nodeString.push("</node>")
	  			}

	  			edgeString.push("<edge source=\""+user.name+"\" target=\""+follow.username+"\"/>")	
	  			}	
	  		
	  	
		}




	fs.writeFile("/Users/i071571/Desktop/output.graphml", buildXML(), function(err) {
			    if(err) {
			        console.log(err);
			    } else {
			        console.log("The file was saved!");
			    }
			}); 
		
		
  }



});

function buildXML(){
	var xml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?><graphml xmlns=\"http://graphml.graphdrawing.org/xmlns\"  xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xsi:schemaLocation=\"http://graphml.graphdrawing.org/xmlns http://graphml.graphdrawing.org/xmlns/1.0/graphml.xsd\">" 
	xml += "<graph id=\"G\" edgedefault=\"directed\">"

  	xml += (nodeString.join(''))
	xml += (edgeString.join(''))
	xml += ("</graph></graphml>")

	return xml
}

