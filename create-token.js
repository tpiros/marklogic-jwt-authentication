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
  const secret = 's3cr3t';
  const expire = 3600;
  const tokenValue = { username: response[0].content.name };
  const token = jwt.sign(tokenValue, secret, { expiresIn: expire });
  console.log('** TOKEN **');
  console.log(token);
  console.log('** Copy line below for the Authorization header **');
  console.log('Bearer ' + token);
})
.catch((error) => {
  console.log(error);
});
