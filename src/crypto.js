import bcrypt from 'bcrypt'

const saltRounds = 10;

export function hashAndSaltPassword(password) {
    return bcrypt.hash(password, saltRounds)
}

export function passwordsMatch(password, hash) {
    return bcrypt.compare(password, hash).then((res) => {
        if (res) {
            return true
        } else {
            return false
        }
    }).catch((err) => {
        console.log("could not match passwords due to " + err)   
        return false
    });
}
