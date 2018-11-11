const spawnAsync = require('child_process').spawnSync
const config = require('../config')
const crypto = require('crypto')

class Utils {

    static sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    static getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max) + 1);
    }

    static getHash(pokemonFile) {
        let clear = (pokemonFile + new Date().getTime() + this.getRandomInt(100000))
        return crypto.createHash('sha256').update(clear).digest('base64')
    }

    static playSound(path) {

        return new Promise((resolve, reject) => {
            let execReturn = spawnAsync(config.audioPlayer, [path], { "stdio" : "ignore"})

            if ( execReturn.status === 0) {
               resolve()
            } else {
               reject(execReturn.error)
            }

       })
    }
}

module.exports = Utils