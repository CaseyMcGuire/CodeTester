var fs = require('fs');
var fse = require('fs-extra');//a module that adds a little more functionality to fs
var request = require('request');
var async = require('async');
var child_process = require('child_process');

if(require.main === module){
    main();
}

function main(){
    async.waterfall([
	//get an ungraded submission
	function(callback){
	    get(callback);
	},
	//write it to a file
	function(body, callback){
	    writeToFile(body, callback);
	},
	//execute it.
	function(body, folderName, callback){
	   
	    child_process.exec('node ' + folderName + '/run.js ' + folderName, function(error, stdout, stderr){
		if(error) console.log(error);
		else {
		    console.log(stdout);    
		}
		callback(null, body, stdout);
	    });
	   	   
	},
	//post the result back to server
	function(body, stdout, callback){
	    post(body.submission_id, stdout, callback);
	}
    ], function(err){
	console.log("all done");
    });
}



/*
  Creates a folder with a random name in the scripts directory and writes the
  user's code into it. The callback is passed the obj passed into the function
  and the folder name where the code was written to.
  
  @param {Object} An object that has a code attribute to be written and a
  language attribute.
  @param {Function} callback The callback
*/
function writeToFile(obj, callback){
  //  var fs = require('fs');
    var folderName = "scripts/" + getRandomString();
   // var util = this;
    fs.mkdir(folderName, function(){
	    
	var codeExtension = getProgrammingLanguageExtension(obj.language);
	
	var submissionFileName = folderName + "/submission" +  codeExtension;
	var testCodeFileName = folderName + "/test" + codeExtension;
	var inputFileName = folderName + "/input.txt";
	var outputFileName = folderName + "/output.txt";
	var runnerFileName = folderName + '/run.js';
	//I have to pass a fake callback otherwise async won't call 
	    //the last callback
	require('async').parallel([
	    function(cb){
		fs.writeFile(submissionFileName, obj.code);
		cb(null);
		},
	    function(cb){
		fs.writeFile(testCodeFileName, obj.test_code);
		cb(null);
	    },
	    function(cb){
		fs.writeFile(inputFileName, obj.input);
		cb(null);
		},
	    function(cb){
		fs.writeFile(outputFileName, obj.output);
		cb(null);
	    },function(cb){
		require('fs-extra').copy('lib/run.js', runnerFileName, function(err){
		    if(err) console.log(err);
		    else console.log('no problem');
		});
		cb(null);
		}
	],function(err, results){
	    //	console.log("here we are");
	    if(err) callback(err);
	    callback(null, obj, folderName);
	});
    });
}

/*
  Get a submission from the server
 */
function get(callback){
    request({
	uri: 'http://localhost:3000/submission/get_ungraded',
	json: true
    }, function(error, response, body){
	if(error) callback(error);
	else callback(null, body);//console.log(body);
    });
}

/*
  Post a result back to server.
*/
function post(submission_id, message, callback){
    console.log('submission_id');
    console.log(submission_id);
    console.log('message');
    console.log(message);
    request({
	method: 'POST',
	uri: 'http://localhost:3000/submission/update/' + submission_id,
	json: true,
	body: {"result" : message}
    }, function(error, response, body){
	if(error) console.log(error);
	else console.log(body);
    });
}

/*
  Returns a random string without hyphens.
*/
function getRandomString(){
    return require('node-uuid').v4().toString().replace(/-/g, '').toLowerCase();
}
    
/*
  Returns the file extension for a given programming language name.
  
  @param {String} languageName The name of the programming language
*/
function getProgrammingLanguageExtension(languageName){
    languageName = languageName.toLowerCase();
    if(languageName === "ruby") return ".rb";
    else if(languageName === "python") return ".py";
    else throw Error("invalid language name");
}
