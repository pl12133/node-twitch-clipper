'use strict';
let saveM3U = require('./saveM3U');

let argv = process.argv;
let node = argv[0];
node = node.substr(node.lastIndexOf('/') + 1);
let ownPath = argv[1];
ownPath = ownPath.substr(ownPath.lastIndexOf('/') + 1);
let videoTag = argv[2];
let startTime = argv[3];
let duration = argv[4];

if (!videoTag) {
  console.log(`Usage: ${node} {ownPath} videoId startTime duration\nexample: ${node} ${ownPath} \'v36939820\'`);
  return;
}
saveM3U(videoTag, undefined, startTime, duration);

