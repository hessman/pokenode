# PokeNode

Simple NodeJS CLI game.

**Explore your filesystem for pokemons and add them to your Pokedex !**

![pokenode](https://i.imgur.com/9WIy8YP.png)


## How to play ?

The game will pop some pokemon *(ex: charmander.pok)* in the directories (and their subdirectories) defined in the config.json file. 

* You must locate them and use the command `pokenode -f charmander.pok` to try to *.catch()* them. 

**If the pokemon escaped the .pok file will move !**


You can catch a pokemon by throwing... *pokeballs* but it will be difficult at the beginning. In fact few *pokeball.up* files will pop during the game. It will increase the capture rate of your pokeballs and your chase will be easier.

* You must locate them and use `pokenode -u pokeball.up` to increase your capture rate. 

* Use `pokenode -u` to get your current pokeball level.


If you want to pop more pokemon in your dirs you can pop the amount of a new wave fixed in the config.json.

__Once a pokemon catched, it will not pop again.__

* Use `pokenode -n` to get a new wave of pokemons in your filesystem.


You can see how many pokemons are actually in your filesystem and how many pokemons you dit not have catched yet by consulting your pokedex.

* Use `pokenode -l` to list all needed information.


Finall you can encounter a random pokemon but **it will be more difficult** to .catch() it.

* Use `pokenode -r` to try to *.catch()* a random pokemon.


## Config, sound...

This game has sound, we should install a CLI audio player like FFplay (FFmpeg).

The config.json file is preset for FFplay so : 
* for Linux `sudo dnf install ffmpeg` or `sudo apt-get install ffmpeg`... You know your things.
* for MacOS `brew install ffmpeg`
* for Windows : [windows build](https://www.ffmpeg.org/download.html#build-windows)

We can also disable sound by setting `true` for `"quiet"` in the config.json file

There is some other settings you can change in the config.json.

## Information

The pokemons are from **1st, 2nd and 3rd generations** *(by purpose)*.

I use the [pokeapi](https://pokeapi.co) API for pokemons' information and sprites. 

The cries are requested from [pokemoncries](https://pokemoncries.com).


This game is an exercice but any pull request will be welcome.


**.catch() them all !**
