const inquirer  = require("inquirer")
const pokeapi   = require("./pokeapi")
const asciify   = require("asciify-image")
const sqlite    = require("sqlite")
const config    = require("../config")
const utils     = require("./utils")

const db = sqlite.open("../db/main.db", { Promise })
const positiveAnswers = ["yes", "Y", "y", "yeah", "ye"]

const captureChance = {
    255:1, 235:2, 225:3, 205:4, 200:5,
    190:6, 180:7, 170:8, 155:9, 150:10,
    145:11, 140:12, 130:13, 127:14, 125:15,
    120:16, 100:17, 90:18, 75:19, 70:20,
    65:21, 60:22, 50:23, 45:24, 35:25,
    30:26, 15:27, 5:50, 3:100
}

class Event {

    static async encounter(pokemon, randomEncounter) {

        if (randomEncounter) {
            console.log("A pokemon is coming to you.")
        } else {
            console.log("You approach the noise.")
        }
        try {

            let sprite = await pokeapi.getPokemonSprite(pokemon.id)
            let ascii = await asciify(sprite, config.ascii)
            console.log(ascii)

            await pokeapi.playCry(pokemon.id)

            console.log("A wild " + pokemon.name + " appears !")

            let answer = await inquirer.prompt(
                {
                    type: 'input',
                    message: 'Wanna .catch() it ?',
                    name: 'choice'
                })

            if (positiveAnswers.includes(answer.choice)) {
                await this.catchPokemon(pokemon, randomEncounter)
            } else {
                console.log("You escaped...")
                return
            }
        } catch (err) {
            throw err
        }
    }

    static async catchPokemon(pokemon, randomEncounter){

        let counter = 1
        console.log("You throw a pokeball !")

        await utils.sleep(1500);

        //let ballCoeff = await db.all('SELECT pokeballForce FROM User WHERE id=1')
        //console.log(ballCoeff)
        let ballCoeff = 1

        let chanceToCapture = 1/ballCoeff * captureChance[pokemon.capture_rate]
        let chanceToEscape = 1/chanceToCapture * 100

        if(randomEncounter){
            chanceToEscape = 1/chanceToCapture * 10
        }

        while (utils.getRandomInt(chanceToCapture) !== 1) {
            console.log("You missed !")

            if (utils.getRandomInt(chanceToEscape) === 1) {
                pokemon.isCaptured = false
                console.log("The pokemon escaped...")
                return pokemon
            }

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
        // TODO : spawn a new wave of pokemon
    }

    static spawnPokeballBonus(number){
        // TODO : spawn a pokeball.up with hash in it
    }
}

module.exports = Event