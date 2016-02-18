'use strict';
let ffmpeg = require('fluent-ffmpeg');

module.exports = function playlistToWebm(filename, startTime, duration) {
  let newFilename = filename.substring(0, filename.lastIndexOf('.') + 1) + 'webm';
  console.log('Converting ' + filename + ' to ' + newFilename);
  startTime = startTime || 0;
  duration = duration || 10;

  var command = ffmpeg(filename);
  command
    .seekInput(startTime)
    .videoCodec('libvpx')
    .duration(duration)
    .on('error', function(err) {
      console.error('FFmpeg Error: ', err);
    })
    .on('end', function() {
      console.log(newFilename + ' saving finished');
    })
    .on('progress', function(progress) {
      console.log('Processing: ' + progress.percent + '% done');
    })
    .save(newFilename);
}
