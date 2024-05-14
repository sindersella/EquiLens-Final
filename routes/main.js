// This is the main.js file that sets up various routes for the Express application, handling requests for different pages like home, user, rankings, and platforms. It also includes middleware for user session validation, search functionality, and interactions with a MySQL database for retrieving and displaying platform rankings.

module.exports = function(app, appData) {
    //allows for request to be used 
    const request = require('request');

    //allows for axios to be used
    const axios = require('axios');

    // all routes within main.js would be able to access this
    const redirectLogin = (req, res, next) => {
        // checking to see if the a session has been created for the user
        if (!req.session.userId ) {
            // if not, redirecting to the login page
            res.redirect('./login')
        } 
        // if so, application will keep running
        else { next (); }
    }

    //included BCrypt to programme
    const bcrypt = require('bcrypt');
    const saltRounds = 10;

    // added here so all routes can access it: validate email 
    const { check, validationResult} = require('express-validator');

    // Handle our routes
    app.get('/',function(req,res){
        res.render('index.ejs', appData)
    });

    // Home page when logged in
    app.get('/user',function(req,res){
        res.render('loggedin.ejs', appData)
    });

    //renders about page
    app.get('/about',function(req,res){
        res.render('about.ejs', appData);
    });

    //renders search page
    app.get('/search',function(req,res){
        res.render("search.ejs", appData);
    });

    // renders contact page
    app.get('/contact',function(req,res){
        res.render('contact.ejs', appData)
    });

    // renders contact page when logged in
    app.get('/contact-user',function(req,res){
        res.render('contact-user.ejs', appData)
    });

    //renders all platforms page
    app.get('/platforms', redirectLogin, function(req,res){
        res.render('platforms.ejs', appData);
    });

    ///////////////////////////////////// list and search clinics and users in database //////////////////////////////////////////

    //search through rankings table to find query.
    app.get('/search-result', redirectLogin, function (req, res) {
        let keyword = req.sanitize(req.query.keyword);
        let sqlquery = "SELECT * FROM rankings WHERE issue LIKE '%" + keyword + "%'";
        console.log(sqlquery);
        // execute sql query
        db.query(sqlquery, (err, result) => {
            if (err) {
                res.redirect('./'); 
            } else {
                let newData = Object.assign({}, appData, { platformRating: result, keyword: keyword });
                console.log(newData);
                res.render("rankings.ejs", newData);
            }
        });        
    });
    
    //lists the rankings in the database for platforms page
    app.get('/list', redirectLogin, function(req, res) {
        let platform = req.query.platform ? decodeURIComponent(req.query.platform) : '';
        let sqlquery = platform ? "SELECT * FROM rankings WHERE platform = ?" : "SELECT * FROM rankings";
        db.query(sqlquery, [platform], (err, result) => {
            if (err) {
                res.redirect('./'); 
            }
            let newData = Object.assign({}, appData, {platformRating: result, selectedPlatform: platform});
            res.render("rankings.ejs", newData);
        });
    });      
    
    
///////////////////////////////////////////  registering for an account  //////////////////////////////////////////////////

    //renders register page
    app.get('/register', function (req,res) {
        res.render('register.ejs', appData);                                                                     
    });  
                                                                                               
    app.post('/registered', [check('email').isEmail()], [check('password').not().notEmpty().isLength({ min: 8 }).withMessage('Password is required')], 
    function (req, res){
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.send('<a href='+'./register'+'>Password length is too short - min 8 characters. Please try again.</a>') }
        else { 
            // saving data in database
            //this takes the password from the user, hashes it and stores it into the table user_details
            const plainPassword = req.sanitize(req.body.password);
            const saltRounds = 10;
            bcrypt.hash(plainPassword, saltRounds, function (err, hashedPassword) {
                // Stores hashed password in your database.
                if (err) {
                    return err.stack;
                }

                // saving data in database
                let sqlquery = "INSERT INTO user_details (username, firstname, lastname, email, hashedPassword) VALUES (?,?,?,?,?)";
                // execute sql query
                let newrecord = [req.sanitize(req.body.username), req.sanitize(req.body.first), req.sanitize(req.body.last), req.sanitize(req.body.email), hashedPassword];
                db.query(sqlquery, newrecord, (err, result) => { 
                    if (err) {
                        //display error message here if username is taken
                        console.error("duplicate error pending... "+ err.message)
                        res.send("Username or registered email is already taken. "+  '<a href='+'./register'+'> Try again.</a>');
                    }
                    else {
                        //prints message to confirm registration with hashed password.
                        result = 'Hello '+ req.sanitize(req.body.first) + ' '+ req.sanitize(req.body.last) +'! You are now registered with us.\n We will send an email to you at ' + req.sanitize(req.body.email) + '.\n Your password is: '+ req.sanitize(req.body.password) +'.\n Your hashed password is: '+ hashedPassword;
                        console.log(result);
                        //res.send(result + '<a href='+'./'+'>Home page</a>');
                        res.redirect(301, '/');
                    }
                })    
            });
        };                                                                      
    }); 


    ///////////////////////////////////////////////// Log in and account ////////////////////////////////////////////////////
    // login page route
    app.get('/login', (req, res) => { 
        res.render('login.ejs', appData) 
    });
    // logging in user
    app.post('/loggedin', (req, res) => {
        //checks if user exists
        let username = req.sanitize(req.body.username).trim();
        let sqlquery = "SELECT username, Hashedpassword FROM user_details WHERE username = ? ";
        db.query(sqlquery, username, (err, result) => {
            if (err) console.log(err.message);
            
            else if (result.length === 0) res.send("User" + username + " doesn't exists. If you want you can register with it." + '<a href='+'./register'+'>Register page</a>')
            else {
                hashedPassword = result[0].Hashedpassword;
                console.log(hashedPassword);
                // Compare the password supplied with the password in the database
                bcrypt.compare(req.sanitize(req.body.password), hashedPassword, function (err, result) {
                    if (err) res.send(err.message);
                    else if (result) {
                        // Save user session here, when login is successful
                        req.session.userId = username;
                        console.log(req.body.username + " has logged in successfully!")
                        res.redirect('/user');
                    }
                    else {
                        res.send('<a href='+'./login'+'>Incorrect password. Please try again.</a>')
                    }
                });
            }
        });
    });

    // logging out 

    app.get('/logout', redirectLogin, (req,res) => {
        req.session.destroy(err => {
        if (err) {
          return res.redirect('./')
        }
        console.log('you are now logged out. <a href='+'./'+'>Home</a>');
        res.redirect(301, '/');
        })
    })

}