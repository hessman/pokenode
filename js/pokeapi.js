const Pokerror = require("./pokerror")
const utils    = require("./utils")
const axios    = require("axios")

const criesUrl  = "https://pokemoncries.com/cries/"
const pokeUrl   = "https://pokeapi.co/api/v2/"

class Pokeapi {
    /*
    Pokeapi class is a wrapper for pokeapi API calls and pokecries.
     */

    static async getCaptureRate(idOrName) {
        /*
        Gets the pokemon capture rate.
        :param idOrName string : The id or the name of the pokemon.
        :return capture_rate integer : The capture rate.
         */

        try {
            let res = await axios.get(pokeUrl + "pokemon-species/" + idOrName)
            return res.data.capture_rate
        } catch (err) {
            throw new Pokerror(err.message, "Pokeapi capture rate")
        }
    }

    static async getPokemon(idOrName) {
        /*
        Gets the pokemon object.
        :param idOrName string : The id or the name of the pokemon.
        :return pokemon Object : The pokemon object.
         */

        try {
            let res = await axios.get(pokeUrl + "pokemon/" + idOrName)
            return res.data
        } catch (err) {
            throw new Pokerror(err.message, "Pokeapi pokemon")
        }
    }

    static async getPokemonInfo(idOrName) {
        /*
        Gets more info for a pokemon.
        :param idOrName string : The id or the name of the pokemon.
        :return pokemonInfo Object : The pokemon info object.
         */

        try {
            let res = await axios.get(pokeUrl + "pokemon-species/" + idOrName)
            return res.data
        } catch (err) {
            throw new Pokerror(err.message, "Pokeapi pokemon info")
        }
    }

    static playCry(id) {
        /*
        Plays the cry of a pokemon.
        :param id integer : The id of the pokemon.
         */

        try {
            return utils.playSound(criesUrl + id + ".mp3")
        } catch (err) {
            throw new Pokerror(err.message, "Pokeapi pokemon cry")
        }
    }
}

module.exports = Pokeapi