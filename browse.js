'use strict';
require('babel-register');

let https = require('https');
let url = require('url');
let rl = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

let httpsPromise = require('./httpsRequest');

function getLink(apiUrl) {
  console.log('Trying to get: ', apiUrl);
  return httpsPromise(url.parse(apiUrl));
}
function getIndex() {
  return getLink('https://api.twitch.tv/kraken');
}

function handleChoice(body, answer) {
  let links = body._links;
  let keys = Object.keys(links)
  answer = +answer;

  if (0 <= answer <= keys.length) {
    return getLink(links[keys[answer]]);
  }
  return Promise.reject('Invalid Answer');
}

function printChoices(body) {
  let links = body._links;
  Object.keys(links).forEach((key, index) => console.log(`
    ${index} ${key}: ${links[key]}
  `));
}

function nextChoice(body) {
  console.log(body);
  printChoices(body);
  if (body.token) {
    console.log('Token: ', body.token);
  }
  rl.resume();
  rl.question('Please choose an option\n', (answer) => {
    handleChoice(body, answer)
      .then((response) => nextChoice(JSON.parse(response.body)))
      .catch(console.error.bind(console, 'handleChoice Error: '))
    rl.pause();
  });
}

getIndex()
  .then((response) => nextChoice(JSON.parse(response.body)))
  .catch(console.error.bind(console, 'getIndex Error: '));
