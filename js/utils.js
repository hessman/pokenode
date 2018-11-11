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
        return crypto.createHash('md5').update(clear).digest('base64')
    }

    static playSound(path) {

        const player = config.audioPlayer
        const playerOption = config.audioPlayerOption

        return new Promise((resolve, reject) => {
            let execReturn = spawnAsync(player, [path, ...playerOption], { "stdio" : "ignore" })

            if ( execReturn.status === 0) {
               resolve()
            } else {
               reject(execReturn.error)
            }

       })
    }
}

module.exports = Utils