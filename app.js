#!/usr/bin/env node
(async () => {
/*
Pokenode-Game
v1.0.1
Little CLI Pokemon game

TODO : moving of files
TODO : remove  ( -R )
TODO : Better error handling
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

                const fileHash = fs.readFileSync(program.file, 'utf8')
                const databaseHash = await database.getPokemonHash(path.resolve(program.file))

                if (!databaseHash || databaseHash !== fileHash) {
                    await utils.showTeamRocket(true)
                }

                if (utils.getRandomInt(100) === 1) {
                    await world.spawnPokeballBonus()
                }

                /*
                if ( pokemon already captured ) {
                    delete file
                }
                 */

                console.log("You heard a little noise in your filesystem...")

                let promises = []
                const filename = path.basename(program.file)
                promises[0] = utils.playSound(__dirname + "/assets/sounds/bush.mp3")
                promises[1] = pokeapi.getPokemon(filename.split('.')[0])
                promises = await Promise.all(promises)
                const event = new GameEvent(promises[1], false)

                let pokemon = await event.encounter()

                if (pokemon.isCaptured) {
                    // TODO : database pokemon captured
                    fs.unlinkSync(program.file)
                    process.exit()
                } else if (pokemon.isGone) {
                    await world.moveFilePokemon()
                    process.exit()
                }
            } else {
                await utils.showTeamRocket(true)
            }
        }

        if (program.random) {

            console.log("You play the pokeflute...")

            let randomId = utils.getRandomInt(386)
            const alreadyIn = await database.getIdOfAdded()

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
                await database.setPokemonCaptured(pokemon)
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
                }

                await database.increasePokeballForce()
                await database.removePokeballBonus(filePath)
                process.exit()
            } else {
                await utils.showTeamRocket(false)
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






