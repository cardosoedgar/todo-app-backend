module.exports = function (app) {
  var express = require('express');
  var router = express.Router();

  var external = require('./external')(app); //login, register, forgot password
  var internal = require('./internal')(app);
  var task = require('./task')(app); //add, delete, update, change list, mark done
  var list = require('./list')(app); //add, delete, update, mark all tasks done, archive

//external
  router.post('/login', external.login);
  router.post('/signup', external.signup);

//////// API REQUESTS ///////////
//internal
  router.post('/api/resetpassword', internal.updatePassword);

//list
  router.put('/api/list/:id/task/:taskid', task.updateTask);
  router.delete('/api/list/:id/task/:taskid', task.deleteTask);
  router.put('/api/list/:id/task/:taskid/undone', task.markTaskUndone);
  router.put('/api/list/:id/task/:taskid/done', task.markTaskDone);
  router.put('/api/list/:id/undone', list.markListUndone);
  router.put('/api/list/:id/done', list.markListDone);
  router.post('/api/list/:id/task', list.addTaskToList);
  router.post('/api/list', list.addList);
  router.get('/api/lists', list.getAllLists);
  router.get('/api/list/:id', list.getList);
  router.put('/api/list/:id', list.updateList);
  router.delete('/api/list/:id', list.deleteList);
  router.post('/api/lists/sync', list.syncLists);

  //error if nothing else runs.
  router.get('*', function(req, res) {
    res.status(404);
    res.json({success: false, message: 'Page Not Found.'});
  });

  return router;
};
