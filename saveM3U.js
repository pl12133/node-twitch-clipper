// http://jsfiddle.net/aNNiMON/5tL1vbsL/
'use strict';
var useAVodsAsPlaylist = true;
var useViewerToken = false;
let fs = require('fs');
let httpsRequest = require('./requests').httpsPromise;
let httpRequest = require('./requests').httpPromise;
let playlistToWebm = require('./playlistToWebm');

module.exports = saveM3U;

function process(channel) {
    let target = "https://api.twitch.tv/kraken/channels/" + channel + "/videos?limit=100&broadcasts=true";

    console.log('Trying to get: ', target);
    httpsRequest(target)
      .then(function(result) {
        let body = JSON.parse(result.body);
        body.videos.forEach(logVideo);
      })
      .catch((error) => console.error('Request Error: ', error));
}

function logVideo(video) {
  console.log(`Video: ${video.title} at ${video.url}`);
}

function saveM3U(vodIdStr) {
    console.log('Trying to save video: ' + vodIdStr);

    if (vodIdStr.charAt(0) == 'a') {
        getPlaylistAVods(vodIdStr);
        return;
    }
    var vodId = parseInt(vodIdStr.substring(1));
    httpsRequest("https://api.twitch.tv/api/vods/" + vodId + "/access_token")
      .then(function(result) {
        let body = JSON.parse(result.body);
        console.log('Result: ', body);
        getPlaylist(vodId, body.sig, body.token);
      })
      .catch(console.error.bind(console, 'saveM3U Error: '))
}

function getPlaylistAVods(vodIdStr) {
    if (useViewerToken) {
      httpsRequest('https://api.twitch.tv/api/viewer/token.json?as3=t')
        .then(function(result) {
          var token = result.token;
          httpsRequest('https://api.twitch.tv/api/videos/' + vodIdStr + '?as3=t&oauth_token=' + token)
            .then(processAVods)
            .catch(console.error.bind(console, 'getPlaylistAVods useViewerToken Error: '))
        })
        .catch(console.error.bind(console, 'getPlaylistAVods useViewerToken Error: '))
    } else {
      httpsRequest('https://api.twitch.tv/api/videos/' + vodIdStr + '?as3=t')
        .then(processAVods)
        .catch(console.error.bind(console, 'getPlaylistAVods !useViewerToken Error: '))
    }
}

function processAVods(result) {
    if (useAVodsAsPlaylist) {
        createPlaylistFromAVodJson(result);
    } else {
        createFileListFromAVodJson(result);
    }
}
        
function createPlaylistFromAVodJson(result) {
    var targetDuration = 0;
    var urls = result.chunks.live
      .map(function(live) {
          if (live.length > targetDuration) targetDuration = live.length;
        return '#EXTINF:' + live.length + '.000,\n' + live.url;
      })
      .join("\n");
    var playlist = '#EXTM3U\n'+
      '#EXT-X-VERSION:3\n'+
      '#EXT-X-PLAYLIST-TYPE:EVENT\n'+
      '#EXT-X-TARGETDURATION:' + targetDuration + '\n'+
      urls + '\n#EXT-X-ENDLIST';
    var filename = result.channel + "_" + result.api_id;
    saveFile(filename + ".m3u8", playlist);
}

function createFileListFromAVodJson(result) {
  var urls = result.chunks.live
      .map((live) => live.url)
      .join("\n");
  var filename = result.channel + "_" + result.api_id;
  saveFile(filename + ".txt", playlist);
}

function getPlaylist(vodId, sig, token) {
  console.log('Trying getPlaylist');

  var reqUrl = "http://usher.twitch.tv/vod/" + vodId + "?player=twitchweb&allow_source=true&nauthsig=" + sig + "&nauth=" + encodeURIComponent(token);
  httpRequest(reqUrl, 'text')
    .then(function(data) {
      // getFullPlaylist(vodId, data.body);
      getPlaylistWithQuality(vodId, data.body, 'chunked');
    })
    .catch(console.error.bind(console, 'getPlayList Error: '));
}

function getPlaylistWithQuality(vodId, data, quality) {
  console.log('Trying getFullPlayListWithQuality');
  var lines = data.split(/\n/);
  lines
    .filter(line => line.indexOf(quality) >= 0)
    .forEach(function(line, i) {
        if (line.indexOf("http") !== 0) return;
        
        var urlPart = line.substring(0, line.lastIndexOf('/') + 1);
        console.log('Trying to get: ' + line);
        httpRequest(line)
          .then(function(data) {
            var filename = vodId;
            saveFile(filename + ".m3u8", processPlaylist(data.body, urlPart));
          })
          .catch(console.error.bind(console, 'getFullPlayListWithQuality Error: '));
    });
}
function getFullPlaylist(vodId, data) {
    console.log('Trying getFullPlaylist');

    var lines = data.split(/\n/);
    lines.forEach(function(line, i) {
      if (line.indexOf("http") !== 0) return;
      
      var urlPart = line.substring(0, line.lastIndexOf('/') + 1);
      console.log('Tring to get: ' + line);
      httpRequest(line)
        .then(function(data) {
          var filename = vodId;
          saveFile(filename + ".m3u8", processPlaylist(data.body, urlPart));
        })
        .catch(console.error.bind(console, 'getFullPlayList Error: '));
    });
}

function processPlaylist(data, urlPart) {
    console.log('Trying processPlaylist');
    return data.split(/\n/)
      .map(function(line) {
          if (line.trim().length == 0) return line;
          if (line.indexOf('#') != -1) return line;
          return urlPart + line;
      })
      .join("\n");
}

function saveFile(filename, data) {
  console.log('Trying to save to: ', filename);
  let file = new Buffer(data, 'binary');
  fs.writeFile(filename, file);
  playlistToWebm(filename);
}
