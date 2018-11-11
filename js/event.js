const inquirer  = require("inquirer")
const pokeapi   = require("./pokeapi")
const asciify   = require("asciify-image")
const config    = require("../config")
const utils     = require("./utils")

class Event {

    static async encounter(pokemon) {

        try {
            let ascii = await asciify(pokemon.sprites.front_default, config.ascii)
            console.log(ascii)
            await pokeapi.playCry(pokemon.order)
            console.log("A wild " + pokemon.name + " appears !")

            let answer = await inquirer.prompt(
                {
                    type: 'input',
                    message: 'Wanna .catch() it ?',
                    name: 'catchChoice'
                })

            const positiveAnswers = ["yes", "Y", "y", "yeah"]
            if (positiveAnswers.includes(answer.catchChoice)) {
                await this.catchPokemon(pokemon)
            } else {
                console.log("You escaped...")
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

    static newWave(number){

    }

    static spawnPokeballs(number){

    }
}

module.exports = Event