# Node.js Express4 MongoDB Shoutbox App

Nodejs shoutbox app

## 0. Installation from command line

## 1. Clone repository:
```shell
git clone https://github.com/pbajno/nodejs-express-shoutbox
```

## 2. Install all packages
Specified in package.json
```shell
npm install
```

## 3. Install nodemon (optionally):
This package is used for monitoring app changes
```shell
npm install -g nodemon
```

## 4. Check configuration in files:
**/config/database.js**
```js
module.exports = {
    database:'mongodb://localhost:27017/mean',
    secret:'secret123'
}
```
and

**/config/passport.js**

## 5. Run database seeder:
This also verifies database connection
```shell
node seeder
```

## 6. Run this app!
If there are no errors you can run this app!

```shell
nodemon
```

or if you don't have this package

```shell
npm start
```
And visit in your browser:

**http://localhost:3000/**

## Special thanks to

 - [NodeJS Engine](https://nodejs.org/)
 - [Express](https://expressjs.com/)
 - [MongoDB](https://www.mongodb.com/)
 - [@BradTraversy](https://github.com/bradtraversy/)
 - And authors of all npm packages for making this happen
