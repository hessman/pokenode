const Database  = require("./database")
const asciify   = require("asciify-image")
const utils     = require("./utils")

const database = new Database(__dirname + "/../db/main.db")

class Pokedex {

    static async show() {

        let promises = []
        promises.push(utils.playSound(__dirname + "/../assets/sounds/pokedex.mp3"))
        promises.push(database.getPokedexEntries())
        promises.push(database.countFilePokemon())
        promises.push(database.getPokeballForce())
        promises.push(asciify(__dirname + "/../assets/images/pokedex.png", {
            "fit" : "box",
            "width" : 50,
            "height" : 25
            }))
        promises = await Promise.all(promises)
        const entries = promises[1]
        const countFilePokemon = promises[2]
        const pokeballForce = promises[3]

        console.log(promises[4])
        console.log("\n******POKEDEX******")

        console.log("\n--CAPTURED (" + entries.length + "/386):\n")

        entries.map((entry) => {
            let message= "ID : " + entry.id
            message = message.padEnd(7) + " | "
            const name = entry.name.charAt(0).toUpperCase() + entry.name.substring(1)
            message += name.padEnd(12) + " | "
            if (entry.path !== null) {
                message += "Found in your file system here : " + entry.path
            } else {
                message += "Found with the pokeflute !"
            }
            console.log(message +"\n")
        })

        let pokemonString
        if (countFilePokemon > 1) {
            pokemonString = "pokemons"
        } else {
            pokemonString = "pokemon"
        }

        console.log("\n-- Your pokeball force is : " + pokeballForce)
        console.log("-- Actually there is " + countFilePokemon + " " + pokemonString + " in your filesystem.\n")
    }
}

module.exports = Pokedex