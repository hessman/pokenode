const sqlite = require("sqlite")
const utils  = require("./utils")
const SQL    = require("sql-template-strings")

class Database {
    /*
    Database class handles all query from the sqlite database.
     */

    constructor(databasePath){
        this.databasePath = databasePath
    }

    async getPokeballForce() {
        const sql = SQL`SELECT pokeballForce FROM Player WHERE id=1`
        const response = await this.query(sql)
        return response[0].pokeballForce
    }

    async setPokemonCaptured(pokemon){
        const sql = SQL`INSERT INTO PokedexEntry (pokemonId, userId) VALUES (${pokemon.id}, 1)`
        await this.query(sql)
    }

    async getPokedexEntries(){
        const sql = `SELECT * FROM Pokemons WHERE id IN(SELECT pokemonId FROM PokedexEntry WHERE userId=1)`
        return await this.query(sql)
    }

    async addFilePokemon(path, pokemon){
        const hash = await utils.getHash(path)
        const sql = SQL`INSERT INTO Pokemons (id, path, hash, name) VALUES (${pokemon.id}, ${path}, ${hash}, ${pokemon.name})`
        await this.query(sql)
    }

    async addRandomPokemon(pokemon){
        const sql = SQL`INSERT INTO Pokemons (id, name) VALUES (${pokemon.id}, ${pokemon.name})`
        await this.query(sql)
    }

    /*
    async isAlreadyCaptured(pokemon){
        const sql = `SELECT * FROM PokedexEntry WHERE pokemonId=?`
        const response = await this.query(sql, [pokemon.id])
        return response !== [];
    }
    */

    async getIdOfAdded(){
        const sql = `SELECT id FROM Pokemons`
        const response = await this.query(sql)
        let ids = []
        response.map((object) => {
            ids.push(object.id)
        })
        return ids
    }

    async countFilePokemon(){
        const sql = SQL`SELECT * FROM Pokemons WHERE id NOT IN(SELECT pokemonId FROM PokedexEntry WHERE userId = 1) AND path IS NOT NULL`
        const response = await this.query(sql)
        return response.length
    }

    async query(sql){
        const db = await sqlite.open(this.databasePath)
        const response = await db.all(sql)
        db.close()
        return response
    }

}

module.exports = Database
