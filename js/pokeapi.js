const utils = require("./utils")
const axios = require ('axios')

const criesUrl  = 'https://pokemoncries.com/cries/'
const pokeUrl   = 'https://pokeapi.co/api/v2/'

class Pokeapi {

    static async getPokemon(idOrName) {
        let res = await axios.get(pokeUrl + "pokemon-species/" + idOrName)
        return res.data
    }

    static async getPokemonSprite(idOrName) {
        let res = await axios.get(pokeUrl + "pokemon/" + idOrName)
        return res.data.sprites.front_default
    }

    static playCry(order) {
        return utils.playSound(criesUrl + order + ".mp3")
    }
}

module.exports = Pokeapi