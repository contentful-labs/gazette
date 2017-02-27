'use strict';

const PubNub = require('pubnub');

const config = require('./config.json').pubnub;
const pubnub = new PubNub({subscribeKey: config.subscribeKey});

const channels = [config.channel];

let subscribers = [];

pubnub.addListener({message: onMessage});
pubnub.subscribe({channels});

module.exports = {
  subscribe: fn => subscribers.push(fn),
  off
};

function onMessage (payload) {
  subscribers.forEach(fn => fn(payload.message));
}

function off () {
  subscribers = [];
  pubnub.unsubscribe({channels});
}
