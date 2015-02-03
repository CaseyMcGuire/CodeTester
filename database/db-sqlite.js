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

  @param {Number} The id of the problem in the database.
  @param {Number} The id of the result
 */
Database.prototype.store = function(row, result){
    console.log("store was called");
}

/*
  Closes the database connection.
*/
Database.prototype.close = function(){
    this.db.close();
}

module.exports.Database = Database;
