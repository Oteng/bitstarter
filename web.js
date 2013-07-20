var express = require('express'),
fs = require('fs');

var app = express.createServer(express.logger());

app.get('/', function(request, response) {
 
   fs.readFile('index.html','utf8',function(err,data){       
       if(err){console.log(err)}
       else{
	   response.send(data);
       }
   })
});

var port = process.env.PORT || 8080;
app.listen(port, function() {
  console.log("Listening on " + port);
});
