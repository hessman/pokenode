CREATE TABLE IF NOT EXISTS PokedexEntry (
	pokemonId            integer REFERENCES Pokemons( id ) ON DELETE CASCADE	,
	userId               integer REFERENCES Player( id ) ON DELETE CASCADE
 );

CREATE TABLE IF NOT EXISTS Pokemons (
	id                   integer NOT NULL  ,
	path                 varchar(255)   ,
	hash                 varchar(255)   ,
	name                 varchar(255) NOT NULL ,
	CONSTRAINT Pk_Pokemon_id PRIMARY KEY ( id )
 );

CREATE TABLE IF NOT EXISTS Player (
	id                   integer NOT NULL  ,
	pokeballForce        integer NOT NULL  ,
	CONSTRAINT Pk_Player_id PRIMARY KEY ( id )
 );

CREATE TABLE IF NOT EXISTS Pokeballs (
	hash								 varchar(255) NOT NULL,
	path 								 varchar(255) NOT NULL
);

INSERT INTO Player(id, pokeballForce)
VALUES(1, 3);