const Database = require("./database")
const asciify  = require("asciify-image")
const config   = require("../config")
const utils    = require("./utils")
const path     = require("path")
const fs       = require("fs")

const database = new Database(__dirname + "/../db/main.db")

class AntiCheat {
    /*

     */

    constructor(file, mode) {
        /*

         */

        this.filePath = path.resolve(file)
        this.fileName = path.basename(file).split('.')[0]
        this.mode = mode
    }

    async analyse() {
        /*

         */

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
    }

    async showTeamRocket() {
        /*
        Shows the team rocket ascii with a message for the cheater.
        :param isPokemon boolean : True if the cheat concerns the capture of a pokemon.
         */

        let ascii = await asciify(__dirname + "/../assets/images/teamrocket.png", config.ascii)
        console.log(ascii)

        console.log("You piece of cheat !")

        if (this.mode === "pokemon") {
            console.log("This is not a valid pokemon...")
        } else {
            console.log("This is not a valid bonus...")
        }

        await utils.playSound(__dirname + "/../assets/sounds/rocket.mp3")
    }
}

module.exports = AntiCheat