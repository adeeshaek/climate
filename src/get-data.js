import request from 'request-promise-native'
import sqlite from 'sqlite'

const url = 'http://100.2.167.36:60002/tmp'

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
        sqlite.open('./database.sqlite', { Promise }),
    ]).then(function([database]){
        database.run("INSERT INTO Climate (temperature, humidity, createdAt) VALUES (?,?,?)",
            data.temperature,
            data.humidity,
            (new Date).getTime())
    })
}

export function getData() {
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

