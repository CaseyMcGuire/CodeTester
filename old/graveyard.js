/*
  These are a bunch of approaches that I tried when working on this project.
  This file is only for my future reference.

*/

function main(){
    async.waterfall([
	//get an ungraded submission
	function(callback){
	    get(callback);
	},
	//write it to a file
	function(body, callback){
	    writeToFile(body, callback);
	},
	//execute it.
	function(body, folderName, callback){
	   var options = {
	       cwd : folderName
	   }

	    
	    child_process.exec('node ' + 'run.js', options, function(error, stdout, stderr){
		var result;
		if(error) result = error;
		else if (stderr) result = stderr;
		else result = stdout;

		callback(null, body, result, folderName);
	    });
	},
	//delete the temp directory
	function(body, stdout, folderName, callback){
	    console.log(folderName);
		/*
		  //lets stop this for the moment.
	    if(folderName.substring(0, 8) === "scripts/"){
		fse.remove(folderName, function(err){
		    if(err) console.log("there was an error deleting the directory");
		});
	    }
		*/
	    
	    callback(null, body, stdout);
	},
	//post the result back to server
	function(body, stdout, callback){
	    post(body.submission_id, stdout, callback);
	}
    ], function(err){
	console.log("all done");
    });
}



function run(){
    getBatchOfSubmissions(function(err, results){
	async.parallel([
	    function(callback){
		grade(results[0], function(error, grade){
		    if(error) post(results[0].submission_id, FAIL, callback);
		    else post(results[0].submission_id, PASS, callback);
		    // var result;
		    // if(grade === PASS) result = "PASS";
		   // else result = "FAIL";
		    
		});
	    }
	], function(_err, results){
	    
	});
    });
    
}

function grade(submission, _callback){

    var id;

    async.waterfall([
	function(callback){
	    writeToFile(submission, callback);
	},
	function(body, folderName, callback){
	    id = folderName.slice(8, folderName.length);
	    setup(folderName, function(err){
		callback(err, folderName);
	    });
	}, 
	//can probably delete folder here actually....
	function(folderName, callback){
	    
	    run(id, function(err, process){
		if(err) callback(err);
		else callback(err, folderName, process);
	    });
	},
	function(folderName, process, callback){
	    var stdout = '';
	    var stderr;

	    //Need to timeout the docker container here as well...
	    
	    
	    process.stdout.on('data', function(data){
		stdout += data;
	    });
	    
	    process.stderr.on('data', function(data){
		if(stderr === undefined) stderr = '';
		stderr += data;
	    });

	    process.on('close', function(code){
		console.log('process closed! with error code: ' + code);

		//I should probably use some sort of coding system instead of string literals
		stdout = stdout.slice(0, 4);
		
		console.log(stderr);
		console.log(stdout === 'PASS');
		console.log(stdout);
		
		if(stderr || stdout !== 'PASS') callback(null, FAIL);
		else callback(null, PASS);
	    });
	}
    ], function(err, result){
	console.log('we are in the final callback');	
	child_process.exec('docker rmi caseymcguire/tester:' + id, function(error, stdout, stderr){
	    console.log(stdout);
	    console.log(error);
	    console.log(stderr);
	    _callback(null, result);
	});	

    });
}


/*
  Queries the server for three submissions and returns them in the callback.
*/
function getBatchOfSubmissions(callback){
    async.series([
	function(callback){
	    get(callback);
	},
	function(callback){
	    get(callback);
	},
	function(callback){
	    get(callback);
	}
    ], function(err, results){
	if(err) callback(err);
	else callback(null, results);
    });
}
