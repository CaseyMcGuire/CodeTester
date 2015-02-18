/*
  A simple wrapper for the sqlite module.

*/

var Database = function(filename){
    
    if(!filename) throw "no filename";
    var fs = require('fs');
    if(!fs.existsSync(filename)) throw "no such file";
    
    var sqlite3 = require("sqlite3").verbose();
    this.db = new sqlite3.Database(filename);
}

/*
  Runs the passed the query and passes each row to the callback function.

  @param{String} The database query in SQL 
  @param{Function} A function that is called for each row.
*/
Database.prototype.each = function(query, callback){
    var database = this.db;

    database.parallelize(function(){
	database.each(query, callback);
    });
}

/*
  Store the result of the tests back into the database.

  
 */
Database.prototype.run= function(query, params, callback){
    this.db.run(query, params, callback);
}

/*


*/
Database.prototype.storeResult = function(params, callback){
    console.log("storeResult was called");
}

/*
  Closes the database connection.
*/
Database.prototype.close = function(){
    this.db.close();
}

module.exports.Database = Database;
