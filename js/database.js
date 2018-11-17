const Pokerror = require("./pokerror")
const sqlite3  = require('sqlite3')
const sqlite   = require("sqlite")
const init     = require("../db/sql/init")
const SQL      = require("sql-template-strings")
const fs       = require("fs")

class Database {
    /*
    Database class handles all query from the sqlite database.
     */

    constructor(databasePath) {
        /*
        :param databasePath string : The path to the database.
         */

        this.databasePath = databasePath
    }

    async initialisation() {
        /*
        Removes the database and create a new one with defaut schema of the game.
         */

        try {
            if (fs.existsSync(this.databasePath)) {
                fs.unlinkSync(this.databasePath)
            }
            await new sqlite3.Database(this.databasePath)
            for (let query of init) {
                await this.query(query)
            }
        } catch (err) {
            throw new Pokerror(err.message, "Database initialisation")
        }
    }

    async getPokeballForce() {
        const sql = SQL`SELECT pokeballForce FROM Player WHERE id = 1`
        const response = await this.query(sql)
        return response[0].pokeballForce
    }

    async getPokedexEntries() {
        const sql = `SELECT * FROM Pokemons WHERE id IN(SELECT pokemonId FROM PokedexEntry WHERE userId = 1)`
        return await this.query(sql)
    }

    async getIdOfAddedNotCaptured() {
        const sql = SQL`SELECT id FROM Pokemons WHERE id NOT IN(SELECT pokemonId FROM PokedexEntry WHERE userId = 1) AND path IS NOT NULL`
        const response = await this.query(sql)
        let ids = []
        response.map((object) => {
            ids.push(object.id)
        })
        return ids
    }

    async getPokemon(path) {
        const sql = SQL`SELECT * FROM Pokemons WHERE path = ${path}`
        let response = await this.query(sql)
        if (response.length === 0) {
            return false
        } else {
            return { hash:response[0].hash, name:response[0].name }
        }
    }

    async getPokeballHash(path) {
        const sql = SQL`SELECT hash FROM Pokeballs WHERE path = ${path}`
        let response = await this.query(sql)
        if (response.length === 0) {
            return false
        } else {
            return response[0].hash
        }
    }

    async getIdOfAdded() {
        const sql = `SELECT id FROM Pokemons`
        const response = await this.query(sql)
        let ids = []
        response.map( (object) => {
            ids.push(object.id)
        })
        return ids
    }

    async addPokedexEntry(pokemon) {
        const sql = SQL`INSERT INTO PokedexEntry (pokemonId, userId) VALUES (${pokemon.id}, 1)`
        await this.query(sql)
    }

    async addFilePokemon(path, hash, pokemon) {
        const sql = SQL`INSERT INTO Pokemons (id, path, hash, name) VALUES (${pokemon.id}, ${path}, ${hash}, ${pokemon.name})`
        await this.query(sql)
    }

    async addFilePokeball(path, hash) {
        const sql = SQL`INSERT INTO Pokeballs (path, hash) VALUES (${path}, ${hash})`
        await this.query(sql)
    }

    async addRandomPokemon(pokemon) {
        let sql
        let alreadyAdded = await this.isAlreadyAdded(pokemon)
        if (alreadyAdded) {
            sql = SQL`UPDATE Pokemons SET path = NULL, hash = NULL WHERE id = ${pokemon.id}`
        } else {
            sql = SQL`INSERT INTO Pokemons (id, name) VALUES (${pokemon.id}, ${pokemon.name})`
        }
        await this.query(sql)
        await this.addPokedexEntry(pokemon)
    }

    async updateFilePokemonPath(oldPath, newPath) {
        const sql = SQL`UPDATE Pokemons SET path = ${newPath} WHERE path = ${oldPath}`
        await this.query(sql)
    }

    async increasePokeballForce() {
        let oldForce = await this.getPokeballForce()
        let newForce = oldForce + 1
        const sql = SQL`UPDATE Player SET pokeballForce = ${newForce} WHERE id = 1`
        await this.query(sql)
    }

    async isAlreadyCaptured(pokemon) {
        const sql = SQL`SELECT * FROM PokedexEntry WHERE pokemonId = ${pokemon.id}`
        const response = await this.query(sql)
        return !!response[0];
    }

    async isAlreadyAdded(pokemon) {
        const sql = SQL`SELECT * FROM Pokemons WHERE id = ${pokemon.id}`
        const response = await this.query(sql)
        return !!response[0];
    }

    async countFilePokemon() {
        const sql = SQL`SELECT * FROM Pokemons WHERE id NOT IN(SELECT pokemonId FROM PokedexEntry WHERE userId = 1) AND path IS NOT NULL`
        const response = await this.query(sql)
        return response.length
    }

    async removePokeballBonus(path) {
        const sql = SQL`DELETE FROM Pokeballs WHERE path = ${path}`
        await this.query(sql)
    }

    async removePokemon(path) {
        const sql = SQL`DELETE FROM Pokemons WHERE path = ${path}`
        await this.query(sql)
    }

    async query(sql) {
        try {
            const db = await sqlite.open(this.databasePath)
            const response = await db.all(sql)
            await db.close()
            return response
        } catch (err) {
            throw new Pokerror(err.message, "Database query")
        }
    }

}

module.exports = Database
