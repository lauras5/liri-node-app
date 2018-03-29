require("dotenv").config()

var fs = require('fs')
var path = 'random.txt'
var outPath = 'log.txt'
var request = require('request');
var Twitter = require('twitter')
var Spotify = require('node-spotify-api');
var command = process.argv[2]
var search = process.argv.splice(3, process.argv.length)

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

// function to request twitter feed
function tweetFunc() {
  var params = { screen_name: 'NodeJS_is_life' }
  var path = 'statuses/user_timeline'
  //get 
  client.get(path, params, function (error, tweets, response) {
    if (!error) {
      // I don't have 20 tweets, otherwise I would write it as
      // for (var i = 0; i < 20; i++) {
      for (var i = 0; i < tweets.length; i++) {
        var tweetText = tweets[i].text
        var tweetTime = tweets[i].created_at
        var input = "\r\nTweet : " + tweetTime + '\r\n' + tweetText + '\r\n'
        console.log(input)
        fs.appendFile(outPath, input, function (e) {
          if (e) { console.log(e) }
        })
      }
    }
  })
}

function movieFunc() {
  if (search[0] == undefined) {search = 'mr.nobody'}
  console.log(search[0])
  var movieURL = 'http://www.omdbapi.com/?apikey=trilogy&t=' + search
  request.get(movieURL, function (error, response, body) {
    if (error) {
      search = 'Mr. Nobody'
      movieFunc()
      //prints error and response status if there is an error
      console.log('statusCode:', response && response.statusCode)
      console.log('error:', error)
    }
    var body = JSON.parse(response.body)
    var movieTitle = body.Title
    var movieYear = body.Year
    var movieRating = body.imdbRating
    var movieRotten = body.Ratings[1].Value
    var movieCountry = body.Country
    var movieLanguage = body.Language
    var moviePlot = body.Plot
    var actors = body.Actors

    input = 'Movie: ' + movieTitle + '\r\nYear: ' + movieYear + '\r\nimdb Rating : ' + movieRating + ' / 10 \r\nRotten Tomatoes Rating : ' + movieRotten + '\r\nCountry : ' + movieCountry + '\r\nLanguage : ' + movieLanguage + '\r\nMovie Plot: ' + moviePlot + '\r\nActors : ' + actors

    console.log(input)

    fs.appendFile(outPath, input, function (e) {
      if (e) { console.log(e) }
    })
  });
}

function spotifyFunc() {
  if (search[0] == undefined) {search = 'the sign ace of base'}
  //if there is nothing to search, defaults to the sign, ace of base
  spotify.search({ type: 'track', query: search, limit: 1 }, function (err, data) {
    //returns error  
    if (err) {
      console.log('Error: ' + error);
      return
    }

    var songArtist = data.tracks.items[0].artists[0].name
    var songName = data.tracks.items[0].name
    var songAlbum = data.tracks.items[0].album.name
    var songInfo = data.tracks.items[0].external_urls.spotify

    //console logging the result
    input = 'Artist: ' + songArtist + '\r\nSong : ' + songName + '\r\nAlbum : ' + songAlbum + '\r\nSong Link on Spotify: ' + songInfo
    console.log(input)

    fs.appendFile(outPath, input, function (e) {
      if (e) { console.log(e) }
    })
  })
}
//start search for spotify, limits search to 1

switch (command) {
  case 'my-tweets':
    tweetFunc()
    break;
  case 'spotify-this-song':
    spotifyFunc()
    break;
  case 'movie-this':
    movieFunc()
    break;
  case 'do-what-it-says':
    fs.readFile(path, 'utf8', function (e, d) {
      if (e) { console.log(e) }
      splitCommand = d.split(',')
      console.log(splitCommand[0])
      console.log(splitCommand[1])
      command = splitCommand[0]
      search = splitCommand[1]

      if (command === 'spotify-this-song') {
        spotifyFunc()
      } else if (command === 'movie-this') {
        movieFunc()
      } else if (command === 'my-tweets') {
        tweetFunc()
      } else {
        console.log('There is nothing written in the random.txt folder')
      }
    })
    break;
}
