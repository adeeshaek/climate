var http = require('http');

http.createServer(function (req, res) {
  res.write('Hello World!'); //write a response to the client
  if(req.url == '/'){
  	console.log('hit');
  }
  res.end(); //end the response
}).listen(8080); //the server object listens on port 8080
