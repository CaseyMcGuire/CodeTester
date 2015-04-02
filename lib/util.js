var Util = {
    /*
      Returns a random string.
     */
    getRandomString: function(){
	return require('node-uuid').v4().toString().replace(/-/g, '').toLowerCase();
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
	var util = this;
	fs.mkdir(folderName, function(){

	    var codeExtension = util.getProgrammingLanguageExtension(obj.language);
	    
	    var submissionFileName = folderName + "/submission" +  codeExtension;
	    var testCodeFileName = folderName + "/test" + codeExtension;
	    var inputFileName = folderName + "/input.txt";
	    var outputFileName = folderName + "/output.txt";
	    var runnerFileName = folderName + '/run.js';
	    //I have to pass a fake callback otherwise async won't call 
	    //the last callback
	    require('async').parallel([
		function(cb){
		    fs.writeFile(submissionFileName, obj.code);
		    cb(null);
		},
		function(cb){
		    fs.writeFile(testCodeFileName, obj.test_code);
		    cb(null);
		},
		function(cb){
		    fs.writeFile(inputFileName, obj.input);
		    cb(null);
		},
		function(cb){
		    fs.writeFile(outputFileName, obj.output);
		    cb(null);
		},function(cb){
		    require('fs-extra').copy('lib/run.js', runnerFileName, function(err){
			if(err) console.log(err);
			else console.log('no problem');
		    });
		    cb(null);
		}
	    ],function(err, results){
	//	console.log("here we are");
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
