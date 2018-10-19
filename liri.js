require('dotenv').config();
const fs = require('fs');
const operations = require('./operations');
const select = process.argv[2];

const menu = function(selection, data){
    if (selection === 'concert-this'){
        operations.concertsearch(data);
    } else if (selection ==='spotify-this'){
        if (data.length === 0){
            data.push("What's");
            data.push("My");
            data.push("Age");
            data.push("Again?");
        }
        operations.songsearch(data);
    } else if (selection === "movie-this"){
       if (data.length === 0){
           data.push("Mr.Nobody");
       } 
       operations.moviesearch(data);
    } else {
        console.log('You did not enter a valid command!');
    }
};

if (select === "do-what-it-says"){
    fs.readFile('random.txt', 'utf8', function(err, data){
        let info = [];
        let file = [];
        let song = [];
        file = data.split(",");
        song = file[1].split(" ");
        for (let i = 0; i<song.length; i++){
            info.push(song[i]);
        }
        menu(file[0], info);
    });
} else {
    let info = [];
    for (let i = 3; i < process.argv.length; i++){
        info.push(process.argv[i]);
    }
    menu(select, info);
}


