const inquirer  = require("inquirer")
const pokeapi   = require("./pokeapi")
const asciify   = require("asciify-image")
const config    = require("../config")
const utils     = require("./utils")

const positiveAnswers = ["yes", "Y", "y", "yeah"]

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
                    name: 'choice'
                })

            if (positiveAnswers.includes(answer.choice)) {
                await this.catchPokemon(pokemon)
            } else {
                console.log("You escaped...")
                return
            }
        } catch (err) {
            throw err
        }
    }

    static async catchPokemon(pokemon){
        let counter = 1
        console.log("You throw a pokeball !")
        await utils.sleep(1500);

        while (utils.getRandomInt(5) === 1) {
            console.log("You missed !")

            if (counter === config.autoThrow) {
                counter = 0
                let answer = await inquirer.prompt(
                    {
                        type: 'input',
                        message: 'Again ?',
                        name: 'choice'
                    })
                if (!positiveAnswers.includes(answer.choice)) {
                    pokemon.isCaptured = false
                    console.log("You escaped...")
                    return pokemon
                }

            } else {
                await utils.sleep(1000);
            }

            counter++
            console.log("You throw a pokeball !")
            await utils.sleep(1500);
        }
        pokemon.isCaptured = true
        console.log("Gotcha' " + pokemon.name)
        return pokemon
    }

    static newWave(number){

    }

    static spawnPokeballs(number){

    }
}

module.exports = Event