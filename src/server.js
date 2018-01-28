import http from 'http'
import sqlite from 'sqlite' 
import {scheduleClimateUpdate} from './update-climate' 
import express from 'express' 
import bodyParser from 'body-parser';
import {isValidToken, genToken} from './auth'

const app = express()
const port = 60000

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.get('/', isAuthenticated, (req, res) => {
    console.log('hit')
    res.send('Hello World!')
})

app.get('/auth', (req,res) => {
    console.log('auth')
    res.send('Authenticate here')
})

app.post('/login', (req,res) => {
    console.log('login: ' + req.body.username)
    if(typeof(req.body) !== 'udefined' && req.body.username !== undefined && req.body.password !== undefined){
        genToken(req.body.username, req.body.password)
                        .then((result) => res.send(result))
                        .catch((err) => {
                            console.log("login failed due to " + err)
                            res.send(err)
                        })
    } else {
        res.send({err: 'username and password not found'})
    }
        
})

app.post('/auth', function (req, res) {
  console.log('Received request :' + JSON.stringify(req.body))
  isValidToken(req.body.token)
    .then((authd) => {
          if(authd === true){
                console.log("successfully authenticated")
            res.send({auth: true})
          } else {
            res.send({auth: false})
          }
    })
    .catch((err) => {
        console.log("could not auth due to error" + err)
        res.send(err);
    })
})

function isAuthenticated(req, res, next){
  // do any checks you want to in here

  // CHECK THE USER STORED IN SESSION FOR A CUSTOM VARIABLE
  // you can do this however you want with whatever variables you set up
  if (false)
      return next();

  // IF A USER ISN'T LOGGED IN, THEN REDIRECT THEM SOMEWHERE
  res.redirect('/auth');
}

app.listen(port, () => console.log('Example app listening on port ' + port + '!'))

scheduleClimateUpdate()



