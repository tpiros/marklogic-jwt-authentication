'use strict';
const jwt        = require('jsonwebtoken');
const marklogic  = require('marklogic');
const settings  = require('./settings');

const db = marklogic.createDatabaseClient(settings.connection);

db.documents.write({
  uri: '/user/tamas.json',
  contentType: 'application/json',
  content: {
    name: 'tamas',
    password: 'password'
  }
}).result()
.then((response) => {
  return db.documents.read('/user/tamas.json').result()
})
.then((response) => {
  let secret = 's3cr3t';
  let expire = 3600;
  let tokenValue = { username: response[0].content.name };
  let token = jwt.sign(tokenValue, secret, { expiresIn: expire });
  console.log('** TOKEN **');
  console.log(token);
  console.log('** Copy line below for the Authorization header **');
  console.log('Bearer ' + token);
})
.catch((error) => {
  console.log(error);
});
