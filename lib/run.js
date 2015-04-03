var exec = require('child_process').exec;
var async = require('async');

if(require.main === module){

    
    
    var runCommand;
    var fileExtension;
    var process;

    var fs = require('fs');
    exec('echo $PATH', function(error, stdout, stderr){

    });

    if(fs.existsSync('submission.py')){
	runCommand = 'python'; //'/usr/bin/python';
	fileExtension = '.py';
    }
    else if(fs.existsSync('submission.rb')){
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
	timeout: 700,
	killSignal: 'SIGTERM'
    }

    async.waterfall([
	//run the code (probably want to add a timeout)
	function(callback){
	    
	    process = exec(runCommand + ' test' + fileExtension, options, callback);
	   // callback(null, "standard out is fine", "standard in is fine")
	},
	function(stdout, stderr, callback){
	    console.log(stdout);
	   // console.log('stderr');
	    console.log(stderr);
	}
    ],function(err, results){
	if(process !== undefined){
	    process.kill('SIGKILL');
	}
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





    


