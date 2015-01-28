/*
  This file begins the application
*/

var main = function(){
    var file = process.argv[2]||"/home/casey/Desktop/cs440Project/db/development.sqlite3";
    var database = require('./database/db-sqlite');
    var test = require('./lib/tester');
    
    var db = new database.Database(file);
    var tester = new test.Tester();
    console.log(tester);
    db.getUngradedSubmissions(tester.start);
    setTimeout(function(){
	console.log("wake up time!");
    }, 10000);
    db.close();
    console.log('all done');
}

if(require.main === module){
    main();
}
