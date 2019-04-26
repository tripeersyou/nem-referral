# ReferNEM

**Author:** Francis Oliver Avancena

CS 189: Special Topics in Business Computing

---
## Installation

This web application runs on Node.js please install the latest version of Node.js [here](https://nodejs.org/en/download) for your own platform.

* Clone the repository

```
git clone https://github.com/tripeersyou/nem-referral.git
```

* Go into the folder

```
cd nem-referral
```

* Create your own .env file from .env.dist and place a value for the `SESSON_SECRET` environment variable, the value can be anything.

```
cp .env.dist .env
```

* Install the npm packages

```
npm install
```

* Run the application

```
npm start
```

* The application should run on port 8000 or a default port specified by the `PORT` environment variable. A message like below will show if there are no errors.

```
Server started on port 8000
```

---

## Notes

* This application does not have any validation for the addresses so make sure that the address that will be put in will are valid.
* There are also no pop ups or error notifications currently implemented in the system.