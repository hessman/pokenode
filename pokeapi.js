const axios = require ('axios')

const pokeUrl       = 'https://pokeapi.co/api/v2/pokemon/'
const pokeCriesUrl  = 'https://pokemoncries.com/cries/'
const player        = require("./fixed_modules/play-sound/index")(opts = {})

class Pokeapi {

    static async getPokemon(idOrName) {
        let res = await axios.get(pokeUrl + idOrName)
        return res.data
    }

    static playCry(order) {
        return new Promise((resolve, reject) => {
            player.play(pokeCriesUrl + order + ".mp3", (err) => {
                if (err) {
                    if (err.status === 1){
                        console.log("No working CLI audio player founded : sound disabled")
                        resolve()
                    }
                    reject(err)
                }
                else resolve()
            })
        })
    }
}

module.exports = Pokeapi