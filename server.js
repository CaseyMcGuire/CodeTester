var fs = require('fs');
var file = process.argv[2]||"/home/casey/Desktop/cs440Project/db/development.sqlite3";
var exists = fs.existsSync(file);
console.log(exists);

var sqlite3 = require("sqlite3").verbose();//verbose allows stack traces for debugging
var db = new sqlite3.Database(file);

//db serialize means queries are done serially instead of in parallel
db.serialize(function(){
    
    //just prints all ungraded submissions
    db.each("SELECT * FROM submissions WHERE completed = 'f'", function(err, row){
	console.log(row);
    });


});

//close the database
db.close();
