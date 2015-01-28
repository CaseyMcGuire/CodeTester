var Util = {
    /*
      Returns a random string.
     */
    getRandomString: function(){
	return require('node-uuid').v4();
    }
}

module.exports = Util;
