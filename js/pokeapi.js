const utils = require("./utils")
const axios = require("axios")

const criesUrl  = "https://pokemoncries.com/cries/"
const pokeUrl   = "https://pokeapi.co/api/v2/"

class Pokeapi {
    /*
    Pokeapi class is a wrapper for pokeapi API calls and pokecries.
     */

    static async getCaptureRate(idOrName) {
        let res = await axios.get(pokeUrl + "pokemon-species/" + idOrName)
        return res.data.capture_rate
    }

    static async getPokemon(idOrName) {
        let res = await axios.get(pokeUrl + "pokemon/" + idOrName)
        return res.data
    }

    static async getPokemonInfo(idOrName) {
        let res = await axios.get(pokeUrl + "pokemon-species/" + idOrName)
        return res.data
    }

    static playCry(order) {
        return utils.playSound(criesUrl + order + ".mp3")
    }
}

module.exports = Pokeapi