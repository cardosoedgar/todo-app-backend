module.exports = function(app) {
  var tasksRoute = {};
  var List = app.get('models').List;
  var Task = app.get('models').Task;

  tasksRoute.addTask = function(req, res) {
      var name = req.body.name;
      if(!name || name == '') {
          res.json({sucess: false, message: 'Task name must be provided'});
          return;
      }

      List.findOne({where: {name: 'Todo'}}).then(function(list){
        Task.create({
           name: name
        }).then(function(task) {
             list.addTask(task).then(function(success) {
                res.json({success: true, message: 'Task created.', data:task });
             });
        });
    });
  };

  tasksRoute.markTaskDone = function(req, res) {
    var id = req.params.id;
    List.findOne({where: {name: 'Done'}}).then(function(list){
      Task.findOne({where: {id: id} }).then(function(task) {
          if(!task) {
            res.json({success: false, message: 'Task not found.'});
            return;
          }

          task.setList(list).then(function(success) {
             res.json({success: true, message: 'Task marked as done.', data:task });
          });
      });
    });
  };

  tasksRoute.deleteTask = function(req, res) {
     var id = req.params.id;
     Task.destroy({where: {id: id}}).then(function(success){
        if(success)
          res.json({success: true, msg:'Task deleted.'});
        else
          res.json({success: false, msg: 'Task not found.'});
     });
   };

   tasksRoute.updateTask = function(req, res) {
      var id = req.params.id;
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
           res.json({success: true, msg:'Task updated.'});
         else
           res.json({success: false, msg: 'Task not found.'});
      });
   }

  return tasksRoute;
};

//helper methods
