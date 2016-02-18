'use strict';
let videoIdToWebm = require('./saveM3U');

let argv = process.argv;
let node = argv[0];
node = node.substr(node.lastIndexOf('/') + 1);
let ownPath = argv[1];
ownPath = ownPath.substr(ownPath.lastIndexOf('/') + 1);
let first = argv[2];

if (!first) {
  console.log(`Usage: ${node} {ownPath} videoId\nexample: ${node} ${ownPath} \'v36939820\'`);
  return;
}
let videoTag = first;
videoIdToWebm(videoTag);

