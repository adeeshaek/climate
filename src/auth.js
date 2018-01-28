import {passwordsMatch} from './crypto'
import {getUserDataByUsername, getUserDataByToken, saveToken} from './persistence'
import uuid from  'uuid/v4'

const isMatch = (password, hash) => {
    return passwordsMatch(password, hash)
        .then((isMatch) => {
            return isMatch
        })
        .catch((err) => {
            console.log("could not compare password with hash for user " + username + " due to")
            return false
        })
}

export function isValidToken(token) {
    return getUserDataByToken(token)
        .then((userdata) => {
            if (typeof(userdata) === 'undefined' || Object.keys(userdata).length === 0) {
                console.log("user not authenticated")
                return false
            } else {
                console.log("user authenticated successfully: " + JSON.stringify(userdata.name))
                return true
            }
        })
        .catch((err) => {
            console.log("could not validate token due to " + err)
            return false
        })
}

export function genToken(username, password) {
    return isAuth(username, password)
        .then((authd) => {
            if(authd){
                console.log("auth success; generating token")
                const token = uuid()
                saveToken(username, token)
                console.log("saving token succeeded for :" + username)    
                return {success: true, token: token}
            }else{
                return Promise.resolve({success: false, reason: "auth failed"})
            }
        })
        .catch((err) => {
            console.log("could not generate token due to error: " + err)
            return Promise.resolve({success: false, reason: err})
        })
}

export function isAuth(username, password) {
    return getUserDataByUsername(username)
        .then(userData => isMatch(password, userData.password))
        .catch((err) => {
            console.log("could not retrieve user data due to " + err)
            return false
        })
}

//isAuth("adeesha", "wubbybear")
//    .then((res) => {
//        console.log("result: " + res)
//    })
//    .catch((err) => {
//        console.log("error due to: " + err)
//    })
//
//isValidToken("bleh")
//    .then((res) => {
//        console.log("result: " + res)
//    })
//    .catch((err) => {
//        console.log("err due to :" + err)
//    })
