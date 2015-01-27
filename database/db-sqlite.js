

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

  @return {array} An array of strings that are the file names of the submissions.
*/
Database.prototype.getUngradedSubmissions = function(){
    var fs = require('fs');  
    var util = require('./CodeTester/lib/util');
    var arr = [];
    
    this.db.serialize(function(){
	db.each("SELECT * FROM submissions WHERE completed = 'f'", function(err, row){
	    if(err) return err;
	    //Python is okay at first
	    var filename = "scripts/" + util.getRandomString() + ".py";
	    fs.writeFile(filename, row.code);
	    
	});
    });
}

/*
  Store the result of the tests back into the database.

  @param {float} The id of the problem in the database.
  @param {float} The id of the result
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
