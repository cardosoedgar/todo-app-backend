module.exports = function(app) {
  var tasksRoute = {};
  var List = app.get('models').List;
  var Task = app.get('models').Task;

  tasksRoute.addTask = function(req, res) {
      var name = req.body.name;
      List.findOne({where: {name: 'Todo'}}).then(function(list){
        Task.create({
           name: name
        }).then(function(task) {
            if(task) {
               list.addTask(task).then(function(success) {
                  res.json({success: true, message: 'Task created.', data:task });
               });
            } else {
               res.json({success: false, message: 'An error ocurred. Try again later.'});
             }
        }).catch(function(err){
            res.json({success: false, message: err});
        });
    });
  };

  tasksRoute.markTaskDone = function(req, res) {
    var id = req.params.id;
    List.findOne({where: {name: 'Done'}}).then(function(list){
      Task.findOne({where: {id: id} }).then(function(task) {
          if(task) {
             task.setList(list).then(function(success) {
                res.json({success: true, message: 'Task marked as done.', data:task });
             });
          } else {
             res.json({success: false, message: 'An error ocurred. Try again later.'});
           }
      }).catch(function(err){
          res.json({success: false, message: err});
      });
    });
  };

  tasksRoute.deleteTask = function(req, res) {
     var id = req.params.id;

     Task.destroy({where: {id: id}}).then(function(success){
        if(success) {
          res.json({success: true, msg:'Task deleted.'});
        } else {
          res.json({success: false, msg: 'Task not found.'});
        }
     });
   };

   tasksRoute.updateTask = function(req, res) {
      var id = req.params.id;
      var updatedName = req.body.name;

      Task.update({name: updatedName}, {where: {id:id}}).then(function(updated){
         if(updated) {
           res.json({success: true, msg:'Task updated.'});
         } else {
           res.json({success: false, msg: 'Task not found.'});
         }
      });
   }

  return tasksRoute;
};

//helper methods
