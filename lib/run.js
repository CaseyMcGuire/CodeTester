var exec = require('child_process').exec;
var spawn = require('child_process').spawn;
var async = require('async');
var fs = require('fs');

var DEBUG = false;

if(require.main === module){
    
    var runCommand;
    var isCompiled = false;
    var compileCommand;

    var SERVER_ERROR = -1;
    var PASS = 0;
    var FAIL = 1;
    var TIMEOUT = 2;
    var RUNTIME_ERROR = 3;
    var COMPILE_ERROR = 4;

 

    if(fs.existsSync('code/submission.py')){
	runCommand = "python test.py";
    }
    else if(fs.existsSync('code/submission.rb')){
	runCommand = "ruby test.rb";
    }
    else if(fs.existsSync('code/submission.java')){
	isCompiled = true;
	runCommand = "java Test";
	compileCommand = "javac submission.java && javac test.java";
    }
    else if(fs.existsSync('code/submission.c')){
	isCompiled = true;
	runCommand = "./submission";
	//compileCommand = "gcc -o test test.c submission.c";
	compileCommand = "gcc -o submission submission.c"
    }
    else if(fs.existsSync('code/submission.hs')){
	isCompiled = true;
	runCommand = "./test";
	compileCommand = "ghc --make submission.hs && ghc --make test.hs";
    }
    else {
	throw new Error("Unsupported language");
    }

    var options = {
	cwd : "/code",
	timeout : '10000'//TODO: make this configurable 
    }

    if(DEBUG){
	console.log(JSON.stringify(options));
    }

    async.waterfall([

	function(callback){
	    if(isCompiled){
		exec(compileCommand, options, function(error, stdout, stderr){
		    if(DEBUG){
			console.log(error);
			console.log(stdout);
			console.log(stderr);
		    }
		    if(error || stderr) callback(COMPILE_ERROR);
		    else callback(null);
		});
	    }else{
		callback(null);
	    }
	},
	function(callback){
	    fs.readFile('code/output.txt', 'utf-8', function(err, data){
		if(err) callback(SERVER_ERROR);
		else callback(null, data);
	    });
	},
	function(data, callback){
	    if(DEBUG) console.log("about to run");
	    exec(runCommand, options, function(error, stdout, stderr){
		if(DEBUG){
		    console.log(error);
		    console.log(stdout);
		    console.log(stderr);
		}
		if(error) callback(SERVER_ERROR);
		else if(stderr) callback(RUNTIME_ERROR);
		else callback(null, data);
	    });
	  
	},//stdout should be removed at some point but its okay for now
	function(data, callback){
	    fs.readFile('code/user_output.txt', 'utf-8', function(err, outputData){
		if(err) callback(SERVER_ERROR);
		else {
		    var expectedOutput = data.split('\r\n');
		    var userOutput = outputData.split('\n');
		    
		    userOutput.pop();//get rid of trailing white space

		    if(DEBUG){
			console.log(expectedOutput);
			console.log(userOutput);
		    }
		    if(expectedOutput.length !== userOutput.length){
			callback(null, FAIL);
		    }
		    else{
			for(var i = 0; i < expectedOutput.length; i++){
			    if(expectedOutput[i] !== userOutput[i]){
				callback(null, FAIL);
			    }
			}
			callback(null, PASS);
		    }
		}
	    });
	}
    ],function(err, results){

	if(err) console.log(JSON.stringify({result : err}));
	else{
	    console.log(JSON.stringify({result : results}));
	}
    });

}





    


