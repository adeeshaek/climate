import {now} from './common-utils'
import {saveUserData} from './persistence'
import {hashAndSaltPassword} from './crypto'

const insertUser = (username, password) => {
    hashAndSaltPassword(password)
        .then((hash) => {
            saveUserData(username, hash)
        }).catch((err) => {
            console.log("hashing pwd failed due to " + err)
        })
}

insertUser("adeesha", "wubbybear")
