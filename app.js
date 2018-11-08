#!/usr/bin/node

const program = require("commander")
const fs = require("fs")
const PokedexPromise = require("pokedex-promise-v2")
const asciify = require("asciify-image")
const inquirer = require("inquirer")
const sqlite = require("sqlite")

program
    .version('1.0.0')
    .option('-p, --pokemon [name]', 'Path to a wild pokemon')
program.parse(process.argv)

const Pokedex = new PokedexPromise()

const asciiOptions = {
    fit:    'box',
    width:  100,
    height: 50
}

if(program.pokemon){
    if (fs.existsSync(program.pokemon)){
        encounter(program.pokemon.split('.')[0])
            .then(() => process.exit())
            .catch(() => {
                console.log("Invalid pokemon")
                process.exit()
            })
    }
}

function encounter(pokemon){
    return new Promise((resolve, reject) => {
        Pokedex.getPokemonByName(pokemon).then(pokemon => {
            return asciify(pokemon.sprites.front_default, asciiOptions)
        })
        .then(ascii => {
            console.log(ascii)
            console.log("A wild " + pokemon + " appears !")
            return inquirer.prompt({
                type: 'input',
                message: 'Wanna .catch() it ?',
                name: 'catchChoice'
            })
        })
        .then(answer => {
            if (answer.catchChoice === "yes") {
                return catchPokemon(pokemon)
            } else {
                console.log("The pokemon escaped...")
                resolve()
            }
        })
        .then(pokemon => {
            // TODO : SQL gotcha
            console.log("Gotcha' " + pokemon)
        })
        .catch(err => reject(err))
    })
}



function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max) + 1);
}

function catchPokemon(pokemon){
    return new Promise((resolve, reject) => {
        // TODO : SQL minus pokeball
        console.log("You throw a pokeball !")
        if (getRandomInt(5) === 1){
            console.log("You missed !")
            setTimeout(catchPokemon, 1000)
        } else {
            resolve(pokemon)
        }
    })
}