const Database = require("./database")
const pokeapi  = require("./pokeapi")
const config   = require("../config")
const utils    = require("./utils")
const path     = require("path")
const walk     = require("walk")
const fs       = require("fs")

const database = new Database(__dirname + "/../db/main.db")

class World {
    /*
    World class handles the major filesystem manipulations.
     */

    static async newWave() {
        /*
        Spawns a new wave of pokemon files in the authorized directories.
         */

        console.log("Spawning pokemons in your filesystem... Please wait")

        const idsOfAdded = await database.getIdOfAdded()
        let ids = []
        for (let i = 0; i < config.pokemonPerWave; i++) {
            let random = utils.getRandomInt(386)
            while (idsOfAdded.includes(random) && ids.includes(random)) {
                random = utils.getRandomInt(386)
            }
            ids.push(random)
        }

        let directories = await this.walkInFilesystem()

        for (let id of ids) {
            let randomIndex = utils.getRandomInt(directories.length)
            let directory = directories[randomIndex - 1]
            await this.spawnPokemon(directory, id)
        }
        console.log("Done !")
    }

    static async spawnPokeballBonus() {
        /*
        Spawns a new pokeball bonus in the authorized directories.
         */

        let directories = await this.walkInFilesystem()

        let randomIndex = utils.getRandomInt(directories.length)
        let directory = directories[randomIndex - 1]

        const filepath = path.resolve(directory) + "/pokeball.up"
        const hash = await utils.getHash("pokeball")

        fs.writeFileSync(filepath, hash);
        await database.addFilePokeball(filepath, hash)

        console.log("A pokeball.up spawned in your filesystem !")
    }

    static async spawnPokemon(dirpath, id) {
        /*
        Spawns a new pokemon file in the authorized directories.
        :param dirpath string : Path of the directory where the .pok will be spawned.
        :param id integer : Id of the pokemon to spawn.
         */

        let pokemon = await pokeapi.getPokemon(id)
        const filepath = path.resolve(dirpath) + "/" + pokemon.name + ".pok"
        const hash = await utils.getHash(pokemon.name)
        fs.writeFileSync(filepath, hash);
        await database.addFilePokemon(filepath, hash, pokemon)
    }

    static async walkInFilesystem() {
        /*
        Gets all the sub-directories and directories path of the authorized directories.
        :return directories Array : An array of sub-directories and directories.
         */

        const possibleDirectories = config.directories
        let directories = []
        let walker
        let options = {
            listeners: {
                directories: function (root, dirStatsArray, next) {
                    directories.push(root)
                    dirStatsArray.map( (dirStat) => {
                        directories.push(root + "/" + dirStat.name)
                    })
                    next();
                }
                , errors: function (root, nodeStatsArray, next) {
                    next();
                }
            }
        };
        possibleDirectories.map( (directory) => {
            walker = walk.walkSync(directory, options);
        })
        return directories
    }

    static async moveFilePokemon(path) {
        /*
        Moves a pokemon file in an other authorized directories and changes database entry.
        :param path string : Path to the pokemon file to move.
         */

        // TODO : moving of file pokemon
    }

    static async removePokemon(path, fromDatabase) {
        /*
        Removes a pokemon from filesystem and database if needed.
        :param path string : Path to the pokemon file to remove.
        :param fromDatabase boolean : True if erasing from database needed
         */

        if (fromDatabase) {
            await database.removePokemon(path)
        }
        fs.unlinkSync(path)
    }

    static async removePokeballBonus(path) {
        /*
        Removes a pokeball.up from filesystem and database.
        :param path string : Path to the pokeball.up file to remove.
         */

        await database.removePokeballBonus(path)
        fs.unlinkSync(path)
    }
}

module.exports = World