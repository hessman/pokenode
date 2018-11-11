CREATE TABLE IF NOT EXISTS PokedexEntry (
	id									 integer   ,
	pokemonId            integer REFERENCES Pokemons( id ) ON DELETE CASCADE	,
	userId               integer REFERENCES Player( id ) ON DELETE CASCADE		,
	CONSTRAINT pk_pokedex_id PRIMARY KEY ( id )
 );

CREATE TABLE IF NOT EXISTS Pokemons (
	id                   integer NOT NULL  ,
	path                 varchar(255)   ,
	hash                 varchar(255)   ,
	name                 varchar(255)   ,
	status               varchar(255)   ,
	CONSTRAINT Pk_Pokemon_id PRIMARY KEY ( id )
 );

CREATE TABLE IF NOT EXISTS Player (
	id                   integer NOT NULL  ,
	pokeballForce        integer   ,
	CONSTRAINT Pk_Player_id PRIMARY KEY ( id )
 );

