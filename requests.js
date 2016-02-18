'use strict';
let https = require('https');
let http = require('http');
let url = require('url');

module.exports = {
  httpsPromise: function httpsPromise(options, contentType) {
    if (typeof options === 'string') {
      options = url.parse(options);
    }
    options.headers = Object.assign({}, options.headers, {
      'Content-type': contentType || 'jsonp',
      'Access-Control-Allow-Origin' : '*'
    });

    return new Promise(function(resolve, reject) {
      var request = https.request(options, function(response) {
        var result = {
          body: ''
        }
        response.on('data', (chunk) => result.body += chunk);
        response.on('end', () => resolve(result));
      });

      request.on('error', (error) => {
        reject(error);
      });

      request.end();
    });
  },

  httpPromise: function httpPromise(options, contentType) {
    if (typeof options === 'string') {
      options = url.parse(options);
    }
    options.headers = Object.assign({}, options.headers, {
      'Content-type': contentType || 'jsonp',
      'Access-Control-Allow-Origin' : '*'
    });
    return new Promise(function(resolve, reject) {
      var request = http.request(options, function(response) {
        var result = {
          body: ''
        }
        response.on('data', (chunk) => result.body += chunk);
        response.on('end', () => resolve(result));
      });

      request.on('error', (error) => {
        reject(error);
      });

      request.end();
    });
  }
}
