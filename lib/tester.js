

var Tester = function(){
    this.async = require('async');
    this.exec = require('child_process').exec;
    this.spawn = require('child_process').spawn;
    this.execFile = require('child_process').execFile;
}


Tester.prototype.start = function(err, id, filename, callback){
    //probably want to use async series here but this is fine for now
    var options = {
	timeout: 500,
	maxBuffer: 200 * 1024,
	killSignal: 'SIGKILL'
    }
    this.exec("python " + filename, options, function(error, stdout, stderr){
	if(error) callback(err);
	console.log("stdout: " + stdout);
	console.log("stderr: " + stderr);
	callback(null);
    });
	
}

Tester.prototype.runTest = function(){
    //to be used later
}

module.exports.Tester = Tester;
