import request from 'request-promise-native'
import sqlite from 'sqlite'
import {now} from './common-utils'

const url = 'http://100.2.167.36:60002/tmp'
const db = './database.sqlite'

const makeRequest = () => {
    return request(url, { json: true }, (err, res, body) => {
        if (err) {  
            console.log(err)
            return {}    
        } else {
            return body
        }
    });
}

const saveData = (data) => {
    Promise.all([
        sqlite.open(db, { Promise }),
    ]).then(function([database]){
        database.run("INSERT INTO Climate (temperature, humidity, createdAt) VALUES (?,?,?)",
            data.temperature,
            data.humidity,
            now())
    })
}

export function getUserDataByUsername (username) {
    return Promise.all([
        sqlite.open(db, { Promise }),
    ]).then(function([database]){
        return database.get("SELECT * FROM Users WHERE name = ?",
                username)
    }).catch((err) => {
        console.log("could not retrieve user with name " + username + " due to " + err)
        return {}
    })
}

export function getUserDataByToken (authToken) {
    return Promise.all([
        sqlite.open(db, { Promise }),
    ]).then(function([database]){
        return database.get("SELECT * FROM Users WHERE authToken = ?",
                authToken)
    }).catch((err) => {
        console.log("could not retrieve user with authToken " + authToken + " due to " + err)
        return {}
    })
}

export function saveUserData (username, passwordHash) {
    sqlite.open('./database.sqlite')
        .then((database) => {
            database.run("INSERT INTO Users (name, password, createdAt) VALUES (?,?,?)",
                username,
                passwordHash,
                now())
        }).catch((err) => {
            console.log("storing pwd failed due to " + err)
        })
}

export function saveToken (username, token) {
    sqlite.open('./database.sqlite')
        .then((database) => {
            database.run("UPDATE Users set authToken = ? where name = ?",
                token,    
                username)
        }).catch((err) => {
            console.log("storing token failed due to " + err)
        })
}

export function persistData() {
    makeRequest()
        .then(data => { 
                if ('temperature' in data && 'humidity' in data){
                    console.log("Saving data " + JSON.stringify(data))
                    saveData(data)    
                } else {
                    console.log("Not saving data " + data)
                }
        })
        .catch(error => console.log(error))
}

