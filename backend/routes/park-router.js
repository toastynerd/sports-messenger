'use strict';

const Router = require('express').Router;
const createError = require('http-errors');
const jsonParser = require('body-parser').json();
const debug = require('debug')('note:list-router');
const ErrorHandler = require('../lib/error-handler');

const Park = require('../model/park');
const Comment = require('../model/comment');

let parkRouter = module.exports = exports = new Router();

parkRouter.post('/', jsonParser, function(req, res, next){
  debug('POST /api/park');
  if (!req.body.name) return next(createError(400, 'ERROR: park requires name field'));
  if (!req.body.location.xpos || !req.body.location.ypos) return(createError(400, 'ERROR: park requires location'));
  //once again, try to rely on the mongoose validation methods
  new Park(req.body).save().then(park => {
    res.json(park);
  }).catch(ErrorHandler(409, next, 'Data already exists in database'));
});

parkRouter.get('/', function(req,res,next){
  debug('GET /api/park/');
  Park.find({})
    .then(parks => res.send(parks)).catch(next);
    //might want to make this a single line, makes your code look a little more clean imho
});

parkRouter.get('/data', function(req, res, next) {
  require('../lib/park-data')();
  res.json('Please Work, ' + new Date());
});

parkRouter.get('/:id', function(req,res,next){
  debug('GET /api/park/:id');
  Park.findOne({_id: req.params.id})
    .populate('comments')
    .then( park => res.send(park))
    .catch( err => next(createError(404, err.message)));
});

parkRouter.put('/:id', jsonParser, function(req, res, next){
  debug('PUT /api/list/:id');
  Park.findOneAndUpdate( {_id: req.params.id}, req.body)
    .then( park => res.send(park))
    .catch(next);
});


parkRouter.delete('/:id', jsonParser, function(req, res, next){
  let result;
  debug('PUT /api/park/:id');
  //once again these seems a little convoluted
  //you can probably do the same action in a single .then statement
  Park.findOneAndRemove({_id: req.params.id})
    .then( park => {
      result = park;
      return Comment.remove({parkId: park._id});
    })
    .then(() => {
      res.json(result);
    })
    .catch(next);
});
