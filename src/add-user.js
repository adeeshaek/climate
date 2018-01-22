import uuid from 'uuid/v3'
import bcrypt from 'bcrypt'
import sqlite from 'sqlite'
import {now} from './common-utils'

const saltRounds = 10;

const insertUser = (username, password) => {
    bcrypt.genSalt(saltRounds).then((salt) => {
        bcrypt.hash(password, salt)
            .then((hash) => {
                saveUserData(username, hash)
            }).catch((err) => {
                console.log("hashing pwd failed due to " + err)
            })
    })
}

const compareUser = (password, hash) => {
    bcrypt.compare(password, hash).then(function(res) {
        if (res) {
            console.log("success")
        } else {
            console.log("failure")
        }
    });
}

const saveUserData = (username, passwordHash) => {
    sqlite.open('./database.sqlite')
        .then(function([database]){
            database.run("INSERT INTO Users (name, password, createdAt) VALUES (?,?,?)",
                username,
                password,
                now())
        }).catch((err) => {
            console.log("storing pwd failed due to " + err)
        })
}

insertUser("adeesha", "wubbybear")
