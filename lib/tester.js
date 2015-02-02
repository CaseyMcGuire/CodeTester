

var Tester = function(){
    this.async = require('async');
    this.exec = require('child_process').exec;
    this.spawn = require('child_process').spawn;
    this.execFile = require('child_process').execFile;
}


Tester.prototype.start = function(filename, callback){
    //probably want to use async series here but this is fine for now
    var options = {
	timeout: 500,
	maxBuffer: 10 * 1024,
	killSignal: 'SIGKILL'
    }

    console.log(filename);
    this.exec("python " + filename, options, function(error, stdout, stderr){
	if(error){
	    console.log(error);
	    return;// callback(error);   
	}
//	console.log("stdout: " + stdout);
//	console.log("stderr: " + stderr);
	callback(null, stdout, stderr);
    });
	
}

Tester.prototype.runTest = function(){
    //to be used later
}

module.exports.Tester = Tester;
