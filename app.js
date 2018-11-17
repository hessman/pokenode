#!/usr/bin/env node
(async () => {

/*
Pokenode-Game
v1.0.0-beta
Little CLI Pokemon game
*/

    const GameEvent = require("./js/event")
    const AntiCheat = require("./js/anticheat")
    const Pokerror  = require("./js/pokerror")
    const Database  = require("./js/database")
    const pokeapi   = require("./js/pokeapi")
    const pokedex   = require("./js/pokedex")
    const config    = require("./config")
    const world     = require("./js/world")
    const utils     = require("./js/utils")

    const program   = require("commander")
    const inquirer  = require("inquirer")

    const database = new Database(__dirname + "/db/main.db")

    program
        .version('1.0.0-beta')
        .option('-f, --file [.pok]', 'path to a wild pokemon.')
        .option('-r, --random', 'call a random pokemon !')
        .option('-p, --pokedex [pokemon]', 'show your pokedex !')
        .option('-n, --new', 'spawn a new wave of pokemons.')
        .option('-u, --upgrade [pokeball.up]', 'path to a pokeball\'s up.')
        .option('-R, --remove [.pok]', 'remove a .pok file safely.')
        .option('-I, --initialisation', 'remove the database and create a new one for a new game !')
    program.parse(process.argv)

    const args = [program.file, program.random, program.pokedex, program.new, program.upgrade,
                  program.remove, program.initialisation]

    let count = 0
    args.map( (arg) => {
        if (arg) {
            count ++
        }
    })

    if (count > 1) {
        console.log("You can not use more than one option !")
        process.exit()
    } else if (count === 0) {
        program.pokedex = true
    }

    if (program.file) {

        try {
            const anticheat = new AntiCheat(program.file, "pokemon")
            const analyseResult = await anticheat.analyze()
            let filePath, fileName

            if (!analyseResult || analyseResult === undefined) {
                await anticheat.showTeamRocket()
                process.exit()
            } else {
                filePath = anticheat.filePath
                fileName = anticheat.fileName
            }

            if (utils.getRandomInt(100) === 1) {
                await world.spawnPokeballBonus()
            }

            console.log("You heard a little noise in your filesystem...")

            let promises = []

            promises[0] = utils.playSound(__dirname + "/assets/sounds/bush.mp3")
            promises[1] = pokeapi.getPokemon(fileName)
            promises = await Promise.all(promises)
            let pokemon = promises[1]

            const isAlreadyCaptured = await database.isAlreadyCaptured(pokemon)
            if (isAlreadyCaptured) {
                console.log("This pokemon is already captured... Removing .pok !")
                await world.removePokemon(filePath, false)
                process.exit()
            }

            const event = new GameEvent(pokemon, false)

            pokemon = await event.encounter()
            if (pokemon.isCaptured) {
                await database.addPokedexEntry(pokemon)
                await world.removePokemon(filePath, false)
                process.exit()
            } else if (pokemon.isGone) {
                await world.moveFilePokemon(filePath)
                process.exit()
            }
        } catch (err) {
            throw new Pokerror(err.message, "Main -f")
        }
    }

    if (program.random) {

        try {
            console.log("You play the pokeflute...")

            let randomId = utils.getRandomInt(386)
            const alreadyIn = await database.getIdOfAddedNotCaptured()

            while (alreadyIn.includes(randomId)) {
                randomId = utils.getRandomInt(386)
            }

            let promises = []
            promises.push(utils.playSound(__dirname + "/assets/sounds/pokeflute1.mp3"))
            promises.push(pokeapi.getPokemon(randomId))
            promises = await Promise.all(promises)

            const event = new GameEvent(promises[1], true)

            let pokemon = await event.encounter()
            if (pokemon.isCaptured) {
                await database.addRandomPokemon(pokemon)
                process.exit()
            } else if (pokemon.isGone) {
                process.exit()
            }
        } catch (err) {
            throw new Pokerror(err.message, "Main -r")
        }
    }

    if (program.upgrade) {

        try {
            const anticheat = new AntiCheat(program.upgrade, "pokeball")
            const analyseResult = await anticheat.analyze()
            let filePath

            if (!analyseResult || analyseResult === undefined) {
                await anticheat.showTeamRocket()
                process.exit()
            } else {
                filePath = anticheat.filePath
            }

            console.log("You found a pokeball bonus !")

            let promises = []
            promises.push(database.increasePokeballForce())
            promises.push(world.removePokeballBonus(filePath))
            promises.push(utils.playSound(__dirname + "/assets/sounds/levelUp.mp3"))
            await Promise.all(promises)

            console.log("Your capture rate is now increased !")
            process.exit()
        } catch (err) {
            throw new Pokerror(err.message, "Main -u")
        }
    }

    if (program.remove) {

        try {
            console.log("Removing of the .pok...")
            const anticheat = new AntiCheat(program.remove, "pokemon")
            const analyseResult = await anticheat.analyze()
            let filePath, fileName

            if (!analyseResult) {
                filePath = anticheat.filePath
                await world.removePokemon(filePath, false)
                console.log("Done !")
                process.exit()
            } else if (analyseResult === undefined) {
                await anticheat.showTeamRocket()
                process.exit()
            } else {
                filePath = anticheat.filePath
                fileName = anticheat.fileName
            }

            let pokemon = await pokeapi.getPokemon(fileName)

            const isAlreadyCaptured = await database.isAlreadyCaptured(pokemon)
            if (isAlreadyCaptured) {
                await world.removePokemon(filePath, false)
                console.log("Done !")
                process.exit()
            } else {
                await world.removePokemon(filePath, true)
                console.log("Done !")
                process.exit()
            }
        } catch (err) {
            throw new Pokerror(err.message, "Main -R")
        }
    }

    if (program.initialisation) {

        try {
            let answer = await inquirer.prompt(
                {
                    type: 'input',
                    message: 'It will DELETE ALL DATA OF POKENODE. Are you sure ?',
                    name: 'choice'
                })

            if (config.positiveAnswers.includes(answer.choice)) {

                console.log("Initialisation in progress...")
                await database.initialisation()
                console.log("Done !")

            } else {
                console.log("Exiting...")
                process.exit()
            }
        } catch (err) {
            throw new Pokerror(err.message, "Main -I")
        }
    }

    if (program.pokedex) {

        try {
            await pokedex.show()
        } catch (err) {
            throw new Pokerror(err.message, "Main -p")
        }
    }

    if (program.new) {

        try {
            await world.newWave()
        } catch (err) {
            throw new Pokerror(err.message, "Main -n")
        }
    }

})().catch( (err) => {
    console.log(err.message)
    process.exit()
})






