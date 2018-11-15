const Database  = require("./database")
const inquirer  = require("inquirer")
const pokeapi   = require("./pokeapi")
const asciify   = require("asciify-image")
const config    = require("../config")
const utils     = require("./utils")

const database = new Database(__dirname + "/../db/main.db")

class Pokedex {
    /*
    Pokedex class handles the pokedex mechanics.
     */

    static async show() {
        /*
        Shows the full pokedex and information about the player.
         */

        let promises = []
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
        await utils.playSound(__dirname + "/../assets/sounds/pokedex.mp3")
        console.log("\n******POKEDEX******")

        console.log("\n--CAPTURED (" + entries.length + "/386):\n")

        let entriesId = []

        entries.map((entry) => {
            let message= "ID : " + entry.id
            entriesId.push(entry.id)
            message = message.padEnd(9) + " | "
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

        let answer = {choice:""}
        while (answer.choice !== "q") {

            answer = await inquirer.prompt(
                {
                    type: 'input',
                    message: 'q for quit, enter the id of a captured pokemon to show its entry :',
                    name: 'choice'
                })

            if (entriesId.includes(parseInt(answer.choice))) {

                let promises = []
                promises.push(pokeapi.getPokemon(answer.choice))
                promises.push(pokeapi.getPokemonInfo(answer.choice))
                promises.push(pokeapi.playCry(answer.choice))
                promises = await Promise.all(promises)

                const pokemon = promises[0]
                const info = promises[1]
                let ascii = await asciify(pokemon.sprites.front_default, config.ascii)

                const name = pokemon.name.charAt(0).toUpperCase() + pokemon.name.substring(1)
                console.log("\nPokemon n°" + pokemon.id + "  " + name)

                let story = ""
                info.flavor_text_entries.map((entry) => {
                    if (entry.language.name === "en") {
                        story = JSON.stringify( entry.flavor_text )
                        story = story.replace(/\\n/g, " ")
                        story = story.replace(/\\f/g, " ")
                        story = story.replace(/­\s/g, "")
                        return
                    }
                })

                console.log("\n" + story)
                console.log(ascii)
            }
        }
    }
}

module.exports = Pokedex