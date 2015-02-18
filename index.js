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
    //Get all ungraded submissions from the database
    database.each("SELECT * FROM submissions WHERE completed = 'f'", function prepareCode(err, row){
	var util = require('./lib/util');	
	//write the code to a file and then run it
	util.writeCodeToFile(row, function runCode(err, row, filename){

	    if(err) throw err;
	    var tester = new test.Tester();

	    tester.start(filename, function(err, stdout, stderr){
		console.log("stdout: " + stdout);
		console.log("stderr: " + stderr);
		if(err) throw err;
		database.storeResult();
	    });
	});
    });

    //restart every 10000 milliseconds
    setTimeout(function(){
	run(database);
    }, 10000);

}

if(require.main === module){
    main();
}
