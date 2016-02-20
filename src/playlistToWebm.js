'use strict';
const ffmpeg = require('fluent-ffmpeg');
const path = require('path');

module.exports = {
  promisePlaylistToWebm: promisePlaylistToWebm
}

// function playlistToWebm(filename, startTime, duration, stream) {
//   startTime = startTime || 0;
//   duration = duration || 10;
// 
//   console.log('Trying to convert playlist to ' + filename);
// 
//   var command = ffmpeg(stream);
//   command
//     .seekInput(startTime)
//     .videoCodec('libvpx')
//     .duration(duration)
//     .on('error', function(err) {
//       console.error('FFmpeg Error: ', err);
//     })
//     .on('end', function() {
//       console.log(filename + ' saving finished');
//     })
//     .on('progress', function(progress) {
//       console.log('Processing: ' + progress.percent + '% done');
//     })
//     .save(filename);
// }

function promisePlaylistToWebm(filename, startTime, duration, stream) {
  return new Promise(function(resolve, reject) {
    startTime = startTime || 0;
    duration = duration || 10;
    filename = path.join('videos', path.basename(filename));

    console.log('Trying to convert playlist to ' + filename);

    var command = ffmpeg(stream);
    command
      .seekInput(startTime)
      .videoCodec('libvpx')
      .duration(duration)
      .on('error', function(err) {
        console.error('FFmpeg Error: ', err);
        reject(err);
      })
      .on('end', function() {
        console.log(filename + ' saving finished');
        resolve(filename);
      })
      .on('progress', function(progress) {
        console.log('Processing: ' + progress.percent + '% done');
      })
      .save(filename);
  });
}
