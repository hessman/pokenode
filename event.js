const inquirer  = require("inquirer")
const pokeapi   = require("./pokeapi")
const asciify   = require("asciify-image")
const config    = require("./config")
const player    = require("play-sound")(opts = {})
const utils     = require("./utils")

class Event {
    static async encounter(pokemon){
        try {

            let ascii = await asciify(pokemon.sprites.front_default, config.ascii)
            console.log(ascii)
            await this.playCry(pokemon.order)
            console.log("A wild " + pokemon.name + " appears !")

            let answer = await inquirer.prompt(
                {
                    type: 'input',
                    message: 'Wanna .catch() it ?',
                    name: 'catchChoice'
                })
            if (answer.catchChoice === "yes") {
                await this.catchPokemon(pokemon)
            } else {
                console.log("The pokemon escaped...")
                return
            }
            console.log("Gotcha' " + pokemon.name)
        } catch (err) {
            throw err
        }
    }

    static async catchPokemon(pokemon){
        console.log("You throw a pokeball !")
        await utils.sleep(1500);
        while (utils.getRandomInt(5) === 1) {
            console.log("You missed !")
            await utils.sleep(1000);
            console.log("You throw a pokeball !")
            await utils.sleep(1500);
        }
        return pokemon
    }

    static playCry(order) {
        pokeapi.getPokemonCry(order)
        .then((cry) => {
            return new Promise((resolve, reject) => {
                player.play(cry, (err) => {
                    if (err) reject(err)
                    else resolve()
                })
            })
        })
        .catch((err) => console.log(err))
    }
}

module.exports = Event