var fs = require('fs');
var fse = require('fs-extra');//a module that adds a little more functionality to fs
var request = require('request');
var async = require('async');
var child_process = require('child_process');

var get_uri;
var post_uri;

var PASS = 0, FAIL = 1, TIMEOUT = 2;


if(require.main === module){
    start();
}

function start(){

    var submission_id;//a dirty solution but okay for now

    async.waterfall([
	function(callback){
	    get(function(err, body){
		if(err) callback(err);
		else if(Object.keys(body).length === 0) callback(new Error('no submissions'));
		else callback(null, body);
	    });
	},
	//setup
	function(body, callback){
	    submission_id = body.submission_id;
	    console.log('were setting up!');
	    console.log(body);
	    setup(body, callback);
	},
	function(id, callback){
	    run(id, function(err, process){
		//always passes back null as err so no need to check
	    var stdout = '';
	    var stderr;

	    //Need to timeout the docker container here as well...
	    process.stdout.on('data', function(data){
		stdout += data;
	    });
	    
	    process.stderr.on('data', function(data){
		if(stderr === undefined) stderr = '';
		stderr += data;
	    });

	    process.on('close', function(code){
		console.log('process closed! with error code: ' + code);

		//I should probably use some sort of coding system instead of string literals
		console.log("===============");
		console.log(stdout);
		console.log("===============");
		stdout = stdout.slice(0, 4);
		
		console.log(stderr);
		console.log(stdout === 'PASS');
		console.log(stdout);
		
		if(stderr || stdout !== 'PASS') callback(null, id, FAIL);
		else callback(null, id, PASS);
	    });
		

	    });
	},
	function(id, result, callback){
	    post(submission_id, result, function(err){
		callback(null, id);
	    });
	}
    ],function(err, id){

	teardown(id, function(){
	    console.log('all done!');
	});
	
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
function writeToFile(obj, id, callback){
  //  var fs = require('fs');
    var folderName = "scripts/" + id;
   
    fs.mkdir(folderName, function(){
	    
	var codeExtension = getProgrammingLanguageExtension(obj.language);
	
	var submissionFileName = folderName + "/submission" +  codeExtension;
	var testCodeFileName = folderName + "/test" + codeExtension;
	var inputFileName = folderName + "/input.txt";
	var outputFileName = folderName + "/output.txt";
	var runnerFileName = folderName + '/run.js';
	var dockerFileName = folderName + "/Dockerfile";

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
	    else callback(null);
	});
    });
}

/*
  Get a submission from the server
 */
function get(callback){
    request({
	uri: 'http://localhost:3000/submissions/get_ungraded',
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
	uri: 'http://localhost:3000/submissions/update/' + submission_id,
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
    else if(languageName === "java") return ".java";
    else throw Error("invalid language name");
}

function setup(obj, _callback){

    var id = getRandomString();

    var path = {cwd : 'scripts/' +  id};

    async.series([
	function(callback){
	    writeToFile(obj, id, callback);
	},
	function(callback){
	    child_process.exec('docker build --force-rm=true --pull=false --rm=true -q -t caseymcguire/sandbox:' + id  + ' .', path, function(error, stdout, stderr){
		if(error) callback(error);
		else if(stderr) callback(new Error(stderr));
		else callback(null);
	    });
	}
    ], function(err, results){
	if(err) _callback(err);
	else _callback(null, id);
    });
}

function run(id, callback){
    var command = [
	'docker', 'run', '--rm=true', 'caseymcguire/sandbox:' + id, 'nodejs', '/code/run.js'
    ];
    callback(null, child_process.spawn(command[0], command.splice(1, command.length - 1)));
}

function teardown(id, callback){
    child_process.exec('docker rmi caseymcguire/sandbox:' + id, function(error, stdout, stderr){
	console.log(stdout);
	console.log(error);
	console.log(stderr);
	callback(null);
    });
}

function kill(callback){

}

