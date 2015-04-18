var exec = require('child_process').exec;
var spawn = require('child_process').spawn;
var async = require('async');

if(require.main === module){

    
    
    var runCommand;
    var fileExtension;
    var process;

    var fs = require('fs');
    exec('echo $PATH', function(error, stdout, stderr){

    });

    if(fs.existsSync('code/submission.py')){
	runCommand = 'python'; //'/usr/bin/python';
	fileExtension = '.py';
    }
    else if(fs.existsSync('code/submission.rb')){
	runCommand = 'ruby';
	fileExtension = '.rb';
    }
    else if(fs.existsSync('code/submission.java')){
	console.log('its a java file');
    }
    else {
	console.log('we have a problem');
    }
    
    async.waterfall([
	//run the code (probably want to add a timeout)
	function(callback){
	    
	  // exec(runCommand + ' submission' + fileExtension, callback);
	    var options = {
		cwd : "/code",
		timeout : '10000'
	    }
	    exec(runCommand + ' test' + fileExtension, options, callback);
	    /*
	      CHANGE SUBMISSION BACK TO TEST.
	     */
	    
	    /*
	    process = spawn(runCommand, ['submission' + fileExtension]);
	   // process = spawn('ls', ['-a']);
	    var isDead = false;
	    var stdout = '';
	    
	   // console.log(process.cwd());
	    process.on('close', function(code){
		isDead = true;
		callback(null, stdout, null);
	    });

	    process.stdout.on('data', function(data){
		stdout = stdout + data;
	    });

	    //if the process isn't dead after 5 seconds, kill it and end 
	    setTimeout(function(){
		if(isDead === false){
		    console.log(stdout);
		    process.kill();
		    callback(null, 'Timeout', null);
		}
	    }, 5000);
	    */
	},
	function(stdout, stderr, callback){
	    if(stderr) console.log(stderr);
	    else console.log(stdout);
	}
    ],function(err, results){
	//	if(process !== undefined){
	//    process.kill('SIGKILL');
	//	}
	console.log(err);
    })

}





    


