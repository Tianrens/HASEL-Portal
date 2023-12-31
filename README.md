# HASEL Portal

[![Node.js CI](https://github.com/SoftEng761-2021/project-project-team-6/actions/workflows/node.js.yml/badge.svg?branch=main)](https://github.com/SoftEng761-2021/project-project-team-6/actions/workflows/node.js.yml)
[![Node.js CD](https://github.com/SoftEng761-2021/project-project-team-6/actions/workflows/deploy.js.yml/badge.svg?branch=main)](https://github.com/SoftEng761-2021/project-project-team-6/actions/workflows/deploy.js.yml)

The Human Aspects in Software Engineering Lab (HASEL) researches projects related to improving software practices and processes, with a focus on the human aspects of software engineering. We have several high performance machine learning computers available for use in the lab. They can be accessed remotely through SSH as well.

HASEL Portal is a booking and user/workstation management system which automates much of the current manual processes involved with managing the HASEL labs.

## Features

The main features of our application will be outlined here, along with any important details attached to them.

Note: SUPERADMINs have all privileges ADMINs have and ADMINs have all privileges End Users have.

### End User (UNDERGRAD, MASTERS, POSTGRAD, PHD, NON_ACADEMIC_STAFF, ACADEMIC_STAFF, OTHER)

| Feature                | Notes                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Create Sign Up Request | <ul><li>Users will receive an email about account expiry X days before their account expires. After which their workstation account will be disabled. X can be changed in backend/.env by setting the DAYS_BEFORE_ACCOUNT_EXPIRE field to another number.</li><li>If the user already exists on the workstation, their account will not be re-created. (This also means expiration information, account lock status, user groups, and the password of the account will not be changed.) Additional changes would need to be done manually on the workstation.</li></ul> |
| Create Booking         | <ul><li>Users will not be able to login to their workstation until their booking is active.</li><li>If an ADMIN or SUPERADMIN, creates a booking, this will also create their workstation account on the host machine if they don't already have one.</li><li>Workstations are pinged every `PING_RATE` interval to check if they are online. New workstations are by default offline, until they are pinged.</li></ul>                                                                                                                                                 |
| Get Help               | <ul><li>The help page contains a PDF of the HASEL Workstation Manual.</li><li>If Users need help, they can visit the Help page to send an email to the Admins.</li></ul>                                                                                                                                                                                                                                                                                                                                                                                                |

### Admin

| Feature             | Notes                                                                                                                                                                                                                                                                                         |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Manage Workstations | <ul><li>If the host IP address changes, all user workstation accounts will be re-created on the new IP. The user accounts will not be delete on the old IP address.</li><li>If the number of GPUs gets reduced, all bookings that contained the deleted GPU(s) will be deleted too.</li></ul> |
| Manage Users        | <ul><li>Important User information can be exported into a CSV file.</li> </ul>                                                                                                                                                                                                                |
| Manage Bookings     | <ul><li>Admins can view all workstation bookings and can modify all bookings too.</li></ul>                                                                                                                                                                                                   |
| Manage Help         | <ul><li>To update the Workstation Manual, replace the Manual.PDF file in `frontend/public`. </li><li>Contact Form messages from Users will be sent to all Admins' email addresses, and will be sent from the User's email address.</li></ul>                                                  |

### Super Admin

| Feature                 | Notes                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Manage Sign Up Requests | <ul><li>Accepting a request, sends an email to the user containing their login details. Make sure the `hasel-users` group has been added to the workstation before this! This action also creates the users workstation account on the host machine.</li><li>Deleting a request, causes the corresponding user account to be removed from the workstation.</li><li>ADMINs and SUPERADMINs should not submit sign up requests. These requests should be deleted.</li><li>NON_ACADEMIC_STAFF, ACADEMIC_STAFF, ADMIN, SUPERADMIN accounts and workstation accounts will never expire, lock or be deleted or disabled by the system. They will be able to login to the workstation whenever they want. </li></ul> |

To create the initial SUPERADMIN account, sign up/login on HASEL Portal and after filling out your user details (and before submitting a workstation Sign Up Request), follow these steps:

```bash
mongosh
use <the database to connect to> # if the mongoose url is mongodb://localhost:27017/prod, 'prod' would be used here
db.users.find() # list all users
db.users.updateOne({upi: "<the upi of the user>"}, {$set: {type: "SUPERADMIN"}})
exit # or Ctrl-C
```

#### Additional Notes

- Don't try to delete anything manually from the database as this could cause errors.
- When items are deleted on the application, they are still archived and can be viewed through the database if needed.

## Project Setup

### Prerequisites

Node: v14.16.0 or a higher LTS version. (Using current 15x/16x versions may cause issues.)  
NPM: v6.14.14 or higher

Note: On a windows systems avoid using Git Bash. PowerShell or CMD are preferred.

### Installing dependencies

With npm:  
Frontend:

```bash
cd frontend
npm ci
```

Backend:

```bash
cd backend
npm ci
```

Alternatively, `npm i` can be used instead of `npm ci`.

### Running the project

Running the frontend:

```bash
cd frontend
npm start
```

Running the backend:

```bash
cd backend
npm run dev
```

### Testing the project

Before running any tests. Make sure the frontend and backend are **not** running locally. `NODE_ENV` in `backend/.env` should not be set to `production`.  
Testing the frontend:

```bash
cd frontend
npm test
```

Testing the backend:

```bash
cd backend
npm test
```

### Local MongoDB Server

To setup MongoDB locally follow this guide [here](https://docs.mongodb.com/guides/server/install/).
The [MongoDB Community Server](https://www.mongodb.com/try/download/community) is required. [MongoDB Compass](https://www.mongodb.com/try/download/compass) is recommended (but optional) for ease of testing and modifying the database.

### Environment Variables

Located under backend/.env

```bash
NODE_ENV= # production (only for production server) or development
PORT= # eg. 3001
ATLAS_URI= # eg. mongodb://localhost:27017/prod
GOOGLE_APPLICATION_CREDENTIALS="./serviceAccountKey.json"
SSH_USERNAME= # user name to ssh into workstation
SSH_PASSWORD= # corresponding password to ssh into workstation
DEFAULT_HASEL_PASSWORD= # default hasel password
PROXY_HOST= # UoA proxy host eg. 123.123.123.123
PROXY_PORT= # UoA proxy port eg. 3128
DAYS_BEFORE_ACCOUNT_EXPIRE= # How many days ahead to notify users of expiring accounts. eg. 7
EMAIL_ADDRESS= # email address used to send emails eg. deepnet@auckland.ac.nz
EMAIL_NAME= # name used to send emails eg. HASEL-Portal
EMAIL_SERVICE= # UoA email service
PING_RATE= # how often to ping workstations in minutes eg. 1
```

Restart the server after changing these values.

### Frontend Config

Config files for the frontend is stored in `frontend/src/config`.  
These files contain details for account types, default validity periods, max concurrent bookings and min/max booking durations.

A re-build will be required after changing these files.

The HASEL Workstation Manual is stored under the `/frontend/public` folder as Manual.PDF.

### Firebase

Please contact the team to retrieve details for the Google account attached to this project.

### Setting up your own Firebase project

Replace values in `frontend/src/firebase/firebaseConfig.js` with values from your firebase project. These values are safe to be hard coded, firebase domain restricts uses.

Replace the file `backend/serviceAccountKey.json` with an service account generated from your firebase project. Note this file similiar to `backend/.env` should not be made public. The service key should be named `serviceAccountKey.json`.

### Production Server Setup

Set `NODE_ENV` in `backend/.env` to `production`.

The prod server currently hosts 2 custom Github Action Runners for CI and CD. The web application should automatically deploy the main branch, if the runners are active.

#### NPM Proxy

If the server is behind a firewall. Then npm install would fail, proxy npm requests by following this [guide](https://stackoverflow.com/questions/7559648/is-there-a-way-to-make-npm-install-the-command-to-work-behind-proxy).

#### Custom Github Action Runners

These can be created on Github, more information can be found [here](https://docs.github.com/en/actions/hosting-your-own-runners/about-self-hosted-runners).  
The CI runner should have tags: `[self-hosted, linux, X64, ci]`.  
The CD runner should have tags: `[self-hosted, linux, X64, cd]`.

#### Required Packages

```text
Node/NPM
Mongod - sudo service mongod status
PM2 - sudo pm2 status <path-to-index.js>
NGINX - sudo service nginx status
```

The above packages should start automatically when our allocated server is rebooted.
To manually reboot replace `status` with `reload` or `start` in the above commands.  
 When executing the PM2 command make sure you are in the backend directory.

Note: Additional information on deploying can be found [here](https://gist.github.com/bradtraversy/cd90d1ed3c462fe3bddd11bf8953a896).

#### Modifying NGINX proxy port

```bash
sudo vim /etc/nginx/sites-available/default
# The port specified here must match the port in backend/.env.

sudo service nginx reload
```

#### Manual Deploys

In root of project run:

```bash
npm run clean
npm run build
npm start
```

### Workstation Setup

Before adding a new workstation make sure that there is a user on the workstation with username `SSH_USERNAME` and password `SSH_PASSWORD` as seen in `backend/.env`. This user must have sudo privileges/be part of the sudo user group, as all ssh commands will be executed through this user.  
On the workstation make sure the user group `hasel-users` exists.

## Contributors

| Name                | UPI     | Github Username                                             |
| :------------------ | :------ | :---------------------------------------------------------- |
| Aiden Burgess       | abur970 | [AidenBurgess](https://github.com/AidenBurgess)             |
| Alexander Bell      | abel926 | [Ham-n-jam](https://github.com/Ham-n-jam)                   |
| Leon Chin           | lchi184 | [UltimaKuma](https://github.com/UltimaKuma)                 |
| Reeve D'Cunha       | rdcu227 | [reeved](https://github.com/reeved)                         |
| Jennifer Lowe       | jlow987 | [parfei](https://github.com/parfei)                         |
| Sreeniketh Raghavan | srag400 | [SreenikethRaghavan](https://github.com/SreenikethRaghavan) |
| Tianren Shen        | tshe695 | [Tianrens](https://github.com/Tianrens)                     |
| Elisa Yansun        | eyan868 | [Milk-Yan](https://github.com/Milk-Yan)                     |
