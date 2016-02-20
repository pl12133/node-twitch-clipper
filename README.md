# node-twitch-clipper
Create Webm clips from Twitch.tv VODs

# Download

    git clone https://github.com/pl12133/node-twitch-clipper
    cd node-twitch-clipper

# Install

    npm install

*Note*: This package depends on FFmpeg for encoding videos. You must have FFmpeg installed so that `fluent-ffmpeg/node-fluent-ffmpeg` can function properly. To install FFmpeg please visit [FFmpeg.org](https://ffmpeg.org/download.html).

# Usage

###### Visit [node-twitch-clipper-demo](https://github.com/pl12133/node-twitch-clipper-demo) for an example of `node-twitch-clipper` in action.

Import `node-twitch-clipper`

    var saveVideo = require('/path/to/node-twitch-clipper/');

### saveM3U(vodIdStr, [filename, startTime, duration])

##### vodIdStr

The VOD ID found in a Twitch.tv URL, e.g. www.twitch.tv/nl_kripp/v/43245884 has the VOD ID of v43245884

##### filename

The name of the file to save your clip to. Default is  ${vodIdStr}.webm

##### startTime

The time into the video to begin clipping. Format 'HH:MM:SS.SSS', eg. 5 minutes is '00:05:00.000'. Default is 0 (beginning of video).

##### duration

The length of the clip to grab in seconds. e.g. 15 seconds is 15. Default is 15.
