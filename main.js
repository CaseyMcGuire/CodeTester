if(require.main === module){
    //TODO: mke sure pass GET and POST uri
    main();
}

function main(){
    var request = require('request');
    getUngradedSubmission(request, function(error, body){
	console.log(body);
	request({
	    method: 'POST',
	    uri: 'http://localhost:3000/submission/update/1',
	    json: true,
	    body: JSON.stringify({"hello" : "world"})
	}, function(error, response, body){
	    if(error) console.log(error);
	    else console.log(body);
	});
    });
}

/*
  
 */
function getUngradedSubmission(request, callback){
    request({
	uri: 'http://localhost:3000/submission/get_ungraded',
	json: true
    }, function(error, response, body){
	if(error) callback(error);
	else callback(null, body);//console.log(body);
    });
}
