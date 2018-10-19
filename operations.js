//import all files needed to run programs
var Spotify = require('node-spotify-api');
const keys = require('./keys.js');
const spotify = new Spotify(keys.spotify);
const request = require('request');
const fs = require('fs');
const inquirer = require('inquirer');

//concatenate a ledger to append a log of search to log.txt
const concertledger = function(results){
    let ledger = "\r\n Concert-this Search Response: \r\n";
    for (let i = 0; i < results.length; i++){
        ledger += ((results[i].datetime).slice(0,10) + "\r\n");
        ledger += (results[i].venue.name + "\r\n");
        ledger += (results[i].venue.city + ", " + results[i].venue.region + " " + results[i].venue.country + "\r\n");
        ledger += "\r\n";
    };
    console.log('Your search has been logged');
    return ledger;
};
//concatenate a ledger to append a log of search to log.txt
const songledger = function(results){
    let ledger = "\r\n Spotify-this Search Response: \r\n";
    ledger += ("Artist Name: " + results.tracks.items[0].artists[0].name + "\r\n");
    ledger += ("Song Title: " + results.tracks.items[0].name + "\r\n");
    ledger += ("Preview Link: " + results.tracks.items[0].preview_url + "\r\n");
    ledger += ("Album Name: " + results.tracks.items[0].album.name + "\r\n");
    console.log('Your search has been logged');
    return ledger;
};
//concatenate a ledger to append a log of search to log.txt
const movieledger = function(results){
    let ledger = "\r\nMovie-this Search Response: \r\n";
    ledger += ("Movie Title: " + results.Title + "\r\n");
    ledger += ("Released In: " + results.Year + "\r\n");
    ledger += (results.Ratings[0].Source + " " + results.Ratings[0].Value + "\r\n");
    ledger += (results.Ratings[1].Source + " " + results.Ratings[1].Value + "\r\n");
    ledger += ("Country Released: " + results.Country + "\r\n");
    ledger += ("Languages Supported: " + results.Language + "\r\n");
    ledger += ("Plot Synopsis: " + results.Plot + "\r\n");
    ledger += ("Starring : " + results.Actors + "\r\n");
    console.log('Your search has been logged');
    return ledger;
}

//Create a function to log all concert venues a band will play in.
const concertsearch = function(data){
    //Put the search in a format that will fit in the api url.
    let topic = "";
    for (let i = 0; i < data.length; i++){
        topic+= data[i];
    };
    //make the request to find band venues
    request(`https://rest.bandsintown.com/artists/${topic}/events?app_id=codingbootcamp`, function (error, response, body) {
        if (error){
            console.log('error:', error); // Print the error if one occurred
        };
        //parse results obtained
        let result = JSON.parse(body);
        //display each venue in a readable format
        result.forEach(function(currentvalue){
            console.log((currentvalue.datetime).slice(0,10));
            console.log(currentvalue.venue.name);
            console.log(currentvalue.venue.city + ", " + currentvalue.venue.region + " " + currentvalue.venue.country);
            console.log("--------------------------------------------")
        })
        //ask user if they would like to log the search result.
        inquirer.prompt({
            type: "confirm",
            name: "confirm",
            message: "Would you like to log your search?"
        }).then(function(answer){
            //If they answer yes, run the ledger function to obtain data to append to file.
            if (answer.confirm === true){
                fs.appendFile('log.txt', concertledger(result), function(err){
                    if (err) {
                        console.log(err);
                    };
                    console.log("Your search has been logged");
                })
            } else {
                return;
            }
        });
    });
    
};

//Create a function to search for a song in spotify
const songsearch = function(data){
    //Concatenate the song title in a format readable by spotify api url
    let song = "";
    for (let i = 0; i < data.length; i++){
        song+= data[i];
        if (i != data.length-1){
            song+="%20";
        }
    }
    //request the song from spotify and display in a readable format.
    spotify.request(`https://api.spotify.com/v1/search?q=${song}&type=track&market=US`).then(function(data){
        console.log("Artist Name: " + data.tracks.items[0].artists[0].name);
        console.log("Song Title: " + data.tracks.items[0].name);
        console.log("Preview Link: " + data.tracks.items[0].preview_url);
        console.log("Album Name: " + data.tracks.items[0].album.name);
        //ask if user would like to log the results.
        inquirer.prompt({
            type: "confirm",
            name: "confirm",
            message: "Would you like to log your search?"
        }).then(function(answer){
            //If user answers yes, log the results in log.txt
            if (answer.confirm === true){
                fs.appendFile('log.txt', songledger(data), function(err){
                    if (err) {
                        console.log(err);
                    };
                })
            } else {
                return;
            }
        });
    }).catch(function(err){
        console.error('Error occurred: ' + err);
    });
    
};

//Create function to search throguh movie database to obtain movie data
const moviesearch = function(data){
    //format search for a format that will work for omdb api url.
    let movie = ""
    for (let i = 0; i < data.length; i++){
        movie+=data[i];
        if (i != data.length-1){
            movie+="%20";
        }
    }
    //make request to omdb and return in readable format
    request(`http://www.omdbapi.com/?apikey=trilogy&t=${movie}`, function (error, response, body) {
        if (error){
            console.log('error:', error); // Print the error if one occurred
        };
        const result = JSON.parse(body);
        console.log('---');
        console.log(result.Title);
        console.log(result.Year);
        console.log(result.Ratings[0].Source + result.Ratings[0].Value);
        console.log(result.Ratings[1].Source + result.Ratings[1].Value);
        console.log(result.Country);
        console.log(result.Language);
        console.log(result.Plot);
        console.log(result.Actors);
        console.log('---');
        //Ask user if they want to log result
        inquirer.prompt({
            type: "confirm",
            name: "confirm",
            message: "Would you like to log your search?"
        }).then(function(answer){
            //if Yes run ledger function to obtain info to log results to log.txt
            if (answer.confirm === true){
                fs.appendFile('log.txt', movieledger(result), function(err){
                    if (err) {
                        console.log(err);
                    };
                })
            } else {
                return;
            }
        });
    });
};

//export functions
module.exports = {
    concertsearch: concertsearch,
    songsearch: songsearch,
    moviesearch: moviesearch,
};