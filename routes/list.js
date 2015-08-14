module.exports = function(app) {
    var listRoute = {};
    var Task = app.get('models').Task;
    var List = app.get('models').List;

    listRoute.getAllLists = function(req, res){
       List.findAll().then(function(lists) {
          res.json({success: true, data: lists});
       });
    };

    listRoute.getList = function(req, res){
       var id = req.params.id;
       List.findOne({id: id}).then(function(list){
         if(list) {
           list.getTasks().then(function(tasks){
              res.json({success: true, data: tasks});
           });
         }
       });
    };

    listRoute.addTaskToList = function(req, res) {
        var listId = req.params.id;
        var taskName = req.body.name;

        List.findOne({where: {id:listId}}).then(function(list){
          Task.create({name: taskName}).then(function(task) {
            list.addTask(task).then(function(teste){
               console.log(teste);
            });
          });
        });
    };

    listRoute.addList = function(req, res){
        var name = req.body.name;

        List.create({
           name: name
        }).then(function(list) {
            if(list) {
               res.json({success: true, message: 'List created.', data:list });
            } else {
               res.json({success: false, message: 'An error ocurred. Try again later.'});
            }
        }).catch(function(err){
            res.json({success: false, message: err.errors[0].message});
        });
    };

    listRoute.deleteList = function(req, res) {
       var id = req.params.id;

       List.destroy({where: {id: id}}).then(function(success){
          if(success) {
            res.json({success: true, msg:'List deleted.'});
          } else {
            res.json({success: false, msg: 'List not found.'});
          }
       });
     };

     listRoute.updateList = function(req, res) {
        var id = req.params.id;
        var updatedName = req.body.name;

        List.update({name: updatedName}, {where: {id:id}}).then(function(updated){
           if(updated) {
             res.json({success: true, msg:'List updated.'});
           } else {
             res.json({success: false, msg: 'List not found.'});
           }
        });
     }

    return listRoute;
};
