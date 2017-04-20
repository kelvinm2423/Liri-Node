//Liri commands
// my-tweets
// spotify-this-song
// movie-this
// do-what-it-says

//these add other programs to this one
var dataKeys = require("./keys.js");
var fs = require('fs'); 
var twitter = require('twitter');
var spotify = require('spotify');
var request = require('request');


var writeLog = function(data) {
  fs.appendFile("log.txt", '\r\n\r\n');

  fs.appendFile("log.txt", JSON.stringify(data), function(err) {
    if (err) {
      return console.log(err);
    }

    console.log("log.txt was updated!");
  });
}

var getTweets = function() {
  var client = new twitter(dataKeys.twitterKeys);

  var params = { screen_name: 'kelmed2423', count: 20 };

  client.get('statuses/user_timeline', params, function(error, tweets, response) {

    if (!error) {
      var data = []; //empty array to hold data
      for (var i = 0; i < tweets.length; i++) {
        data.push({
            'created at: ' : tweets[i].created_at,
            'Tweets: ' : tweets[i].text,
        });
      }
      console.log(data);
      writeLog(data);
    }
  });
};

//Creates a function for finding artist name from spotify
var artistNames = function(artist) {
  return artist.name;
};

//Function for finding songs on Spotify
var getSongName = function(songName) {
  //Just in case it cannot find the song
  if (songName === undefined) {
    songName = 'Cannot find song';
  };

  spotify.search({ type: 'track', query: songName }, function(err, data) {
    if (err) {
      console.log('Error occurred: ' + err);
      return;
    }

    var songs = data.tracks.items;
    var data = []; //empty array to hold data

    for (var i = 0; i < songs.length; i++) {
      data.push({
        'artist(s)': songs[i].artists.map(artistNames),
        'song name: ': songs[i].name,
        'preview song: ': songs[i].preview_url,
        'album: ': songs[i].album.name,
      });
    }
    console.log(data);
    writeLog(data);
  });
};

var getMovie = function(movieName) {

  if (movieName === undefined) {
    movieName = 'Mr Nobody';
  }

  var urlHit = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=full&tomatoes=true&r=json";

  request(urlHit, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      var data = [];
      var jsonData = JSON.parse(body);

      data.push({
      'Title of the Movie: ' : jsonData.Title,
      'Year of Premier: ' : jsonData.Year,
      'Movie Rated: ' : jsonData.Rated,
      'IMDB Rating: ' : jsonData.imdbRating,
      'Country Produced: ' : jsonData.Country,
      'Language of Movie: ' : jsonData.Language,
      'Plot: ' : jsonData.Plot,
      'Actors: ' : jsonData.Actors,
      'Rotten Tomatoes Rating: ' : jsonData.tomatoRating,
      'Rotton Tomatoes URL: ' : jsonData.tomatoURL,
  });
      console.log(data);
      writeLog(data);
}
  });

}

var randomText = function() {
  fs.readFile("random.txt", "utf8", function(error, data) {
    console.log(data);
    writeLog(data);
    var dataArr = data.split(',')

    if (dataArr.length == 2) {
      pick(dataArr[0], dataArr[1]);
    } else if (dataArr.length == 1) {
      pick(dataArr[0]);
    }

  });
}

var commands = function(caseData, functionData) {
  switch (caseData) {
    case 'my-tweets':
      getTweets();
      break;
    case 'spotify-this-song':
      getSongName(functionData);
      break;
    case 'movie-this':
      getMovie(functionData);
      break;
    case 'do-what-it-says':
      randomText();
      break;
    default:
      console.log('LIRI doesn\'t know that');
  }
}

//run on load of js file
var run = function(argOne, argTwo) {
  commands(argOne, argTwo);
};

run(process.argv[2], process.argv[3]);