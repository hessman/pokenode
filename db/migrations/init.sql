CREATE TABLE Pokedex ( 
	pokemonId            integer   ,
	userId               integer   ,
	CONSTRAINT Idx_Pokedex_pokemonId UNIQUE ( pokemonId ) ,
	CONSTRAINT Unq_Pokedex_userId UNIQUE ( userId ) 
 );

CREATE TABLE Pokemons ( 
	id                   integer NOT NULL  ,
	path                 varchar(255)   ,
	hash                 varchar(255)   ,
	name                 varchar(255)   ,
	status               varchar(255)   ,
	CONSTRAINT Pk_id_id PRIMARY KEY ( id ),
	FOREIGN KEY ( id ) REFERENCES Pokedex( pokemonId )  
 );

CREATE TABLE Users ( 
	id                   integer NOT NULL  ,
	name                 varchar(255)   ,
	pokeballs            integer   ,
	CONSTRAINT Pk_Users_id PRIMARY KEY ( id ),
	FOREIGN KEY ( id ) REFERENCES Pokedex( userId )  
 );

