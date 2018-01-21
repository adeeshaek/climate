import http from 'http'
import sqlite from 'sqlite' 
import {scheduleClimateUpdate} from './update-climate' 

scheduleClimateUpdate()

http.createServer((req, res) => {
  res.write('Hello World!') //write a response to the client
  if(req.url == '/'){
  	console.log('hit')
  }
  res.end() //end the response
}).listen(60001) //the server object listens on port 8080


