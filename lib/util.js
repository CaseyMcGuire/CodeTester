var Util = {
    /*
      Returns a random string.
     */
    getRandomString: function(){
	return require('node-uuid').v4();
    },
    /*
      Creates a folder with a random name in the scripts directory and writes the
      user's code into it. The callback is passed the obj passed into the function
      and the folder name where the code was written to.

      @param {Object} An object that has a code attribute to be written and a
                      language attribute.
      @param {Function} callback The callback
     */
    writeCodeToFile : function(obj, callback){
	var fs = require('fs');
	var folderName = "scripts/" + this.getRandomString();
	fs.mkdir(folderName, function(){
	    var filename = folderName + "/submission" +  getProgrammingLanguageExtension(obj.language);
	    fs.writeFile(filename, obj.code, function(err){
		if(err) callback(err);
		callback(null, obj, folderName);
	    });
	});
    },
    /*
      Returns the file extension for a given programming language name.
      
      @param {String} languageName The name of the programming language
     */
    getProgrammingLanguageExtension : function(languageName){
	languageName = languageName.toLowerCase();
	if(languageName === "ruby") return ".rb";
	else if(languageName === "python") return ".py";
	else throw Error("invalid language name");
    }
}

module.exports = Util;
