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
	//things I need to do here RIGHT NOW:
	//run each submission
	//if it runs, write pass back to the database
	//if it doesn't run, write fail back to the database
	//at some point I probably want to spawn off child processes...
	
	//at some point, this will need to get more complicated
	

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
//	sleep(5);	    
    });
});


//close the database
sleep(5);
//db.close();


//I *think* this will block the thread until the amount of time passed as a parameter is complete
//Note this is hogging the CPU and is a *really* bad idea in the long run but its fine for now
function sleep(seconds){

    var endTime = new Date().getTime() + (seconds * 1000);
    while(new Date().getTime() <= endTime){}
}
