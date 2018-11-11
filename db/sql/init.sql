CREATE TABLE IF NOT EXISTS Pokedex (
	pokemonId            integer   ,
	userId               integer   ,
	CONSTRAINT Idx_Pokedex_pokemonId UNIQUE ( pokemonId ) ON DELETE CASCADE ,
	CONSTRAINT sqlite_autoindex_Pokedex_1 UNIQUE ( userId ) ON DELETE CASCADE
 );

CREATE TABLE IF NOT EXISTS Pokemons (
	id                   integer NOT NULL  ,
	path                 varchar(255)   ,
	hash                 varchar(255)   ,
	name                 varchar(255)   ,
	status               varchar(255)   ,
	CONSTRAINT Pk_id_id PRIMARY KEY ( id ),
	FOREIGN KEY ( id ) REFERENCES Pokedex( pokemonId )  
 );

CREATE TABLE IF NOT EXISTS Player (
	id                   integer NOT NULL  ,
	pokeballForce        integer   ,
	CONSTRAINT Pk_Users_id PRIMARY KEY ( id ),
	FOREIGN KEY ( id ) REFERENCES Pokedex( userId )  
 );

