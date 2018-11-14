const Database = require("./database")
const config   = require("../config")
const walk     = require("walk")

const database = new Database(__dirname + "/../db/main.db")

class World {

    static async newWave(){
        // TODO : spawn a new wave of pokemon.
        const directories = config.directories
        let counter = 0

    }

    static spawnPokeballBonus(number){
        // TODO : spawn a pokeball.up with hash in it.
    }
}

module.exports = World