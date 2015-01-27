/*
  The Sqlite database should be used for testing on localhost and not in production.

*/

var Database = function(filename){
    if(!filename) throw "no filename";
    var fs = require('fs');
    if(!fs.existsSync(file)) throw "no such file";
    
    var sqlite3 = require("sqlite3").verbose();
    this.db = new sqlite3.Database(file);
}

/*
  Queries the database for ungraded submissions, writes them to filesystem, and 
  returns an array containing the filenames of the submissions.
*/
Database.prototype.getUngradedSubmissions = function(callback){
    var fs = require('fs');  
    var util = require('./CodeTester/lib/util');
   
    //do queries serially (as opposed to in parallel)
    this.db.serialize(function(){
	db.each("SELECT * FROM submissions WHERE completed = 'f'", function(err, row){
	    if(err) callback(err);
	    //Python is okay at first
	    var filename = "scripts/" + util.getRandomString() + ".py";
	    fs.writeFile(filename, row.code, function(err){
		if(err) callback(err);
		callback(null, row.id, filename);
	    });
	    
	    //need to update database to say that submission is being graded
	   
	});
    });

}

/*
  Store the result of the tests back into the database.

  @param {Number} The id of the problem in the database.
  @param {Number} The id of the result
 */
Database.prototype.store = function(id, result){

    
    
}

/*
  Closes the database connection.
*/
Database.prototype.close = function(){
    this.db.close();
}

module.exports.sqlite = Database;
