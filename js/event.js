const inquirer  = require("inquirer")
const pokeapi   = require("./pokeapi")
const asciify   = require("asciify-image")
const sqlite    = require("sqlite")
const config    = require("../config")
const utils     = require("./utils")


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
                await utils.playSound(__dirname + "/../assets/sounds/escape2.mp3")
            }
        } catch (err) {
            throw err
        }
    }

    static async catchPokemon(pokemon, randomEncounter){

        // Get the user pokeball force
        const db = await sqlite.open(__dirname + "/../db/main.db")
        let sql = `SELECT pokeballForce FROM Player`;
        let requestResult = await db.all(sql)
        let playerPokeballForce = requestResult[0].pokeballForce
        db.close()

        // Calcul of chances
        let chanceToCapture = 1/playerPokeballForce * captureChance[pokemon.capture_rate]
        let chanceToEscape = 1/chanceToCapture * 100
        console.log("Chance to capture : 1 of " + Math.round(chanceToCapture))

        // If it is a random pokemon it escapes more easily
        if(randomEncounter){
            chanceToEscape = 1/chanceToCapture * 50
        }
        console.log("Risk of escape : 1 of " + Math.round(chanceToEscape))

        // First throwing of pokeball
        console.log("You throw a pokeball !")
        await utils.playSound(__dirname + "/../assets/sounds/throwPokeball.mp3")
        let counter = 1

        // Catching loop
        while (utils.getRandomInt(chanceToCapture) !== 1) {
            await this.catchingAwait(false)

            // Random fail text
            switch (utils.getRandomInt(3)) {
                case 1:
                    console.log("Arg ! Almost had it !")
                    break
                case 2:
                    console.log("Oh no ! The pokemon broke free !")
                    break
                case 3:
                    console.log("Aww ! It appeared to be caught !")
                    break
            }
            await utils.playSound(__dirname + "/../assets/sounds/escapeFromPokeball.mp3")

            // Pokemon escape
            if (utils.getRandomInt(chanceToEscape) === 1) {
                pokemon.isCaptured = false
                console.log("The pokemon escaped...")
                await utils.playSound(__dirname + "/../assets/sounds/escape1.mp3")
                return pokemon
            }

            // AutoThrow Pokeball
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
                    await utils.playSound(__dirname + "/../assets/sounds/escape2.mp3")
                    return pokemon
                }
            } else {
                await utils.sleep(1000)
            }

            // Throwing a pokeball
            counter++
            console.log("You throw a pokeball !")
            await utils.playSound(__dirname + "/../assets/sounds/throwPokeball.mp3")

        }

        // Pokemon captured
        await this.catchingAwait(true)
        pokemon.isCaptured = true
        console.log("Gotcha' " + pokemon.name)
        await utils.playSound(__dirname + "/../assets/sounds/captureSuccess.mp3")
        return pokemon
    }

    static async catchingAwait(captured) {
        return new Promise(async (resolve) => {
            let tics
            if(!captured){
                tics = utils.getRandomInt(3)
            } else {
                tics = 3
            }

            if (tics >= 1) {
                await utils.sleep(500);
                await utils.playSound(__dirname + "/../assets/sounds/pokeballTic.mp3")
                await utils.sleep(500);
            }
            if (tics >= 2) {
                await utils.sleep(500);
                await utils.playSound(__dirname + "/../assets/sounds/pokeballTic.mp3")
                await utils.sleep(500);
            }
            if (tics === 3) {
                await utils.sleep(500);
                await utils.playSound(__dirname + "/../assets/sounds/pokeballTic.mp3")
                await utils.sleep(500);
            }
            if(captured){
                await utils.playSound(__dirname + "/../assets/sounds/capturedTic1.mp3")
            }
            resolve()
        })
    }

    static newWave(number){
        // TODO : spawn a new wave of pokemon
    }

    static spawnPokeballBonus(number){
        // TODO : spawn a pokeball.up with hash in it
    }
}

module.exports = Event