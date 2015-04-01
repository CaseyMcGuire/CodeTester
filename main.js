if(require.main === module){
    //TODO: mke sure pass GET and POST uri
    main();
}

function main(){
    var request = require('request');
    var async = require('async');
    var util = require('./lib/util');	

    async.waterfall([
	function(callback){
	    getUngradedSubmission(callback);
	},
	function(body, callback){
	    util.writeCodeToFile(body, callback);
	},
	function(body, folderName, callback){
	   
	    require('child_process').exec('node ' + folderName + '/run.js ' + folderName, function(error, stdout, stderr){
		if(error) console.log(error);
		else {
		    console.log('we are in the callback');
		    console.log(stdout);

		}
		callback(null, body);
	    });
	   	   
	},
	function(body, callback){
	    
	    postResult(body.submission_id, callback);
	}
    ], function(err){
	console.log("all done");
    });
}

/*
  
 */
function getUngradedSubmission(callback){
    require('request')({
	uri: 'http://localhost:3000/submission/get_ungraded',
	json: true
    }, function(error, response, body){
	if(error) callback(error);
	else callback(null, body);//console.log(body);
    });
}

function postResult(submission_id, callback){
    require('request')({
	method: 'POST',
	uri: 'http://localhost:3000/submission/update/' + submission_id,
	json: true,
	body: {"result" : "fail"}
    }, function(error, response, body){
	if(error) console.log(error);
	else console.log(body);
    });
}
