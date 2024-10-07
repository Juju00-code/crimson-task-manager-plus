### API Description
Crimson Tech as a way to efficiently handle task managment and reduce cost overhead is designing an in-house task management application.

### ENV Variables
PORT
MONGODB_URL 
SENDER_EMAIL
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
 

 In order to use to Crimson Task Manager Plus greatly depends privilege level which on this api is known applicationRole. These privileges are numbers attached to each user during onboarding which are 1,2 and 3 

 ### applicationRole 1 :
 -These users are have capabilities of applicationRole 3 but are the only user with capabilities to onboard new members on app and view all projects on app
-applicationRole 1 can login,logout,belong/track projects and tasks

### applicationRole 2:
-These users usually are project managers responsible for seeing projects to a desired end
-These users can
       - login,
        -logout,
        -belong/track projects and tasks
         -create projects, 
         -add members to projects, 
         -remove members from projects,
         -view a specific project,
        -view all projects they belong on, 
        -change status of project to the follow(pending,active,completed and decativated),
        -create task,
        -assign task to assignees and assigneeQA,
        -update task,
        -signoff on the completion of task.

### applicationRole3
-These are majority of the application users who will perform numerous task
    -login,
    -logout,
    -belong/track projects and tasks
    -view a specific project,
    -view all projects they belong on,
    -A user of this kind as an assignee on the task can accept and submit  a task ones their services done
    this enables the task moves through the various states(Pending,In Progress,Assingee Comp, In QA review, QA Review Comp, Complete)

### Project
A Project can be described as a team set out to achieve a goal. A project can be charaterized by
Project name 
Project manager in charge of the project
Status(pending,active,completed and decativated)
Numerous task 
Team members of different skill set

### Task 
A task is activity need to be performed to gradually allow a project realise its goal. A task is characterized by 
-A unique task on the project
-A project manager as the assigner of the task
-A team member to accomplish the task as an assingee
-A QA to review standard of the completed task
-The project manager to sign off completion of the task
-A task details can be updated only 
-accept and submit
-A task always in a state of (Pending,In Progress,Assignee Comp, In QA Review, QA Review Comp)

### API setup
-Ensure node is installed on local device.
-Setup environment variables as stated above.
-npm install to dowload dependencies
-In terminal "npm run dev" to run application