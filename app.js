#!/usr/bin/node

/*
Pokenode
v1.0.0
Little CLI Pokemon game

TODO : SQLITE Database table for user pokedex (name, pokeballs, id)
TODO : SQLITE Database table for pokedex (userId, pokeminId)
TODO : SQLITE Database table Directory (pokemonId, pokemonName, hash, path)
TODO : Pokeballs mechanics
TODO : Create the cries API
TODO : Team ROCKET ? (random event when catch -> ASCII Team Rocket -> chance to loose pokeball and/or pokemon)
*/

const program = require("commander")
const fs = require("fs")
const PokedexPromise = require("pokedex-promise-v2")
const asciify = require("asciify-image")
const inquirer = require("inquirer")
const sqlite = require("sqlite")
const player = require("play-sound")(opts = {})

program
    .version('1.0.0')
    .option('-f, --file [name]', 'Path to a wild pokemon')
    .option('-r, --random', 'A random pokemon come to you !')
program.parse(process.argv)

const Pokedex = new PokedexPromise()

const asciiOptions = {
    fit:    'box',
    width:  100,
    height: 50
}

if(program.file){
    if (fs.existsSync(program.file)){
        encounter(program.file.split('.')[0])
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
    Pokedex.getPokemonByName(getRandomInt(386))
    .then((pokemon) => encounter(pokemon))
    .then(() => process.exit())
    .catch(err => {
        console.log(err.message)
        process.exit()
    })
}

async function encounter(pokemon){
    try {
        let ascii = await asciify(pokemon.sprites.front_default, asciiOptions)
        await playCry(pokemon.order)
        console.log(ascii)
        console.log("A wild " + pokemon.name + " appears !")
        let answer = await inquirer.prompt(
            {
                type: 'input',
                message: 'Wanna .catch() it ?',
                name: 'catchChoice'
            })
        if (answer.catchChoice === "yes") {
            await catchPokemon(pokemon)
        } else {
            console.log("The pokemon escaped...")
            return
        }
        console.log("Gotcha' " + pokemon.name)
    } catch (err) {
        console.log(err.message)
        process.exit()
    }
}

async function catchPokemon(pokemon){
    console.log("You throw a pokeball !")
    await sleep(1500);
    while (getRandomInt(5) === 1) {
        console.log("You missed !")
        await sleep(1000);
        console.log("You throw a pokeball w!")
        await sleep(1500);
    }
    return pokemon
}

function playCry(order) {
    return new Promise((resolve, reject) =>{
        try {
            player.play('https://pokemoncries.com/cries/' + order + '.mp3')
            resolve()
        } catch (err) {
            reject(err)
        }
    })
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max) + 1);
}