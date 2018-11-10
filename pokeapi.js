const axios = require ('axios')

const pokeUrl       = 'https://pokeapi.co/api/v2/pokemon/'
const pokeCriesUrl  = 'https://pokemoncries.com/cries/'
const player        = require("play-sound")(opts = {})

class Pokeapi {

    static async getPokemon(idOrName) {
        let res = await axios.get(pokeUrl + idOrName)
        return res.data
    }

    static playCry(order) {
        return new Promise((resolve, reject) => {
            player.play(pokeCriesUrl + order + ".mp3", (err) => {
                if (err) reject(err)
                else resolve()
            })
        })
    }
}

module.exports = Pokeapi