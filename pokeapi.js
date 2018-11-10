const axios = require ('axios')

const pokeUrl = 'https://pokeapi.co/api/v2/pokemon/'
const pokeCriesUrl = 'https://pokemoncries.com/cries/'

class Pokeapi {

    static async getPokemon(idOrName){
        let res = await axios.get(pokeUrl + idOrName)
        return res.data
    }
    static async getPokemonCry(order){
        let res = await axios.get(pokeCriesUrl + order + '.mp3')
        return res.data
    }
}

module.exports = Pokeapi