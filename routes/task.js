module.exports = function(app) {
  var tasksRoute = {};
  var List = app.get('models').List;
  var Task = app.get('models').Task;

  tasksRoute.markTaskUndone = function(req, res) {
    var id = req.params.taskid;

    Task.update({done: false}, {where: {id: id} }).then(function(updated){
       if(updated > 0)
          res.json({success: true, message: 'task marked undone'});
       else
          res.json({success: false, message: 'task not found'});
    });
  };

  tasksRoute.markTaskDone = function(req, res) {
    var id = req.params.taskid;
    Task.update({done: true}, {where: {id: id} }).then(function(updated){
       if(updated > 0)
          res.json({success: true, message: 'task marked as done'});
       else
          res.json({success: false, message: 'task not found'});
    });
  };

  tasksRoute.deleteTask = function(req, res) {
     var id = req.params.taskid;
     Task.destroy({where: {id: id}}).then(function(success){
        if(success)
          res.json({success: true, message:'Task deleted.'});
        else
          res.json({success: false, message: 'Task not found.'});
     });
   };

   tasksRoute.updateTask = function(req, res) {
      var id = req.params.taskid;
      var updatedName = req.body.name;
      var listId = req.body.list_id;
      var data = {};

      if(listId || listId != '')
         data.ListId = listId;

      if(updatedName && updatedName != '') {
          data.name = updatedName;
      }

      if(data == {}){
        res.json({sucess: false, message: 'Task name must be provided'});
        return;
      }

      Task.update(data, {where: {id:id}}).then(function(updated){
         if(updated > 0)
           res.json({success: true, message:'Task updated.'});
         else
           res.json({success: false, message: 'Task not found.'});
      });
   }

  return tasksRoute;
};
