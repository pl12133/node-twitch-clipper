'use strict';
let ffmpeg = require('fluent-ffmpeg');

module.exports = function playlistToWebm(filename, startTime, duration, stream) {
  startTime = startTime || 0;
  duration = duration || 10;

  console.log('Trying to convert playlist to ' + filename);

  var command = ffmpeg(stream);
  command
    .seekInput(startTime)
    .videoCodec('libvpx')
    .duration(duration)
    .on('error', function(err) {
      console.error('FFmpeg Error: ', err);
    })
    .on('end', function() {
      console.log(filename + ' saving finished');
    })
    .on('progress', function(progress) {
      console.log('Processing: ' + progress.percent + '% done');
    })
    .save(filename);
}
