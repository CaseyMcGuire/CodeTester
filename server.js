var fs = require('fs');
var file = process.argv[2]||"/home/casey/Desktop/cs440Project/db/development.sqlite3";
var exists = fs.existsSync(file);
var exec = require('child_process').exec;
console.log(exists);

var sqlite3 = require("sqlite3").verbose();//verbose allows stack traces for debugging
var db = new sqlite3.Database(file);


//db serialize means queries are done serially instead of in parallel
db.serialize(function(){
    //just prints all ungraded submissions
    db.each("SELECT * FROM submissions WHERE completed = 'f'", function(err, row){

	var filename = "scripts/" + Math.random()*100000 + ".py";
	fs.writeFile(filename, row.code, function(err){
	    console.log(row.code);
	    if(err){
		console.log(err);
	    }else{
		exec('python ' + filename, function(error, stdout, stderr){
		    console.log("stdout: " + stdout);
		    console.log("stderr: " + stderr);
		    db.run("UPDATE submissions SET completed = 't' WHERE id = ?", row.id);
		    
		    if(stdout.length !== 0) {
			db.run("UPDATE submissions SET status_id = 1 WHERE id = ?", row.id);
			
		    }else{
			db.run("UPDATE submissions SET status_id = 2 WHERE id = ?", row.id);
		    }
		    if(error !== undefined){
			console.log(error);
		    }
		});
		
		console.log("file was saved");
	    }
	    
	});
	console.log(row);

    });
});


//close the database

//db.close();


//Not very efficient but okay for now
function sleep(seconds){

    var endTime = new Date().getTime() + (seconds * 1000);
    while(new Date().getTime() <= endTime){}
}
