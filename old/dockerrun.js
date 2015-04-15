var request = require('request');
var async = require('async');


request({
    method: 'GET',
    uri: "http://unix:/var/run/docker.sock:/info",
    json: true,
}, function(error, response, body){
    if(error) {
	console.log("there was an error");
	console.log(error);
    }
    else{
	console.log(response);
	console.log(body);
    }
});

