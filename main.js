var fs = require('fs');
var fse = require('fs-extra');//a module that adds a little more functionality to fs
var request = require('request');
var async = require('async');
var child_process = require('child_process');
//var Docker = require('dockerode');

var get_uri;
var post_uri;

if(require.main === module){



    
  //  get_uri = process.argv[2];
  //  post_uri = process.argv[3];

   getBatchOfSubmissions(function(err, results){
       async.parallel([
	   function(callback){
	       grade(results[0], callback);
	   }
       ], function(err, results){
	   
       });
   });
}

function grade(submission, _callback){
    async.waterfall([
	function(callback){
	    writeToFile(submission, callback);
	},
	function(body, folderName, callback){
	    setup(folderName, function(err){
		callback(err, folderName);
	    });
	}, 
	//can probably delete folder here actually....
	function(folderName, callback){
	    
	    run(folderName.slice(8, folderName.length), function(err, process){
		if(err) callback(err);
		else callback(err, folderName, process);
	    });
	},
	function(folderName, process, callback){
	    
	    process.stdout.on('data', function(data){
		console.log('stdout: ' + data);
	    });
	    
	    process.stderr.on('data', function(data){
		console.log('stderr: ' + data);
	    });

	    process.on('close', function(code){
		console.log('process closed! with error code: ' + code);
		callback(null);
	    });
	}
    ], function(err){
	
    });
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
	   var options = {
	       cwd : folderName
	   }

	    
	    child_process.exec('node ' + 'run.js', options, function(error, stdout, stderr){
		var result;
		if(error) result = error;
		else if (stderr) result = stderr;
		else result = stdout;

		callback(null, body, result, folderName);
	    });
	},
	//delete the temp directory
	function(body, stdout, folderName, callback){
	    console.log(folderName);
		/*
		  //lets stop this for the moment.
	    if(folderName.substring(0, 8) === "scripts/"){
		fse.remove(folderName, function(err){
		    if(err) console.log("there was an error deleting the directory");
		});
	    }
		*/
	    
	    callback(null, body, stdout);
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
  Queries the server for three submissions and returns them in the callback.
*/
function getBatchOfSubmissions(callback){
    async.series([
	function(callback){
	    get(callback);
	},
	function(callback){
	    get(callback);
	},
	function(callback){
	    get(callback);
	}
    ], function(err, results){
	if(err) callback(err);
	else callback(null, results);
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
   
    fs.mkdir(folderName, function(){
	    
	var codeExtension = getProgrammingLanguageExtension(obj.language);
	
	var submissionFileName = folderName + "/submission" +  codeExtension;
	var testCodeFileName = folderName + "/test" + codeExtension;
	var inputFileName = folderName + "/input.txt";
	var outputFileName = folderName + "/output.txt";
	var runnerFileName = folderName + '/run.js';
	var dockerFileName = folderName + "/Dockerfile";
	//I have to pass a fake callback otherwise async won't call 
	//the last callback
	async.parallel([
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
		fse.copy('lib/run.js', runnerFileName, function(err){
		    if(err) cb(err);
		    else cb(null);
		});
		
	    }, function(cb){
		fse.copy('lib/Dockerfile', dockerFileName, function(err){
		    if(err) cb(err);
		    else cb(null); 
		});
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
//	console.log(response);
//	console.log(body);
	callback(null, body);//console.log(body);
    });
}

/*
  Post a result back to server.
*/
function post(submission_id, message, callback){
    request({
	method: 'POST',
	uri: 'http://localhost:3000/submission/update/' + submission_id,
	json: true,
	body: {"result" : message}
    }, function(error, response, body){
//	if(error) console.log(error);
//	else console.log(body);
	callback(null);
    });
}

/*
  Returns a random string without hyphens.
*/
function getRandomString(){
    //the regex bit gets rid of the dashes in the string
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

function setup(folderName, callback){
    var path = {cwd : folderName};
    child_process.exec('docker build --force-rm=true --pull=false --rm=true -q -t caseymcguire/tester:' + folderName.slice(8, folderName.length) + ' .', path, function(error, stdout, stderr){
	if(error) callback(error);
	else if(stderr) callback(new Error(stderr));
	else callback(null);
    });
}

function run(name, callback){
    var command = [
	'docker', 'run', '--rm=true', 'caseymcguire/tester:' + name, 'nodejs', '/code/run.js'
    ];
    callback(null, child_process.spawn(command[0], command.splice(1, command.length - 1)));
}

function kill(callback){

}

