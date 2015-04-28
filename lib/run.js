var exec = require('child_process').exec;
var spawn = require('child_process').spawn;
var async = require('async');
var fs = require('fs');

if(require.main === module){
   
    
    
    var runCommand;
    var fileExtension;
    var process;

    //variables for compiled langauges.
    var isCompiled = false;
    var compileCommand;
    var compileFileExtension;


    exec('echo $PATH', function(error, stdout, stderr){

    });

    if(fs.existsSync('code/submission.py')){
	runCommand = 'python'; 
	fileExtension = '.py';
    }
    else if(fs.existsSync('code/submission.rb')){
	runCommand = 'ruby';
	fileExtension = '.rb';
    }
    else if(fs.existsSync('code/submission.java')){
	isCompiled = true;
	compileCommand = 'javac';
	fileExtension = '';
	compileFileExtension = '.java';
	runCommand = 'java';

    }
    else {
	throw new Error("Unsupported language");
    }

    var options = {
	cwd : "/code",
	timeout : '10000'
    }
    
    async.waterfall([
	//run the code (probably want to add a timeout)
	function(callback){
	    if(isCompiled){

		exec(compileCommand + ' submission' + compileFileExtension + ' && ' + compileCommand + ' test' + compileFileExtension, options, function(error, stdout, stderr){
		    if(error) callback(error);
		    else if(stderr) callback(new Error(stderr));
		    else callback(null);
		});
	    }else{
		callback(null);
	    }
	},
	function(callback){
	    fs.readFile('code/output.txt', 'utf-8', function(err, data){
	//	console.log(data);
		if(err) callback(err);
		else callback(null, data);
	    });
	},
	function(data, callback){
	    var runFile;
	    if(isCompiled) runFile = ' Test';//compiled Java files are named after the class
	    else runFile = ' test'
	    
	    exec(runCommand + runFile + fileExtension, options, function(error, stdout, stderr){
		if(error) callback(error);
		else if(stderr) callback(new Error(stderr));
		else callback(null, data, stdout);
	    });
	  
	},//stdout should be removed at some point but its okay for now
	function(data, stdout, callback){
	    fs.readFile('code/user_output.txt', 'utf-8', function(err, outputData){
		if(err) callback(err);
		else {
		   // console.log(outputData);
		    var expectedOutput = data.split('\n');
		    var userOutput = data.split('\n');

		    if(expectedOutput.length !== userOutput.length){
			callback(null, "FAIL");
		    }
		    else{
			for(var i = 0; i < expectedOutput.length; i++){
			    if(expectedOutput[i] !== userOutput[i]){
				callback(null, "FAIL");
			    }
			}
			callback(null, "PASS");
		    }
		}
	    });
	}
    ],function(err, results){

	if(err) console.log(err);
	else console.log(results);

    })

}





    


