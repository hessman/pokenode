#!/usr/bin/env node
(async () => {
/*
Pokenode-Game
v1.0.1
Little CLI Pokemon game

TODO : Populate and moving of files
TODO : Sound rocket
TODO : Better error handling
*/
    const GameEvent = require("./js/event")
    const Database  = require("./js/database")
    const pokeapi   = require("./js/pokeapi")
    const pokedex   = require("./js/pokedex")
    const program   = require("commander")
    const asciify   = require("asciify-image")
    const config    = require("./config")
    const utils     = require("./js/utils")
    const path      = require("path")
    const fs        = require("fs")

    const database = new Database(__dirname + "/db/main.db")

    try {
        program
            .version('1.0.1')
            .option('-f, --file [name]', 'Path to a wild pokemon...')
            .option('-r, --random', 'A random pokemon come to you !')
            .option('-l, --list', 'Shows your pokedex !')
        program.parse(process.argv)

        if (program.file) {

            if (fs.existsSync(program.file)) { // TODO : cheat's condition

                console.log("You heard a little noise in your filesystem...")

                let promises = []
                let filename = path.basename(program.file)
                promises[0] = utils.playSound(__dirname + "/assets/sounds/bush.mp3")
                promises[1] = pokeapi.getPokemon(filename.split('.')[0])
                promises = await Promise.all(promises)
                const event = new GameEvent(promises[1], false)

                let pokemon = await event.encounter()
                if (pokemon.isCaptured) {
                    process.exit()
                } else if (pokemon.isGone) {
                    process.exit()
                }

            } else {
                let ascii = await asciify(__dirname + "/assets/images/teamrocket.png", config.ascii)
                console.log(ascii)
                console.log("You piece of cheat !")
                console.log("This .pok is not a valid pokemon...")
                await utils.playSound(__dirname + "/assets/sounds/rocket.mp3")
                process.exit()
            }
        }

        if (program.random) {

            console.log("You play the pokeflute...")

            let randomId = utils.getRandomInt(386)
            const alreadyCapturedId = await database.getIdOfAdded()

            while (alreadyCapturedId.includes(randomId)) {
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
                await database.setPokemonCaptured(pokemon)
                process.exit()
            } else if (pokemon.isGone) {
                process.exit()
            }
        }

        if (program.list) {
            await pokedex.show()
        }

    } catch (error) {
        console.log(error.message)
        process.exit()
    }
})()






