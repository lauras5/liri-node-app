require("dotenv").config()

var fs = require('fs')
var path = 'random.txt'
var request = require('request');
var Twitter = require('twitter')
var Spotify = require('node-spotify-api');
var command = process.argv[2]
var search = process.argv[3]

console.log('this is loaded')

// Spotify 
var spotify = new Spotify({
  id: process.env.SPOTIFY_ID,
  secret: process.env.SPOTIFY_SECRET
});

// Twitter
var client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

console.log(command)

switch(command) {
  case 'my-tweets' : 
    var params = {screen_name: 'NodeJS_is_life'}
    var path = 'statuses/user_timeline'

    client.get(path, params, function(error, tweets, response) {
      if (!error) {
        for ( var i = 0; i < tweets.length; i++) {
          var tweetText = tweets[i].text
          var tweetTime = tweets[i].created_at
          console.log(i +  ". " + tweetTime + '\r\n' + tweetText + '\r\n' )
        }
      } 
    })
    break;

  case 'spotify-this-song' : 
    //start search for spotify, limits search to 1
    spotify.search({ type: 'track', query: search, limit: 1 }, function(err, data) {
      //returns error
      if (err) {
        return console.log('Error occurred: ' + err);
      }

      var songArtist = data.tracks.items[0].artists[0].name
      var songName = data.tracks.items[0].name
      var songAlbum = data.tracks.items[0].album.name
      var songInfo = data.tracks.items[0].external_urls.spotify  

      console.log('Artist: ' + songArtist + ', Song : ' + songName + ', Album : ' + songAlbum + ', Song Preview : ' + songInfo)
    })
    //else 'the sign' by ace of base
    break;

  case 'movie-this' :
    // OMDB
    var movieURL = 'http://www.omdbapi.com/?apikey=trilogy&t=' + search
    console.log(movieURL)
    request('http://www.google.com', function (error, response, body) {
      console.log('error:', error); // Print the error if one occurred
      console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
      console.log('body:', body); // Print the HTML for the Google homepage.
    });
    //title of movie, year, imdb rating, rotten tomatoes, country, language, plot and actors
    //default 'mr.nobody'
    break;

  case 'do-what-it-says' :
    fs.readFile(path, 'utf8', function( e, d ) {
      if(e) {console.log(e)}
      else (console.log(d))
      command = d
      if (command === 'movie-this') {
        console.log('movie')
      } else if (command === 'spotify-this-song') {
        console.log('song')
      }
      //get index of comma and do before and after
      
    })
    break;
  }
