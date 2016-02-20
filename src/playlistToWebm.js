'use strict';
const ffmpeg = require('fluent-ffmpeg');
const path = require('path');

module.exports = function playlistToWebm(filename, startTime, duration, stream) {
  return new Promise(function(resolve, reject) {
    startTime = startTime || 0;
    duration = duration || 10;
    let basename = path.basename(filename);
    basename = (basename.lastIndexOf('.webm') < basename.length - '.webm'.length)
      ? basename += '.webm'
      : basename;

    filename = path.join('videos', basename);

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
