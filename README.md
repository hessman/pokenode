# PokeNode

Simple NodeJS CLI game.

**Explore your filesystem for pokemons and add them to your Pokedex !**

![pokenode](https://i.imgur.com/9WIy8YP.png)


## How to play ?

The game will pop some pokemons _(ex: charmander.pok)_ in the directories (and their subdirectories) defined in the config.json file. 

* You must locate them and use the command `pokenode -f charmander.pok` to try to *.catch()* it. 

**If the pokemon escaped the .pok file will move !**


You can catch a pokemon by throwing... _pokeballs_ but it will be difficult at the beginning. In fact few _pokeball.up_ files will pop during the game. It will increase the capture rate of your pokeballs and your chase will be easier.

* You must locate them and use `pokenode -u pokeball.up` to increase your capture rate. 


If you want to pop more pokemons in your dirs you can pop the amount of a new wave fixed in the config.json.

**Once a pokemon catched, it will not pop again.**

* Use `pokenode -n` to get a new wave of pokemons in your filesystem.


You can see how many pokemons are actually in your filesystem, how many pokemons you have not caught yet and some information by consulting your pokedex.

* Use `pokenode -p` or simply `pokenode` to list all needed information.


You can safely delete a .pok, it will delete its entry in the database.

* Use `pokenode -R pikachu.pok` to safely remove a .pok file.


If you want to encounter a random pokemon you can but **it will be more difficult** to .catch() it.

* Use `pokenode -r` to try to *.catch()* a random pokemon.


Finally you can start a new game by (re)initializing the database. It will **erase all the database data**, but keep in mind that you should manually remove all the .pok files before (re)starting.

* Use `pokenode -I` to (re)initialize the database.


## Installation and configuration

Installation : 

* `git clone https://github.com/hessman/PokeNode`

* `npm install` inside the PokeNode directory

* `npm install -g` inside the PokeNode directory to use `pokenode` everywhere

Then you just need to enter the authorized directories in the config.json.

You must use **absolute path** !\
For Windows you must escape the \ in the config.json _(C:\\\Users\\\pokenode)_...


This game has sound, you should install a CLI audio player like FFplay (FFmpeg).

The config.json file is preset for FFplay so : 
* for Linux `sudo dnf install ffmpeg` or `sudo apt-get install ffmpeg`... You know your things.
* for MacOS `brew install ffmpeg --with-ffplay --with-openssl`
* for Windows : [windows builds](https://ffmpeg.zeranoe.com/builds/) but do not forget to add FFplay to your PATH.

You can also disable sound by setting `true` for `"quiet"` in the config.json file

There is some other settings you can change in the config.json.


## Information

The pokemons are from **1st, 2nd and 3rd generations** *(by purpose)*.

I use the [pokeapi](https://pokeapi.co) API for pokemons' information and sprites. 

The cries are requested from [pokemoncries](https://pokemoncries.com).

This is an exercice but any pull request will be welcome.


**.catch() them all !**
