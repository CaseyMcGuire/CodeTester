

var Tester = function(){
    this.async = require('async');
    this.exec = require('child_process').exec;
    console.log("in the constructor, this.exec is");
    console.log(this.exec);//function
}


Tester.prototype.start = function(err, id, filename, callback){
    //probably want to use async series here but this is fine for now
    this.exec("python " + filename, function(error, stdout, stderr){
	if(error) throw error;
	console.log("stdout: " + stdout);
	console.log("stderr: " + stderr);
    });
}

Tester.prototype.runTest = function(){
    //to be used later
}

module.exports.Tester = Tester;
