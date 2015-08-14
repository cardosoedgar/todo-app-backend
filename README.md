# Todo App Backend (Node.js)

## Properties

**Task Properties** : name

**List Properties** : name

## URLs

#### Task URLs

*POST* **/task** - create task in default list (Todo)

*PUT* **/task/:id** - update task name

*DELETE* **/task/:id** - delete task

*PUT* **/task/:id/done** - mark task as done (change task to done list)

#### List URLs

*POST* **/list** - create list

*POST* **/list/:id/task** - create task in the chosen List

*GET* **/lists** - get all lists with all tasks

*GET* **/list/:id** - get tasks of the list

*PUT* **/list/:id** - update list name

*DELETE* **/list:id** - delete list and all of its tasks

*PUT* **/list/:id/done** - mark all tasks inside the list as done (change tasks to done list)
