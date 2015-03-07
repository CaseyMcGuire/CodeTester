if(require.main === module){
    main();
}

function main(){

    var request = require('request');
    request({
	uri: 'http://localhost:3000/submissions/get_ungraded',
	json: true
    }, function(error, response, body){
	if(error){
	    console.log(error);
	    console.log(response);
	}
	else console.log(body);
    });

}
