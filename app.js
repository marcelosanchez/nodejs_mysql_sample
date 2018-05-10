// express
var express = require('express')
var app = express();

// mysql
var mysql = require('mysql')

/**
 * This middleware provides a consistent API 
 * for MySQL connections during request/response life cycle
 */
// express-myconnection
var myConnection = require('express-myconnection')

/**
 * Store database credentials in a separate config.js file
 * Load the file/module and its values
 */

var config = require('./configdb')
var dbOptions = {
    host: config.database.host,
    user: config.database.user,
    password: config.database.password,
    port: config.database.port,
    database: config.database.db
}
/**
 * 3 strategies can be used
 * single: Creates single database connection which is never closed.
 * pool: Creates pool of connections. Connection is auto release when response ends.
 * request: Creates new connection per new request. Connection is auto close when response ends.
 */
app.use(myConnection(mysql, dbOptions, 'pool'));

/**
 * setting up the templating view engine
 */
app.set('view engine', 'ejs');

/**
 * import routes/index.js
 * import routes/users.js
 */

var index = require('./routes/index')
var users = require('./routes/users')

/**
 * Express Validator Middleware usado para validar formularios
 */

var expressValidator = require('express-validator');
app.use(expressValidator());

/**
 * body-parser este modulo es usado para leer informacion de HTTP POST
 * es un middleware de express que lee los inputs del form 
 * y los almacena como un objeto javascript
 */
var bodyParser = require('body-parser')

/**
 * bodyParser.urlencoded() parses the text as URL encoded data 
 * (which is how browsers tend to send form data from regular forms set to POST) 
 * and exposes the resulting object (containing the keys and values) on req.body.
 */

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

/**
 * Method Override: This module let us use HTTP verbs such as PUT or DELETE 
 * in places where they are not supported
 */
var methodOverride = require('method-override')

/**
 * using custom logic to override method
 * 
 * there are other ways of overriding as well
 * like using header & using query value
 */

app.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it
        var method = req.body._method
        delete req.body._method
        return method
    }
}))

/**
 * This module shows flash messages
 * generally used to show success or error messages
 * 
 * Flash messages are stored in session
 * So, we also have to install and use 
 * cookie-parser & session modules
 */
var flash = require('express-flash')
var cookieParser = require('cookie-parser');
var session = require('express-session')

app.use(cookieParser('keyboard cat'))
app.use(session({ 
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }
}))
app.use(flash())

// set routes
app.use('/', index)
app.use('/users', users)

app.listen(3000, function(){
    console.log('Server running at port 3000: http://127.0.0.1:3000')
})
