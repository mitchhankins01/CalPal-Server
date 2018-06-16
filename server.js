// NPM Imports
const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
// Local Imports
require('./config');
const User = require('./models/user');
const mongoose = require('./db/mongoose');
// Consts
const app = express();
const port = process.env.PORT;

app
  .use(bodyParser.json())
  // Root
  .get('/', (req, res) => {
    return res.send('hello');
  })
  // Login User
  .post('/users/login', (req, res) => {
    const params = _.pick(req.body, ['email', 'password']);
    User.findByCredentials(params.email, params.password)
      .then(user => {
        return user.generateAuthToken().then(token => {
          res.header('x-auth', token).send(user);
        });
      })
      .catch(error => res.status(400).send(error));
  })
  // Create User
  .post('/users', (req, res) => {
    const user = new User(_.pick(req.body, ['email', 'password']));
    user
      .save()
      .then(() => user.generateAuthToken())
      .then(token => res.header('x-auth', token).send(user))
      .catch(error => res.status(400).send(error));
  })
  .listen(port, () => console.log(`Server up on port: ${port}`));

module.exports = app;
