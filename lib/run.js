if(require.main === module){

    
    var exec = require('child_process').exec;
    var runCommand;
    var fileExtension;


    var fs = require('fs');
    exec('ls', function(error, stdout, stderr){
//	console.log("here we are");
//	console.log(process.argv[2]);
//	console.log(stdout);
    });

    if(fs.existsSync(process.argv[2] + '/submission.py')){
	console.log('its a python file');
	runCommand = 'python';
	fileExtension = '.py';
    }
    else if(fs.existsSync(process.argv[2] + '/submission.rb')){
	console.log('its a ruby file');
	runCommand = 'ruby';
	fileExtension = '.rb';
    }
    else if(fs.existsSync(process.argv[2] + '/submission.java')){
	console.log('its a java file');
    }
    else {
	console.log('we have a problem');
    }
    
    exec(runCommand + " " + process.argv[2] + '/submission' + fileExtension, function(error, stdout, stderr){
	if(error) console.log(error);
	if(stderr) console.log(stderr);
	console.log(stdout);
    });
    
}


    


