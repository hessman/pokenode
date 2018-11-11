
const crypto = require('crypto');

class Utils {

    static sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    static getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max) + 1);
    }

    static getHash(pokemonFile){
        let clear = (pokemonFile + new Date().getTime() + this.getRandomInt(100000))
        return crypto.createHash('sha256').update(clear).digest('base64')
    }
}

module.exports = Utils