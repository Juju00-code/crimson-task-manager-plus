### API Description
Crimson Tech as a way to efficiently handle task managment and reduce cost overhead is designing an in-house task management application.

### API Features:
-Tier 1 users can onboard Tier 2 and Tier 3 users 
-Authentication and Authorization JWT
Users
    -Users can view all projects they are associated with.
    -View all task associated with projects
    -View tasks related to them 
Project
    -Project managers(Tier 2) can create Project along with task
    -Each Project will be headed by a project manager
    -Each project will onboard  employees to whom the project  concern
    -Employees concerned with the project can view and track project progress
    -Employees will receive email alerts regarding projects.
Task
    -All task will be created by  project manager  and assigned to an employee associated with the project
    -All task will have a status attached to them
    -Each task in a particular state will show(task name,Assigned by, Assigned to, due date,Project affiliated to, Description,Comments and Priority of task)


### ENV Variables
PORT=4789
DOMAIN_URL 
MONGODB_URL 
SENDER_EMAIL
DOMAIN_URL
JWT_SECRET_KEY
JWT_SECRET_KEY_EXPIRY
CLIENT_DOMAIN_URL
CLOUDINARY_CLOUD_NAME 
CLOUDINARY_API_KEY 
CLOUDINARY_API_SECRET

#send emails using nodemailer
NODEMAILER_HOST
NODEMAILER_SERVICE
USER_MAIL_ID
USER_SECRET

### GIT Repo
https://github.com/Juju00-code/crimson-task-manager-plus.git
 