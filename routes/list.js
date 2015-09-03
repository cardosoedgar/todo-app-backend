module.exports = function(app) {
    var listRoute = {};
    var Task = app.get('models').Task;
    var List = app.get('models').List;

    listRoute.getAllLists = function(req, res) {
       var userId = req.credentials.userId;
       List.findAll({
         where: {userId: userId},
         include: [{model: Task, attributes:['id','name']}],
         order: [['name','ASC']]
       }).then(function(lists) {
          res.json({success:true, lists:lists});
       });
    };

    listRoute.getList = function(req, res) {
       var userId = req.credentials.userId;
       var id = req.params.id;
       List.findOne({
         where: {id: id, userId: userId},
         include: [{model: Task, attributes:['id','name']}]
       }).then(function(list){
           if(list)
              res.json({sucess:true, list: list});
           else
              res.json({sucess:false, message: 'List not found.'});
       });
    };

    listRoute.addTaskToList = function(req, res) {
        var userId = req.credentials.userId;
        var listId = req.params.id;
        var taskName = req.body.name;

        if(!taskName || taskName == '') {
            res.json({sucess: false, message: 'Task name must be provided'});
            return;
        }

        List.findOne({where: {id:listId, userId: userId}}).then(function(list){
          if(!list) {
            res.json({sucess: false, message: 'List not found.'});
            return;
          }

          Task.create({name: taskName}).then(function(task) {
            list.addTask(task).then(function(log){
                res.json({success: true, message: 'Task added to list.'});
            });
          });
        });
    };

    listRoute.addList = function(req, res){
        var userId = req.credentials.userId;
        var name = req.body.name;

        if(!name || name == '') {
            res.json({sucess: false, message: 'Task name must be provided'});
            return;
        }

        List.create({
           name: name,
           userId: userId
        }).then(function(list) {
             res.json({success: true, message: 'List created.', list:list });
        }).catch(function(err) {
             res.json({success: false, message: 'List already exists.'});
        });
    };

    listRoute.deleteList = function(req, res) {
       var userId = req.credentials.userId;
       var id = req.params.id;
       List.findOne({where: {id:id, userId: userId}}).then(function(list){
         if(!list) {
            res.json({success: false, message: 'List not found.'});
            return;
          }

          Task.destroy({where: {listId:list.id}}).then(function(success){
              list.destroy().then(function(success){
                  res.json({success: true, message:'List deleted.'});
              });
          });
       });
     };

     listRoute.updateList = function(req, res) {
        var userId = req.credentials.userId;
        var id = req.params.id;
        var updatedName = req.body.name;
        List.update({name: updatedName}, {where: {id:id, userId: userId}}).then(function(updated) {
           if(update > 0)
              res.json({success: true, message:'List updated.'});
           else
              res.json({sucess: false, message: 'List not found.'});
        });
     };

     listRoute.markListDone = function(req, res) {
        var userId = req.credentials.userId;
        var id = req.params.id;
        List.findOne({where: {name: 'Done', userId: userId}}).then(function(list){
          if(!list) {
            res.json({sucess: false, message: 'List not found.'});
            return;
          }

          Task.update({ListId: list.id}, {where: {ListId: id}}).then(function(updated) {
              res.json({success: true, message: 'All tasks marked as done.'});
          });
        });
     };

     listRoute.syncLists = function(req, res) {
        var userId = req.credentials.userId;
        var lists = req.body.lists;
        var sequelize = app.get('models').sequelize;

        //TODO ajeitar essa transcation
        return sequelize.transaction(function(t){
          lists.forEach(function(list){
               return List.findOrCreate({where: { name: list.name, userId: userId}, transcation: t}).spread(function(data, created){
                 list.Tasks.forEach(function(task){
                     return Task.findOrCreate({where: {name: task.name, ListId: data.id},transcation: t});
                 });
               });
          });
        }).then(function(success){
            listRoute.getAllLists(req,res);
        }).catch(function(err) {
            listRoute.getAllLists(req,res);
        });
     };

    return listRoute;
};
