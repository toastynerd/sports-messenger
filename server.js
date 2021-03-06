'use strict';

const morgan = require('morgan');
const express = require('express');
const mongoose = require('mongoose');
const Promise = require('bluebird');
const createError = require('http-errors');
const debug = require('debug')('home:server');
const cors = require('cors');

const handleError = require('./backend/lib/error-handler');
const authRouter = require('./backend/routes/auth-router');
const commentRouter = require('./backend/routes/comment-router');
const parkRouter = require('./backend/routes/park-router');

const app = express();
const port = process.env.PORT || 3000;
const mongoDbUri = process.env.MONGODB_URI || 'mongodb://localhost/home';
process.env.APP_SECRET = 'secret';

mongoose.Promise = Promise;
mongoose.connect(mongoDbUri);

app.use(express.static(`${__dirname}/build`));
require('./backend/lib/park-data')();

app.use(morgan('dev'));
app.use(cors());

app.use('/api', authRouter);
app.use('/api', commentRouter);
app.use('/api/parks', parkRouter);

app.all('*', function(req, res, next){
  debug('Got error: 404');
  next(createError(404, `ERROR: ${req.method} :: ${req.url} is not a route`));
});

app.use(handleError);

app.listen(port, function(){
  console.log(`Server up on ${port}`);
  debug(`server up :: ${port}`);
});
