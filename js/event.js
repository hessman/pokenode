const inquirer = require("inquirer")
const Pokerror = require("./pokerror")
const Database = require("./database")
const pokeapi  = require("./pokeapi")
const asciify  = require("asciify-image")
const config   = require("../config")
const utils    = require("./utils")

const captureChance = {
    255:1, 235:2, 225:3, 205:4, 200:5,
    190:6, 180:7, 170:8, 155:9, 150:10,
    145:11, 140:12, 130:13, 127:14, 125:15,
    120:16, 100:17, 90:18, 75:19, 70:20,
    65:21, 60:22, 50:23, 45:24, 35:25,
    30:26, 15:27, 5:50, 3:100
}

const database = new Database(__dirname + "/../db/main.db")

class Event {
    /*
    Event class handles the differents player's events of the game.
     */

    constructor(pokemon, isRandom) {
        /*
        Constructor of the Event class.
        :param pokemon Pokemon Object : The pokemon of the event.
        :param isRandom boolean : If it is a random Event or a file Event
         */

        this.pokemon = pokemon
        this.isRandom = isRandom
    }

    async encounter() {
        /*
        Handles the encounter.
        Shows the pokemon and plays its cry.
        Asks if the player want to catch the pokemon.
        :return pokemon Pokemon Object : The pokemon with isCaptured and isGone properties.
         */

        if (this.isRandom) {
            console.log("A pokemon is coming to you.")
        } else {
            console.log("You approach the noise.")
        }

        try {
            const ascii = await asciify(this.pokemon.sprites.front_default, config.ascii)
            console.log(ascii)

            await pokeapi.playCry(this.pokemon.id)
            console.log("A wild " + this.pokemon.name + " appears !")

            let answer = await inquirer.prompt(
                {
                    type: 'input',
                    message: 'Wanna .catch() it ?',
                    name: 'choice'
                })

            if (config.positiveAnswers.includes(answer.choice)) {
                return await this.catchPokemon()
            } else {
                console.log("You escaped...")
                this.pokemon.isGone = true
                await utils.playSound(__dirname + "/../assets/sounds/escape2.mp3")
                return this.pokemon
            }
        } catch (err) {
            throw new Pokerror(err.message + "Event encounter")
        }
    }

    async catchPokemon() {
        /*
        Handles the catching event.
        Calculs the chance to capture and the risk to escape.
        :return pokemon Pokemon Object : The pokemon with isCaptured and isGone properties.
         */

        try {
            // Gets the user pokeball force and the capture rate
            let promises = []
            promises.push(database.getPokeballForce())
            promises.push(pokeapi.getCaptureRate(this.pokemon.id))
            promises = await Promise.all(promises)
            let pokeballForce = promises[0]
            let captureRate = promises[1]

            // Calculs of chances...
            //This is not the official way but it actually works well.
            let chanceToCapture = 1 / pokeballForce * captureChance[captureRate]
            let riskOfEscape = 1 / chanceToCapture * 100
            console.log("Chance to capture : 1 of " + Math.ceil(chanceToCapture))

            // If it is a random pokemon it escapes more easily.
            if (this.isRandom) {
                riskOfEscape = 1 / chanceToCapture * 50
            }
            console.log("Risk of escape : 1 of " + Math.ceil(riskOfEscape))

            // Main loop for catching event.
            let captureDice = 0
            let escapeDice = 0
            let throwCounter = 1
            this.pokemon.isCaptured = false
            this.pokemon.isGone = false

            while (!this.pokemon.isCaptured && !this.pokemon.isGone) {

                console.log("You throw a pokeball !")
                await utils.playSound(__dirname + "/../assets/sounds/throwPokeball.mp3")

                captureDice = utils.getRandomInt(chanceToCapture)
                escapeDice = utils.getRandomInt(riskOfEscape)

                let message
                if (captureDice === 1) {
                    message = await this.catchingAwait(true)
                    console.log(message + this.pokemon.name + "!")
                    this.pokemon.isCaptured = true
                    await utils.playSound(__dirname + "/../assets/sounds/captureSuccess.mp3")
                } else {
                    message = await this.catchingAwait(false)
                    await utils.playSound(__dirname + "/../assets/sounds/escapeFromPokeball.mp3")
                    console.log(message)
                }

                if (escapeDice === 1 && !this.pokemon.isCaptured) {
                    this.pokemon.isGone = true
                    console.log("The pokemon escaped...")
                    await utils.playSound(__dirname + "/../assets/sounds/escape1.mp3")
                }

                // Auto-throws Pokeball
                if (throwCounter === config.autoThrow && !this.pokemon.isCaptured && !this.pokemon.isGone) {
                    throwCounter = 0
                    let answer = await inquirer.prompt(
                        {
                            type: 'input',
                            message: 'Again ?',
                            name: 'choice'
                        })

                    if (!config.positiveAnswers.includes(answer.choice)) {
                        this.pokemon.isGone = true
                        console.log("You escaped...")
                        await utils.playSound(__dirname + "/../assets/sounds/escape2.mp3")
                    }
                } else {
                    await utils.sleep(1000)
                }
                throwCounter++
            }
            return this.pokemon
        } catch (err) {
            throw new Pokerror(err.message, "Event catch")
        }
    }

    async catchingAwait(isCaptured) {
        /*
        Handles the await when a pokeball is thrown.
        :param isCaptured boolean : If the pokemon is going to be captured.
        :return message string : The message to show to the player.
         */

        return new Promise(async (resolve) => {

            let tics
            let message

            if (!isCaptured) {
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
            if (isCaptured) {
                await utils.playSound(__dirname + "/../assets/sounds/capturedTic1.mp3")
                message = "Gotcha' "
            }
            resolve(message)
        })
    }
}

module.exports = Event