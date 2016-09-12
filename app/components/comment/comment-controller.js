'use strict';

module.exports = function(app) {
  app.controller('CommentController', ['$log', '$http', '$scope', CommentController]);

  function CommentController($log, $http) {
    this.comments = [];
    this.getAllComments = function() {
      $log.debug('commentCtrl.getAllComments');
      $http.get(this.baseUrl + '/comments', this.config)
        .then((res) => {
          $log.log('commentCtrl.getAllComments res.data', res.data);
          this.comments = res.data;
        }, (err) => {
          $log.error('error in commentCtrl.getAllComments', err);
        });
    };

    this.deleteComment = function(comment) {
      $log.debug('commentCtrl.deleteComment');
      $http.delete(this.baseUrl + '/comments/' + comment._id, this.config)
        .then((res) => {
          this.comments.splice(this.comments.indexOf(comment), 1);
          $log.log('commentCtrl.deleteComment res', res);
        }, (err) => {
          $log.error('error in commentCtrl.deleteComment', err);
        });
    };

    this.createComment = function(comment) {
      $log.debug('commentCtrl.createComment');
      comment.parkId = this.park._id;
      $http.post(this.baseUrl + '/comments', comment, this.config)
        .then((res) => {
          $log.log('successfully created comment', res.data);
          this.comments.push(res.data);
          this.park.comments.push(res.data);
        })
        .catch((err) => {
          $log.error('error in commentCtrl.createComment', err);
        });
    };
  }
};