/*
  The Sqlite database should be used for testing on localhost and not in production.

*/

var Database = function(filename){
    
    if(!filename) throw "no filename";
    var fs = require('fs');
    if(!fs.existsSync(filename)) throw "no such file";
    
    var sqlite3 = require("sqlite3").verbose();
    this.db = new sqlite3.Database(filename);
}

/*
  Queries the database for ungraded submissions, writes them to filesystem, and 
  returns an array containing the filenames of the submissions.
*/
Database.prototype.getUngradedSubmissions = function(callback){
    var fs = require('fs');  
    var util = require('../lib/util');
    
    var database = this.db;
   
    //do queries serially (as opposed to in parallel)
    database.serialize(function(){
	database.each("SELECT * FROM submissions WHERE completed = 'f'", function(err, row){
	   
	    if(err) callback(err);
	    //Python is okay at first
	    var filename = "scripts/" + util.getRandomString() + ".py";
	    fs.writeFile(filename, row.code, function(err){
		if(err) callback(err);
		callback(null, row.id, filename);
	    });
	    	   
	});
    });

}

/*
  Store the result of the tests back into the database.

  @param {Number} The id of the problem in the database.
  @param {Number} The id of the result
 */
Database.prototype.store = function(id, result){
    console.log("store was called");
    
    
}

/*
  Closes the database connection.
*/
Database.prototype.close = function(){
    this.db.close();
}

module.exports.Database = Database;
