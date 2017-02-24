'use strict';

const delivery = require('contentful');
const mgmt = require('contentful-management');

const config = require('./config.json').contentful;

const cda = delivery.createClient({
  space: config.spaceId,
  accessToken: config.deliveryAccessToken
});

module.exports = {
  getList,
  createUpdater,
  handleWebhookEntry
};

function getList (limit) {
  limit = limit || 6;
  const order = 'sys.createdAt';
  const content_type = config.contentTypeId;
  const params = {limit, order, content_type};

  return cda.getEntries(params).then(res => res.items);
}

function createUpdater (cb) {
  const previous = sessionStorage.getItem('cmaToken') || '';
  const cmaToken = prompt('Please provide your CMA token:', previous);
  const isTokenValid = typeof cmaToken === 'string' && cmaToken.length > 10;
  const fail = () => alert('Something went wrong. Is your token valid?');

  if (!isTokenValid) {
    return fail();
  }

  mgmt.createClient({accessToken: cmaToken})
  .getSpace(config.spaceId).then(space => {
    sessionStorage.setItem('cmaToken', cmaToken);
    cb(createUpdaterFor(space, config.locale));
  }, fail);
}

function createUpdaterFor (space, locale) {
  return (eid, fid, val) => space.getEntry(eid).then(entry => {
    if (val === entry.fields[fid][locale]) {
      return Promise.resolve(entry);
    } else {
      entry.fields[fid][locale] = val;
      return entry.update().then(updated => updated.publish());
    }
  });
}

function handleWebhookEntry (entry, entries) {
  if (entry.sys.contentType.sys.id !== config.contentTypeId) {
    return entries;
  }

  entry.fields = Object.keys(entry.fields).reduce((acc, key) => {
    acc[key] = entry.fields[key][config.locale];
    return acc;
  }, {});

  return entries.map(existing => {
    return existing.sys.id === entry.sys.id ? entry : existing;
  });
}
