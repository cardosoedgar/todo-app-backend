module.exports = function(app) {
    var listRoute = {};
    var Task = app.get('models').Task;
    var List = app.get('models').List;

    listRoute.getAllLists = function(req, res){
       List.findAll({
         include: [{model: Task, attributes:['id','name']}]
       }).then(function(lists) {
          res.json({success:true, lists:lists});
       })
    };

    listRoute.getList = function(req, res){
       var id = req.params.id;
       List.findOne({
         where: {id: id},
         include: [{model: Task, attributes:['id','name']}]
       }).then(function(list){
           if(list)
              res.json({sucess:true, list: list});
           else
              res.json({sucess:false, message: 'List not found.'});
       });
    };

    listRoute.addTaskToList = function(req, res) {
        var listId = req.params.id;
        var taskName = req.body.name;

        if(!taskName || taskName == '') {
            res.json({sucess: false, message: 'Task name must be provided'});
            return;
        }

        List.findOne({where: {id:listId}}).then(function(list){
          if(list) {
            Task.create({name: taskName}).then(function(task) {
              list.addTask(task).then(function(log){
                  res.json({success: true, message: 'Task added to list.'});
              });
            });
          } else {
             res.json({sucess: false, message: 'List not found.'});
          }
        });
    };

    listRoute.addList = function(req, res){
        var name = req.body.name;

        if(!name || name == '') {
            res.json({sucess: false, message: 'Task name must be provided'});
            return;
        }

        List.create({
           name: name
        }).then(function(list) {
             res.json({success: true, message: 'List created.', data:list });
        }).catch(function(err){
             res.json({success: false, message: err.errors[0].message});
        });
    };

    listRoute.deleteList = function(req, res) {
       var id = req.params.id;
       //delete tasks in list then delete the list itself
       List.findOne({where: {id:id}}).then(function(list){
         if(list) {
            Task.destroy({where: {listId:list.id}}).then(function(success){
                list.destroy().then(function(success){
                    res.json({success: true, message:'List deleted.'});
                });
            });
          } else {
            res.json({success: false, message: 'List not found.'});
          }
       });
     };

     listRoute.updateList = function(req, res) {
        var id = req.params.id;
        var updatedName = req.body.name;
        List.update({name: updatedName}, {where: {id:id}}).then(function(updated) {
             if(update > 0)
                res.json({success: true, message:'List updated.'});
             else
                res.json({sucess: false, message: 'List not found.'});
        });
     };

     listRoute.markListDone = function(req, res) {
        var id = req.params.id;
        List.findOne({where: {name: 'Done'}}).then(function(list){
          if(list) {
            Task.update({ListId: list.id}, {where: {ListId: id}}).then(function(updated) {
                res.json({success: true, message: 'All tasks marked as done.'});
            });
          } else {
            res.json({sucess: false, message: 'List not found.'});
          }
        });
     };

    return listRoute;
};
