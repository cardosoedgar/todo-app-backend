module.exports = function (app) {
  var express = require('express');
  var router = express.Router();

  var external = require('./external')(app); //login, register, forgot password
  var task = require('./task')(app); //add, delete, update, change list, mark done
  var list = require('./list')(app); //add, delete, update, mark all tasks done, archive

//tasks
  router.put('/task/:id/done', task.markTaskDone);
  router.post('/task', task.addTask);
  router.put('/task/:id', task.updateTask);
  router.delete('/task/:id', task.deleteTask);

//list
  router.put('/list/:id/done', list.markListDone);
  router.post('/list/:id/task', list.addTaskToList);
  router.post('/list', list.addList);
  router.get('/lists', list.getAllLists);
  router.get('/list/:id', list.getList);
  router.put('/list/:id', list.updateList);
  router.delete('/list/:id', list.deleteList);

//external
  router.post('/login', external.login);
  router.post('/signup', external.signup);

  //error if nothing else runs.
  router.get('*', function(req, res) {
    res.json({error: 404, message: 'Page Not Found.'});
  });

  return router;
};
