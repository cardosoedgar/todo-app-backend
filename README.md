# Todo App Backend (Node.js)

## Public URLs

*POST* **/login** - email and password

*POST* **/signup** - email, password and name (optional)

## Private URLs (need x-access-token)

*PUT* **/api/resetpassword** - old_password, new_password, confirm_password

#### Task URLs

*POST* **/api/task** - name

*PUT* **/api/task/:id** - name and/or list_id

*DELETE* **/task/:id**

*PUT* **/task/:id/done**

#### List URLs

*POST* **/api/list** - name

*POST* **/api/list/:id/task** - name

*GET* **/api/lists**

*GET* **/api/list/:id**

*PUT* **/api/list/:id** - name

*DELETE* **/api/list:id**

*PUT* **/api/list/:id/done**

*PUT* **/api/lists/sync**
