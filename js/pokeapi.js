const utils = require("./utils");
const axios = require ('axios')

const criesUrl  = 'https://pokemoncries.com/cries/'
const pokeUrl   = 'https://pokeapi.co/api/v2/pokemon/'


class Pokeapi {

    static async getPokemon(idOrName) {
        let res = await axios.get(pokeUrl + idOrName)
        return res.data
    }

    static playCry(order) {
        return utils.playSound(criesUrl + order + ".mp3")
    }
}

module.exports = Pokeapi