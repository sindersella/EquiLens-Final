// This index.js file is the entry point for the web application, initialising the Express server and setting up essential middleware and routes. It imports necessary modules, configures session management, and integrates the main application logic to ensure the app runs as intended.

// Import the modules we need
var express = require ('express')
var session = require("express-session");
var ejs = require('ejs')
var bodyParser= require ('body-parser')
const mysql = require('mysql');
//var session
const expressSanitizer = require('express-sanitizer');
var validator = require('express-validator');

// Create the express application object
const app = express()
const port = 8000
app.use(bodyParser.urlencoded({ extended: true }))
app.use(expressSanitizer());

// Create a session
app.use(session({
    secret: 'somerandomstuff',
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 600000
    }
}));

// Set up css
app.use(express.static(__dirname + '/public'));

// Define the database connection
const db = mysql.createConnection ({
    host: 'localhost',
    user: 'appuser',
    password: 'app2027',
    database: 'equiLens'
});
// Connect to the database
db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Connected to database');
});
global.db = db;

// Set the directory where Express will pick up HTML files
// __dirname will get the current directory
app.set('views', __dirname + '/views');

// Tell Express that we want to use EJS as the templating engine
app.set('view engine', 'ejs');

// Tells Express how we should process html files
// We want to use EJS's rendering engine
app.engine('html', ejs.renderFile);

// Define our data
var appData = {appName: "EquiLens"}

// Requires the main.js file inside the routes folder passing in the Express app and data as arguments.  All the routes will go in this file
require("./routes/main")(app, appData);

// Start the web app listening
app.listen(port, () => console.log(`Example app listening on port ${port}!`))