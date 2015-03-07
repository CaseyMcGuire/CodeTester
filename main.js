if(require.main === module){
    main();
}

function main(){
    var http = require('http');

    var options = {
	hostname: 'localhost',
	path: '/submissions/get_ungraded',
	port: 3000,
	headers: {
	    'Content-Type': 'application/json'
	}

    }

    http.get(options, function(res){
//	console.log(res);
	res.setEncoding('utf8');
	var body = '';
	res.on('data', function(chunk){
	    body += chunk;

	});
	res.on('end', function(){
	    console.log(body);
	    var obj = JSON.parse(body);
	    console.log(obj);
	});

    });
    
    /*
    var req = http.request(options, function(res){
	res.setEncoding('utf8');
	res.on('data', function(chunk){
	    console.log('Body: ' + chunk);
	});

    });

    req.on('error', function(e){
	console.log("There was a problem: " + e.message);
    });
    req.end();
*/
/*
    http.get("http://localhost:3000/problems", function(res){
	console.log("got response: " + res.statusCode);
//	console.log(res);
    }).on('error', function(e){
	console.log("got error: " + e.message);
    });

*/
}
