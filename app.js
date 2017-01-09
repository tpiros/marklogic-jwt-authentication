'use strict';

const express = require('express');
const app     = express();
const router  = express.Router();
const jwt = require('jsonwebtoken');
const marklogic = require('marklogic');
const settings  = require('./settings');

const db = marklogic.createDatabaseClient(settings.connection);
const qb = marklogic.queryBuilder;

app.set('port', 8080);
app.use('/', router);

const authenticate = (req, res, next) => {
  let authHeader = req.headers.authorization;
  if (authHeader) {
    let token = authHeader.split(' ')[1];
    jwt.verify(token, 's3cr3t', (error, decoded) => {
      if (error) {
        console.log(error);
        res.sendStatus(401);
      } else {
        req.username = decoded.username;
        next();
      }
    });
  } else {
    res.status(403).send({message: 'No token provided.'});
  }
};

const characters = (req, res) => {
  if (req.username) {
    db.documents.query(
      qb.where(
        qb.directory('/character/')
      ).slice(0,100)
    ).result()
    .then((response) => {
      let characterNames = response.map((character) => {
        return character.content.name;
      });
      res.json(characterNames);
    })
    .catch((error) => {
      console.log(error);
    });
  }
};

const vehicles = (req, res) => {
  db.documents.query(
    qb.where(
      qb.directory('/vehicle/')
    ).slice(0,100)
  ).result()
  .then((response) => {
    let vehicleNames = response.map((vehicle) => {
      return vehicle.content.name;
    });
    res.json(vehicleNames);
  })
  .catch((error) => {
    console.log(error);
  });
};

router.route('/api/characters').get(authenticate, characters);
router.route('/api/vehicles').get(vehicles);

app.listen(app.get('port'), () => {
  console.log('Magic happens on port ' + app.get('port') + ' "/api/characters" or "/api/vehicles".');
});
