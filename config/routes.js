const axios = require('axios');
// dont forget bcrypt
const bcrypt = require('bcryptjs');

// bring in generate Token.
const { authenticate, generateToken } = require('../auth/authenticate');
// bring in routes-model
const db = require('./routes-model.js');


module.exports = server => {
  server.post('/api/register', register);
  server.post('/api/login', login);
  server.get('/api/jokes', authenticate, getJokes);
};

function register(req, res) {
  const user = req.body;
  const hash = bcrypt.hashSync(user.password, 12);
  user.password = hash;

  if(!user.username && !user.password) {
    res.status(401).json({ message: 'Please provide a username and password for registration.'})
  } else {
    db.addNew(user)
    .then(user => {
      res.status(201).json(user)
    })
    .catch(err => {
      res.status(500).json(err.message)
    });
  };
  
};

function login(req, res) {
  const { username, password } = req.body;

  if(!username && !password) {
    res.status(401).json({ message: 'Please provide your username and password to login.'})
  } else {
    db.getUserBy({ username })
    .first()
    .then(user => {
      if(user && bcrypt.compareSync(password, user.password)) {
        const token = generateToken(user);
        res.status(200).json({ message: "Login success.", token})
      } else {
        res.status(401).json({ message: 'Please provide valid login info.'})
      }
    })
    .catch(err => {
      res.status(500).json(err.message)
    });
  };
};

function getJokes(req, res) {
  const requestOptions = {
    headers: { accept: 'application/json' },
  };

  axios
    .get('https://icanhazdadjoke.com/search', requestOptions)
    .then(response => {
      res.status(200).json(response.data.results);
    })
    .catch(err => {
      res.status(500).json({ message: 'Error Fetching Jokes', error: err });
    });
}