#!/usr/bin/env node

/*
Pokenode-Game
v1.0.1
Little CLI Pokemon game

TODO : SQLITE DB Calls
TODO : Bush sound
TODO : Populate and moving of files
TODO : -l --list
TODO : Capture rate ?
*/

const gameEvent = require("./js/event")
const pokeapi   = require("./js/pokeapi")
const program   = require("commander")
const utils     = require("./js/utils")
const path      = require("path")
const fs        = require("fs")


program
    .version('1.0.1')
    .option('-f, --file [name]', 'Path to a wild pokemon')
    .option('-r, --random', 'A random pokemon come to you !')
program.parse(process.argv)

if (program.file) {

    if (fs.existsSync(program.file)) {
        let filename = path.basename(program.file)
        console.log("You heard a little noise in your filesystem...")
        utils.playSound(__dirname + "/assets/sounds/pokeflute2.mp3")
        .then(() => pokeapi.getPokemon(filename.split('.')[0]))
        .then((pokemon) => gameEvent.encounter(pokemon, false))
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
    console.log("You play the pokeflute...")
    utils.playSound(__dirname + "/assets/sounds/pokeflute1.mp3")
    .then(() => pokeapi.getPokemon(utils.getRandomInt(386)))
    .then((pokemon) => gameEvent.encounter(pokemon, true))
    .then(() => process.exit())
    .catch(err => {
        console.log(err.message)
        process.exit()
    })
}





