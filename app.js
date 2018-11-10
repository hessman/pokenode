#!/usr/bin/env node

/*
Pokenode-Game
v1.0.0
Little CLI Pokemon game

TODO : SQLITE Database table for user pokedex (name, pokeballs, id)
TODO : SQLITE Database table for pokedex (userId, pokeminId)
TODO : SQLITE Database table Directory (pokemonId, pokemonName, hash, path, status)
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
TODO : Pokeballs mechanics (sprite little box ?)
TODO : Create the cries API
TODO : Team ROCKET ? (random event when catch -> ASCII Team Rocket -> chance to loose pokeball and/or pokemon)
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
TODO : Remake play sound (Promise for fetching mp3)
*/

const program   = require("commander")
const fs        = require("fs")
const event     = require("./event")
const pokeapi   = require("./pokeapi")
const utils     = require("./utils")
const config    = require("./config")

program
    .version('1.0.0')
    .option('-f, --file [name]', 'Path to a wild pokemon')
    .option('-r, --random', 'A random pokemon come to you !')
    // TODO : -l --list -i --inventory
program.parse(process.argv)

if(program.file){
    if (fs.existsSync(program.file)){
        pokeapi.getPokemon(program.file.split('.')[0])
        .then((pokemon) => event.encounter(pokemon))
        .then(() => process.exit())
        .catch(err => {
            console.log(err)
            process.exit()
        })
    } else {
        process.exit()
    }
}

if(program.random){
    pokeapi.getPokemon(utils.getRandomInt(386))
    .then((pokemon) => event.encounter(pokemon))
    .then(() => process.exit())
    .catch(err => {
        console.log(err.message)
        process.exit()
    })
}





