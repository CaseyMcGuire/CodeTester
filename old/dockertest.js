var Docker = require('dockerode');

var docker = new Docker();
var async = require('async');


/*
var DockerRunner = require('docker-exec');
var ds = new DockerRunner();
ds.start({Binds : ["/test:/test"]}
).then(function(stream){
    stream.pipe(process.stdout);
    return ds.run('ls');
}).then(function(){
    return ds.run('python test/test.py');
}).then(function(){
    ds.stop();
})
*/

/*
docker.createContainer({Image: 'ubuntu:latest', Cmd: ['/bin/bash'], name: 'test'}, function(err,container){
    
    if(err){
	console.log("there was an error");
	console.log(err);
	return;
    }

    var attach_options = {
	stream: true,
	stdin: true,
	stdout: true,
	stderr: true
    }

    async.waterfall([
	function(callback){
	    container.attach(attach_options, function(err, stream){
		if(err) callback(err);
		//	console.log(stream);
		callback(null);
	    });
	},
	function(callback){
	    container.inspect(function(err, data){
		if(err) callback(err);
		console.log(data);
		callback(null);
	    });
	},
	function(callback){
	    container.start(function(err, data){
		if(err) {
		    console.log("there was a problem starting");
		    callback(err);
		}
		else{
		    console.log("container is up and running");
		    console.log(data);
		    callback(null);
		}
	    });
	},
	function(callback){
	    var options = {
		Cmd : ["echo", "'foo'"]
	    }

	    container.exec(options, function(err, exec){
		if(err) {
		    console.log("There was a problem executing");
		    callback(err);
		}
		else{
		    console.log(arguments);
		    console.log(exec.start);
		   
		    exec.start(function(err, stream){
			if(err) callback(err);
			console.log(stream.pipe);
			stream.pipe(process.stdout);			
			stream.on('close', function(){
			    callback(null);
			});

		    });
		    //console.log(getAllMethods(exec));
		  

		    
		    
		}
	    });
	},
	function(callback){
	    container.stop(5, function(err, data){
		if(err){
		    console.log("there was a problem stopping");
		    console.log(err);
		    callback(err);
		}
		else {
		    console.log("There was no problem stopping");
		    console.log(data);
		    callback(null);
		}
	    });
	},
	function(callback){
	    container.remove(function(err, data){
		if(err) {
		    console.log(err);
		    console.log("There was a problem removing");
		}
		else {
		    console.log("There was no problem removing");
		    console.log(data);
		}
	    });
	}
    ], function(err, result){
	
    });


});


function getAllMethods(object) {
    return Object.getOwnPropertyNames(object).filter(function(property) {
        return typeof object[property] == 'function';
    });
}


*/
