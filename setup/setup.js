'use strict';

const fs        = require('fs');
const path      = require('path');
const Promise   = require('bluebird');
const settings  = require('./../settings');
const request   = Promise.promisify(require('request'));
const marklogic = require('marklogic');
const db        = marklogic.createDatabaseClient(settings.connection);

let argument = process.argv[2];

const setup = () => {
  console.log('** Setup in progress **');
  let characters = fs.readdirSync(__dirname + '/data/characters/');
  let vehicles = fs.readdirSync(__dirname + '/data/vehicles/');

  characters.forEach((file) => {
    if (path.extname(file) === '.json') {
      db.documents.write({
        uri: '/character/' + file,
        contentType: 'application/json',
        content: fs.readFileSync(__dirname + '/data/characters/' + file)
      }).result()
      .then((response) => {
        console.log(response.documents[0].uri + ' inserted to the database.');
      })
      .catch((error) => console.log(error));
    }
  });

  vehicles.forEach((file) => {
    if (path.extname(file) === '.json') {
      db.documents.write({
        uri: '/vehicle/' + file,
        contentType: 'application/json',
        content: fs.readFileSync(__dirname + '/data/vehicles/' + file)
      }).result()
      .then((response) => {
        console.log(response.documents[0].uri + ' inserted to the database.');
      })
      .catch((error) => console.log(error));
    }
  });
};

const wipe = () => {
  console.log('** Deleting documents **');
  db.documents.removeAll({directory: '/character/'}).result().then((response) => console.log('All Characters are removed.')).catch((error) => console.log(error));
  db.documents.removeAll({directory: '/vehicle/'}).result().then((response) => console.log('All Vehicles are removed.')).catch((error) => console.log(error));
}

if (argument && argument === 'install') {
  setup();
} else if (argument && argument === 'wipe') {
  wipe();
} else {
  console.log('Parameter of script should either be "install" or "wipe".');
  process.exit();
}
