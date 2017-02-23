'use strict';

const PubNub = require('pubnub');

const config = require('./config.json');
const pubnub = new PubNub({subscribeKey: config.pubnub.subscribeKey});

let subscribers = [];

pubnub.addListener({message: onMessage});
pubnub.subscribe({channels: [config.pubnub.channel]});

module.exports = {
  subscribe: fn => subscribers.push(fn),
  off: () => subscribers = []
};

function onMessage (payload) {
  const entry = payload.message;

  if (entry.sys.contentType.sys.id === config.contentful.contentTypeId){
    entry.fields = Object.keys(entry.fields).reduce((acc, key) => {
      acc[key] = entry.fields[key][config.contentful.locale];
      return acc;
    }, {});

    subscribers.forEach(fn => fn(entry));
  }
}
