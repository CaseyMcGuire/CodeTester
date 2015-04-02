var exec = require('child_process').exec;
var async = require('async');

if(require.main === module){

    
    
    var runCommand;
    var fileExtension;


    var fs = require('fs');
    exec('echo $PATH', function(error, stdout, stderr){
//	if(error) console.log("error when echoing path");
//	console.log(stdout);
//	console.log("here we are");
//	console.log(process.argv[2]);
//	console.log(stdout);
    });

    if(fs.existsSync('submission.py')){
//	console.log('its a python file');
	runCommand = 'python'; //'/usr/bin/python';
	fileExtension = '.py';
    }
    else if(fs.existsSync('submission.rb')){
//	console.log('its a ruby file');
	runCommand = 'ruby';
	fileExtension = '.rb';
    }
    else if(fs.existsSync('submission.java')){
	console.log('its a java file');
    }
    else {
	console.log('we have a problem');
    }

    var options = {
	timeout: 20000,
	killSignal: 'SIGKILL'
    }

    async.waterfall([
	//run the code (probably want to add a timeout)
	function(callback){
	    
	    exec(runCommand + ' test' + fileExtension, callback);
	   // callback(null, "standard out is fine", "standard in is fine")
	},
	function(stdout, stderr, callback){
	    console.log(stdout);
	    console.log(stderr);
	}
    ],function(err, results){
	console.log(err);
    })
    
/*
    exec(runCommand + " " + process.argv[2] + '/submission' + fileExtension, function(error, stdout, stderr){
	if(error) console.log(error);
	if(stderr) console.log(stderr);
	console.log(stdout);
    });
  */  
}





    


