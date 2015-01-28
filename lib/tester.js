

var Tester = function(){
    this.async = require('async');
    this.exec = require('child_process').exec;
    console.log("in the constructor, this.exec is");
    console.log(this.exec);//function
}


Tester.prototype.start = function(err, id, filename, callback){
    //probably want to use async series here but this is fine for now
    console.log("this.exec is ");
    console.log(this.exec);//is undefined... but why?
    console.log("this.db is ");
    console.log(this.db);
    console.log("this is ");
    console.log(this);
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
