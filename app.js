#!/usr/bin/env node
(async () => {
/*
Pokenode-Game
v1.0.2
Little CLI Pokemon game

TODO : moving of files
TODO : only one arg check
TODO : reinit database (-I) with are you sure ?
TODO : Better error handling (try catch everywhere with custom error class)
TODO : comment
*/
    const GameEvent = require("./js/event")
    const Database  = require("./js/database")
    const pokeapi   = require("./js/pokeapi")
    const pokedex   = require("./js/pokedex")
    const program   = require("commander")
    const world     = require("./js/world")
    const utils     = require("./js/utils")
    const path      = require("path")
    const fs        = require("fs")

    const database = new Database(__dirname + "/db/main.db")

    try {
        program
            .version('1.0.2')
            .option('-f, --file [.pok]', 'path to a wild pokemon...')
            .option('-r, --random', 'a random pokemon come to you !')
            .option('-l, --list [pokemon]', 'shows your pokedex !')
            .option('-n, --new', 'spawns a new wave of pokemons.')
            .option('-u, --upgrade [pokeball.up]', 'path to a pokeball\'s up.')
            .option('-R, --remove [.pok]', 'remove a .pok file safely.')
        program.parse(process.argv)

        if (program.file) {

            if (fs.existsSync(program.file)) {

                const filePath = path.resolve(program.file)
                const fileHash = fs.readFileSync(program.file, 'utf8')
                const fileName = path.basename(program.file).split('.')[0]

                const databasePokemon = await database.getPokemon(filePath)

                if ( !databasePokemon || (databasePokemon.hash !== fileHash && databasePokemon.name !== fileName) ) {
                    await utils.showTeamRocket(true)
                    process.exit()
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

                if (await database.isAlreadyCaptured(pokemon)) {
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
            } else {
                await utils.showTeamRocket(true)
                process.exit()
            }
        }

        if (program.random) {

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
        }

        if (program.upgrade) {

            if (fs.existsSync(program.upgrade)) {

                const filePath = path.resolve(program.upgrade)
                const fileHash = fs.readFileSync(program.upgrade, 'utf8')
                const databaseHash = await database.getPokeballHash(filePath)

                if (!databaseHash || databaseHash !== fileHash) {
                    await utils.showTeamRocket(false)
                    process.exit()
                }

                console.log("You found a pokeball bonus !")
                await database.increasePokeballForce()
                await world.removePokeballBonus(filePath)
                //TODO : sound
                console.log("Your capture rate is now increased !")
                process.exit()
            } else {
                await utils.showTeamRocket(false)
                process.exit()
            }
        }

        if (program.remove) {

            if (fs.existsSync(program.remove)) {

                console.log("Removing of the .pok...")

                const filePath = path.resolve(program.remove)
                const fileHash = fs.readFileSync(program.remove, 'utf8')
                const fileName = path.basename(program.remove).split('.')[0]

                const databasePokemon = await database.getPokemon(filePath)

                if ( !databasePokemon || (databasePokemon.hash !== fileHash && databasePokemon.name !== fileName) ) {
                    await world.removePokemon(filePath, false)
                    console.log("Done !")
                    process.exit()
                }

                let pokemon = await pokeapi.getPokemon(fileName)

                if (await database.isAlreadyCaptured(pokemon)) {
                    await world.removePokemon(filePath, false)
                    console.log("Done !")
                    process.exit()
                } else {
                    await world.removePokemon(filePath, true)
                    console.log("Done !")
                    process.exit()
                }

            } else {
                await utils.showTeamRocket(true)
                process.exit()
            }
        }

        if (program.list) {
            await pokedex.show()
        }

        if (program.new) {
            await world.newWave()
        }

    } catch (error) {
        console.log(error.message)
        process.exit()
    }
})()






