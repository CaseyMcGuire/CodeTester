/*
  This file begins the application.
*/

var main = function(){
    var file = process.argv[2];
    var database = require('./database/db-sqlite');
    var db = new database.Database(file)
    run(db);
}

function run(database){
    var test = require('./lib/tester');

    //At some point, I probably want to limit the number of submissions pulled
    //at one time so it doesn't get bogged down
    //Get all ungraded submissions from the database
    database.each("SELECT * FROM submissions WHERE completed = 'f'", function prepareCode(err, row){
	var util = require('./lib/util');	

	console.log(row);

	//write the code to a file and then run it
	util.writeCodeToFile(row, function runCode(err, row, filename){
	    
	    if(err)console.log(err);// throw err;
	    var tester = new test.Tester();

	    tester.start(filename, function(err, stdout, stderr){
		console.log("stdout: " + stdout);
		console.log("stderr: " + stderr);
		if(err)  console.log(err); //throw err;

		//right now, just store that the thing has been graded back into the database
		database.run("UPDATE submissions SET completed = ?, status_id = ? where id = ?", ['t',2, row.id], function(err){
		    if(err) console.log("There was an error");
		    else console.log("There was NO error");
		});
	    });
	});
    });

    //restart every 10000 milliseconds
    setTimeout(function(){
	console.log("calling run again");
	run(database);
	
    }, 10000);

}

/*
  Main method for node.
*/
if(require.main === module){
    main();
}
