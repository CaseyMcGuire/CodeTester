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
	//	console.log("THis language is compiled");
		exec(compileCommand + ' submission' + compileFileExtension + ' && ' + compileCommand + ' test' + compileFileExtension, options, function(error, stdout, stderr){
		    if(error) callback(error);
		    else if(stderr) callback(new Error(stderr));
		    else callback(null);
		});
	    }else{
	//	console.log("Language is not compiled");
		callback(null);
	    }
	},
	function(callback){
	 //   console.log("getting ready to run");
	    var runFile;
	    // exec(runCommand + ' submission' + fileExtension, callback);
	    if(isCompiled) runFile = ' Test';//compiled Java files are named after the class
	    else runFile = ' test'
	    
	    exec(runCommand + runFile + fileExtension, options, callback);
	    /*
	      CHANGE SUBMISSION BACK TO TEST.
	     */
	 	 
	},
	function(stdout, stderr, callback){
	    if(stderr) callback(new Error(stderr));
	    else callback(null, stdout);
	}
    ],function(err, results){
	//	if(process !== undefined){
	//    process.kill('SIGKILL');
	//	}
	if(err) console.log(err);
	else console.log(results);

    })

}





    


