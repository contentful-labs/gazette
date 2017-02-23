'use strict';

const delivery = require('contentful');
const mgmt = require('contentful-management');

const config = require('./config.json');
const cda = delivery.createClient({
  space: config.contentful.spaceId,
  accessToken: config.contentful.deliveryAccessToken
});

module.exports = {
  getList,
  createUpdater
};

function getList (limit) {
  limit = limit || 8;
  const order = 'sys.createdAt';
  const content_type = 'article';

  return cda.getEntries({limit, order, content_type}).then(res => res.items);
}

function createUpdater (cmaToken) {
  const cma = mgmt.createClient({accessToken: cmaToken});
  const locale = config.contentful.locale;

  return cma.getSpace(config.contentful.spaceId)
  .then(space => (eid, fid, val) => {
    return space.getEntry(eid).then(entry => {
      if (val === entry.fields[fid][locale]) {
        return Promise.resolve(entry);
      } else {
        entry.fields[fid][locale] = val;
        return entry.update().then(updated => updated.publish());
      }
    });
  });
}
