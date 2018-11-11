#!/usr/bin/env node

/*
Pokenode-Game
v1.0.1
Little CLI Pokemon game

TODO : SQLITE DB Calls
TODO : Difficulty for capture
TODO : Pokeballs mechanics (with sounds)
TODO : Team ROCKET ? (random event when catch -> ASCII Team Rocket -> chance to loose pokeball and/or pokemon)
*/

const gameEvent = require("./js/event")
const pokeapi   = require("./js/pokeapi")
const program   = require("commander")
const config    = require("./config")
const utils     = require("./js/utils")
const fs        = require("fs")


program
    .version('1.0.1')
    .option('-f, --file [name]', 'Path to a wild pokemon')
    .option('-r, --random', 'A random pokemon come to you !')
    // TODO : -l --list -i --inventory
program.parse(process.argv)

if (program.file) {

    if (fs.existsSync(program.file)) {

        pokeapi.getPokemon(program.file.split('.')[0]) // TODO : Full path handling
        .then((pokemon) => gameEvent.encounter(pokemon))
        .then(() => process.exit())
        .catch(err => {
            console.log(err)
            process.exit()
        })

    } else {
        process.exit()
    }
}

if (program.random) {

    pokeapi.getPokemon(utils.getRandomInt(386))
    .then((pokemon) => gameEvent.encounter(pokemon))
    .then(() => process.exit())
    .catch(err => {
        console.log(err.message)
        process.exit()
    })
}





