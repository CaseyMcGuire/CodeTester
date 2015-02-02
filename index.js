/*
  This file begins the application
*/

var main = function(){
    var file = process.argv[2]||"/home/casey/Desktop/cs440Project/db/development.sqlite3";
    var database = require('./database/db-sqlite');
    var db = new database.Database(file)
    var test = require('./lib/tester');
    run(db);
}

function run(database){
    var test = require('./lib/tester');
    database.runQuery("SELECT * FROM submissions WHERE completed = 'f'", function getCode(err, row){
	var util = require('./lib/util');
	util.writeCodeToFile(row, function(err, row, filename){
	    if(err) throw err;
	    var tester = new test.Tester();
	    tester.start(row.id, filename, function(err){
		if(err) throw err;
		database.store();
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
