'use strict';
let httpsRequest = require('./requests').httpsPromise;
let httpRequest = require('./requests').httpPromise;
let playlistToWebm = require('./playlistToWebm');
let stream = require('stream');

module.exports = saveM3U;

function saveM3U(vodIdStr, filename, startTime, duration) {
  let vodId = (/^[a-z]/i).test(vodIdStr)
   ? parseInt(vodIdStr.substring(1))
   : +vodIdStr;

  filename = filename || 'movie_' + vodId + '.webm';
  startTime = startTime || 0;
  duration = duration || 10;

  let urlPart = '';
  getVodsAccessToken(vodId)
    .then(getPlaylist.bind(null, vodId))
    .then(getPlaylistURL)
    .then(url => {
      urlPart = url.substr(0, url.lastIndexOf('/') + 1);
      return httpRequest(url)
    })
    .then(result => processPlaylist(urlPart, result))
    .then(dataToReadstream)
    .then(playlistToWebm.bind(null, filename, startTime, duration))
    .catch(console.log.bind(console, 'getAccessToken ERR: '))
}

function getVodsAccessToken(vodId) {
  let reqUrl= "https://api.twitch.tv/api/vods/" + vodId + "/access_token";
  return httpsRequest(reqUrl);
}

function getPlaylist(vodId, data) {
  let body = JSON.parse(data.body);
  let sig = body.sig;
  let token = body.token;
  let reqUrl = "http://usher.twitch.tv/vod/" + vodId + "?player=twitchweb&allow_source=true&nauthsig=" + sig + "&nauth=" + encodeURIComponent(token);
  return httpRequest(reqUrl, 'text')
}

function getPlaylistURL(data) {
  let body = data.body;
  let quality = 'chunked';
  let lines = body.split(/\n/);
  let line = lines
    .filter(line => line.indexOf('http') === 0)
    .filter(line => line.indexOf(quality) >= 0)[0]
  console.log('Playlist URL: ', line);
  return Promise.resolve(line);
}

function processPlaylist(urlPart, data) {
  let body = data.body;
  return Promise.resolve(body.split(/\n/)
    .map(function(line) {
      if (line.trim().length == 0) return line;
      if (line.indexOf('#') != -1) return line;
      return urlPart + line;
    })
    .join("\n")
  )
}

function dataToReadstream(data) {
  let file = new Buffer(data, 'binary');
  let fileStream = new stream.PassThrough();
  fileStream.end(file);
  return Promise.resolve(fileStream);
}
function streamToWebm(filename, dataStream) {
  let newFilename = filename.substr(0, filename.lastIndexOf('.') + 1) + 'webm';
  console.log('Trying to save to: ', newFilename);
  playlistToWebm(newFilename, dataStream);
}
