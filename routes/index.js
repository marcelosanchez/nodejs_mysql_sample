const express = require('express');
const app = express();

app.get('/', function (req, res) {
    // render to views/index.ejs template file
    res.render('index', {title: 'Node.js Express MySQL - CRUD Example'})
})

/** 
 * We assign app object to module.exports
 * 
 * module.exports exposes the app object as a module
 * 
 * module.exports should be used to return the object 
 * when this file is required in another module like app.js
 */ 
module.exports = app
