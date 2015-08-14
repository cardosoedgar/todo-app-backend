module.exports = function (app) {
  var express = require('express');
  var router = express.Router();

  var external = require('./external')(app); //login, register, forgot password
  var task = require('./task')(app); //add, delete, update, change list, mark done
  var list = require('./list')(app); //add, delete, update, mark all tasks done, archive

//tasks
  router.post('/task', task.addTask);
  router.put('/task/:id', task.updateTask);
  router.delete('/task/:id', task.deleteTask);

//list
  router.post('/list/:id/task', list.addTaskToList);
  router.get('/list', list.getAllLists);
  router.post('/list', list.addList);
  router.get('/list/:id', list.getList);
  router.put('/list/:id', list.updateList);
  router.delete('/list/:id', list.deleteList);


  //error if nothing else runs.
  router.get('*', function(req, res) {
    res.json({success: false, message: 'Page Not Found'});
  });

  return router;
};
