const Database = require("./database")
const Pokerror = require("./pokerror")
const asciify  = require("asciify-image")
const config   = require("../config")
const utils    = require("./utils")
const path     = require("path")
const fs       = require("fs")

const database = new Database(path.resolve(__dirname, "..", "db", "main.db"))

class AntiCheat {
    /*
    Anticheat class handles the analyze of file for legitimacy.
     */

    constructor(file, mode) {
        /*
        :param file string : The file to analyze.
        :param mode string : The analyze mode for the file.
         */

        this.filePath = path.resolve(file)
        this.fileName = path.basename(file).split('.')[0]
        this.mode = mode
    }

    async analyze() {
        /*
        Check if this.file is legit with the this.mode process.
        :return undefined : If the file does not exist.
        :return false : If the file is not legit.
        :return true : If the file is legit.
         */

        try {
            if (!fs.existsSync(this.filePath)) {
                return undefined
            }

            const fileHash = fs.readFileSync(this.filePath, 'utf8')
            switch (this.mode) {

                case "pokemon":
                    const databasePokemon = await database.getPokemon(this.filePath)
                    return !(!databasePokemon ||
                        (databasePokemon.hash !== fileHash && databasePokemon.name !== this.fileName))

                case "pokeball":
                    const databaseHash = await database.getPokeballHash(this.filePath)
                    return !(!databaseHash ||
                        (databaseHash !== fileHash && "pokeball" !== this.fileName))
            }
        } catch (err) {
            throw new Pokerror(err.message, "Anticheat analyze")
        }
    }

    async showTeamRocket() {
        /*
        Shows the team rocket ascii with a message for the cheater.
        :param isPokemon boolean : True if the cheat concerns the capture of a pokemon.
         */

        try {
            let ascii = await asciify(path.resolve(__dirname, "..", "assets", "images", "teamrocket.png"), config.ascii)
            console.log(ascii)

            console.log("You piece of cheat !")

            if (this.mode === "pokemon") {
                console.log("This is not a valid pokemon...")
            } else {
                console.log("This is not a valid bonus...")
            }

            await utils.playSound(path.resolve(__dirname, "..", "assets", "sounds", "rocket.mp3"))
        } catch (err) {
            throw new Pokerror(err.message, "Anticheat team rocket")
        }
    }
}

module.exports = AntiCheat