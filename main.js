var fs = require('fs');
var fse = require('fs-extra');//a module that adds a little more functionality to fs
var request = require('request');
var async = require('async');
var child_process = require('child_process');
var Docker = require('dockerode');

var get_uri;
var post_uri;

if(require.main === module){
    
  //  get_uri = process.argv[2];
  //  post_uri = process.argv[3];
   
    setup (function(error, response){
	console.log(response);
    });
   // main();
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
	    if(folderName.substring(0, 8) === "scripts/"){
		fse.remove(folderName, function(err){
		    if(err) console.log("there was an error deleting the directory");
		});
	    }
	    
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
	console.log(response);
	console.log(body);
	callback(null, body);//console.log(body);
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

function setup(callback){
    child_process.exec('docker create ubuntu:latest', function(error, stdout, stderr){
	if(error || stderr) callback(new Error("Sandbox was not setup correctly"));
	callback(null, stdout);
    }); 
}

function run(callback){

}

function kill(callback){

}

/*
function setup(callback){
    var docker = new Docker();
    docker.createContainer({Image: 'ubuntu', Cmd : ['/bin/bash', 'ls'], name : 'secret'}, callback);
}*/


/*
function setup(callback){
   
    var params = {
	Hostname : "",
	Domainname : "",
	User : "",
	Memory : 0,
	MemorySwap : 0,
	CpuShares : 512,
	Cpuset : "0, 1",
	AttachStdin : false,
	AttachStdout : true,
	AttachStderr : true,
	Tty : false,
	OpenStdin : false,
	StdinOnce : false,
	Env : null,
	Cmd : [ "ls" ],
	Entrypoint : "",
	Image : "ubuntu:latest",
	Volumes : {},
	WorkingDir : "",
	NetworkDisabled : true,
	MacAddress : "",
	ExposedPorts : {},
	SecurityOpts : [""],
	HostConfig : {
	    Binds : null,
	    Links : [""],
	    LxcConf : {},
	    PortBindings : {},
	    PublishAllPorts : false,
	    Privileged : false,
	    ReadonlyRootfs : true,
	    Dns : null,
	    DnsSearch : null,
	    ExtraHosts : null,
	    VolumesFrom : [""],
	    CapAdd : null,
	    CapDrop : null,
	    RestartPolicy : { "Name" : "", "MaximumRetryCount" : 0 },
	    NetworkMode : "host",
	    Devices : []
	}
    }

    var params2 = {
	Image : "ubuntu:latest",
//	Cmd : ["/bin/bash", "ls"]
    }

    console.log(JSON.stringify(params2));

    var queryString = {
	name : "/secret"
    }
    
    request({
	method: 'POST',
	uri: "http://unix:/var/run/docker.sock:/containers/create",
	qs: queryString,
	body: JSON.stringify(params2),// params,
	json: true
    }, function(error, response, body){
	console.log("ALL DONE");
	if(error) {
	    console.log("there was an error");
	    callback(error);
	}
	else{
	    console.log("no error");
	    console.log(response);
	    console.log(body);
	    callback(null, body);
	}
    });
}
*/
