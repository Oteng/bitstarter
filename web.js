var express = require('express'),
fs = require('fs');

var app = express.createServer(express.logger());

app.get('/', function(request, response) {
 
   fs.readFile('index.html','binary',function(err,data){       
       if(err){console.log(err)}
       else{
	   response.send(data);
       }
   })
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
