var Util = {
    /*
      Returns a random string.
     */
    getRandomString: function(){
	return require('node-uuid').v4();
    },
    writeCodeToFile : function(row, callback){
	var fs = require('fs');
	var filename = "scripts/" + this.getRandomString() + ".py";
	fs.writeFile(filename, row.code, function(err){
	    if(err) callback(err);
	    callback(null, row, filename);
	});
    }
}

module.exports = Util;
