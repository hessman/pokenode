const spawnAsync = require("child_process").spawnSync
const asciify    = require("asciify-image")
const config     = require("../config")
const crypto     = require("crypto")

let quiet = config.quiet

class Utils {
    /*
    Utils class provides some useful functions like getting a random or sleep few ms...
    */

    static sleep(ms) {
        /*
        Sleeps a number of milliseconds
        :param ms int : The number of milliseconds to wait.
        :return Promise.
         */

        return new Promise(resolve => setTimeout(resolve, ms))
    }

    static getRandomInt(max) {
        /*
        Gives a random integer between 1 and the max.
        :param max int : The max limit.
        :return random int : The random number.
         */

        return Math.floor(Math.random() * Math.floor(max) + 1)
    }

    static async getHash(pokemonFile) {
        /*
        Computes a unique hash for a pokemon file.
        :param path string : The path to the pokemon file.
        :return hash string : The computed hash.
         */

        let clear = (pokemonFile + new Date().getTime() + this.getRandomInt(100000))
        return crypto.createHash('md5').update(clear).digest('base64')
    }

    static playSound(path) {
        /*
        Plays a sound with a CLI audi player.
        :param path string : The path to the sound to play.
        :return Promise.
         */

        const player = config.audioPlayer
        const playerOption = config.audioPlayerOption

        return new Promise((resolve) => {
            if(quiet){
                resolve()
            } else {
                let execReturn = spawnAsync(player, [path, ...playerOption], {"stdio": "ignore"})
                if (execReturn.status === 0) {
                    resolve()
                } else {
                    console.log(execReturn.error.message)
                    console.log("Going into quiet mode...")
                    quiet = true
                    resolve()
                }
            }
       })
    }

    static async showTeamRocket(isPokemon) {
        /*
        Shows the team rocket ascii with a message for the cheater.
        :param isPokemon boolean : True if the cheat concerns the capture of a pokemon.
         */

        let ascii = await asciify(__dirname + "/../assets/images/teamrocket.png", config.ascii)
        console.log(ascii)

        console.log("You piece of cheat !")

        if (isPokemon) {
            console.log("This is not a valid pokemon...")
        } else {
            console.log("This is not a valid bonus...")
        }

        await this.playSound(__dirname + "/../assets/sounds/rocket.mp3")
        process.exit()
    }
}

module.exports = Utils