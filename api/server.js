const express = require('express')
const helmet = require('helmet')
const cors = require('cors')
const session = require('express-session');
const apiRouter = require('./api-router');
const morgan = require('morgan');

const server = express();

server.use(session({
  name: 'chocolatechip',
  secret: 'keep it secret',
  cookie: {
    maxAge: 1000 * 60 * 60,
    secure: false,
    httpOnly: false,
  },
  resave: false,
  saveUninitialized: false
}));

server.use(express.json());
server.use(helmet());
server.use(cors({credentials: true, origin: true}));
server.use(morgan('dev'));

server.use('/api', apiRouter);

server.use('*', (req, res) => {
  res.status(200).json({
    api: "UP"
  });
});

module.exports = server;