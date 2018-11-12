const inquirer  = require("inquirer")
const pokeapi   = require("./pokeapi")
const asciify   = require("asciify-image")
const sqlite    = require("sqlite")
const config    = require("../config")
const utils     = require("./utils")


const positiveAnswers = ["yes", "Y", "y", "yeah", "ye", "yep"]

const captureChance = {
    255:1, 235:2, 225:3, 205:4, 200:5,
    190:6, 180:7, 170:8, 155:9, 150:10,
    145:11, 140:12, 130:13, 127:14, 125:15,
    120:16, 100:17, 90:18, 75:19, 70:20,
    65:21, 60:22, 50:23, 45:24, 35:25,
    30:26, 15:27, 5:50, 3:100
}

class Event {
    /*
    Event class handles the differents player's events of the game.
     */

    static async encounter(pokemon, randomEncounter) {
        /*
        Handles the encounter.
        Shows the pokemon and plays its cry.
        Asks if the player want to catch the pokemon.
        :param pokemon Pokemon Object  : The pokemon to catch.
        :param randomEncounter boolean : If it is a random encounter.
         */

        if (randomEncounter) {
            console.log("A pokemon is coming to you.")
        } else {
            console.log("You approach the noise.")
        }

        try {
            const ascii = await asciify(pokemon.sprites.front_default, config.ascii)
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
                await utils.playSound(__dirname + "/../assets/sounds/escape2.mp3")
            }
        } catch (err) {
            throw err
        }
    }

    static async catchPokemon(pokemon, randomEncounter){
        /*
        Handles the catching event.
        Calculs the chance to capture and the risk to escape.
        :param pokemon Pokemon Object  : The pokemon to catch.
        :param randomEncounter boolean : If it is a random encounter.
        :return pokemon Pokemon Object : The pokemon with isCaptured and isGone properties.
         */

        // Gets the user pokeball force and the capture rate
        const db = await sqlite.open(__dirname + "/../db/main.db")
        let sql = `SELECT pokeballForce FROM Player WHERE id=1`;
        let promises = []
        promises.push(db.all(sql))
        promises.push(pokeapi.getCaptureRate(pokemon.id))
        promises = await Promise.all(promises)
        let pokeballForce = promises[0][0].pokeballForce
        let captureRate = promises[1]
        db.close()

        // Calculs of chances
        //This is not the official way but it actually works well.
        let chanceToCapture = 1/pokeballForce * captureChance[captureRate]
        let riskOfEscape = 1/chanceToCapture * 100
        console.log("Chance to capture : 1 of " + Math.ceil(chanceToCapture))

        // If it is a random pokemon it escapes more easily.
        if(randomEncounter){
            riskOfEscape = 1/chanceToCapture * 50
        }
        console.log("Risk of escape : 1 of " + Math.ceil(riskOfEscape))

        // Main loop for catching event.
        let captureDice = 0
        let escapeDice = 0
        let throwCounter = 1
        pokemon.isCaptured = false
        pokemon.isGone = false

        while (!pokemon.isCaptured && !pokemon.isGone) {

            console.log("You throw a pokeball !")
            await utils.playSound(__dirname + "/../assets/sounds/throwPokeball.mp3")

            captureDice = utils.getRandomInt(chanceToCapture)
            escapeDice = utils.getRandomInt(riskOfEscape)

            let message
            if (captureDice === 1) {
                message = await this.catchingAwait(true)
                console.log(message + pokemon.name + "!")
                pokemon.isCaptured = true
                await utils.playSound(__dirname + "/../assets/sounds/captureSuccess.mp3")
            } else {
                message = await this.catchingAwait(false)
                await utils.playSound(__dirname + "/../assets/sounds/escapeFromPokeball.mp3")
                console.log(message)
            }

            if (riskOfEscape === 1) {
                pokemon.isGone = true
                console.log("The pokemon escaped...")
                await utils.playSound(__dirname + "/../assets/sounds/escape1.mp3")
            }

            // Auto-throws Pokeball
            if (throwCounter === config.autoThrow) {
                throwCounter = 0
                let answer = await inquirer.prompt(
                    {
                        type: 'input',
                        message: 'Again ?',
                        name: 'choice'
                    })

                if (!positiveAnswers.includes(answer.choice)) {
                    pokemon.isGone = true
                    console.log("You escaped...")
                    await utils.playSound(__dirname + "/../assets/sounds/escape2.mp3")
                }
            } else {
                await utils.sleep(1000)
            }
            throwCounter++
        }
        return pokemon
    }

    static async catchingAwait(isCaptured) {
        /*
        Handles the await when a pokeball is thrown.
        :param isCaptured boolean : If the pokemon is going to be captured.
        :return message string : The message to show to the player.
         */
        return new Promise(async (resolve) => {

            let tics
            let message

            if(!isCaptured){
                tics = utils.getRandomInt(3)
            } else {
                tics = 3
            }

            if (tics >= 1) {
                await utils.sleep(500)
                await utils.playSound(__dirname + "/../assets/sounds/pokeballTic.mp3")
                await utils.sleep(500)
                message = "Arg ! Almost had it !"
            }
            if (tics >= 2) {
                await utils.sleep(500)
                await utils.playSound(__dirname + "/../assets/sounds/pokeballTic.mp3")
                await utils.sleep(500)
                message = "Oh no ! The pokemon broke free !"
            }
            if (tics === 3) {
                await utils.sleep(500)
                await utils.playSound(__dirname + "/../assets/sounds/pokeballTic.mp3")
                await utils.sleep(500)
                message = "Aww ! It appeared to be caught !"
            }
            if(isCaptured){
                await utils.playSound(__dirname + "/../assets/sounds/capturedTic1.mp3")
                message = "Gotcha' "
            }
            resolve(message)
        })
    }
}

module.exports = Event