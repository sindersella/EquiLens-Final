module.exports = function(app, shopData) {
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
        res.render('index.ejs', shopData)
    });

    // Home page when logged in
    app.get('/user',function(req,res){
        res.render('loggedin.ejs', shopData)
    });

    //renders about page
    app.get('/about',function(req,res){
        res.render('about.ejs', shopData);
    });

    //renders search page
    app.get('/search',function(req,res){
        res.render("search.ejs", shopData);
    });

    ///////////////////////////////////// list and search clinics and users in database //////////////////////////////////////////

    //search through Clinics table to find nearest vet to user's postcode.
    app.get('/search-result', redirectLogin, function (req, res) {
        let sqlquery = "SELECT * FROM clinics WHERE postcode LIKE '%" + req.sanitize(req.query.keyword) + "%' LIMIT 1"; // this query searches through the clinics by postcode.
        console.log(sqlquery);
        // execute sql query
        db.query(sqlquery, (err, result) => {
            if (err) {
                res.redirect('./'); 
            }
            let newData = Object.assign({}, shopData, {nearestClinic:result});
            console.log(newData)
            res.render("list.ejs", newData)
         });        
    });

    //lists the clinics in the database
    app.get('/list', redirectLogin, function(req, res) {
        let sqlquery = "SELECT * FROM clinics"; // query database to get all the books
        // execute sql query
        db.query(sqlquery, (err, result) => {
            if (err) {
                res.redirect('./'); 
            }
            let newData = Object.assign({}, shopData, {nearestClinic:result});
            console.log(newData)
            res.render("list.ejs", newData)
         });
    });

    // list of the users page
    app.get('/listusers', redirectLogin, (req, res) => {
        let sqlquery = "SELECT firstname, lastname, username, email FROM user_details"; // query database to get all the users
        //this query takes the list of users from the table user_details
        db.query(sqlquery, (err, result) => {
            if (err) {
                res.redirect('./');
            }
            let newData = Object.assign({}, shopData, {users: result});
            console.log(newData);
            res.render("listusers.ejs", newData)
        });
    });

///////////////////////////////////////// Extra content - APIs //////////////////////////////////////////////

    //renders map page

    app.get('/map',function(req,res){
        res.render('map.ejs', shopData);
    });

    // Getting and rendering the form users will input the weather
    app.get('/weather', function(req, res) {
        res.render('weather.ejs', shopData);
    })

    //Loading the results of the OpenWeather map API
    app.post('/weather-results', [check('city').not().notEmpty()], function(req, res) {  
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.redirect('./weather'); }
        else { 
            let apiKey = 'bf288062cfc9308448e190da1c496b1d';
            // Variable will get the city name inputted by the user
            let city = req.sanitize(req.body.city);
            console.log("this is the city: " + city);
            let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
        
            request(url, function (err, response, body) {
                if(err){
                  console.log('error:', error);
                } else {
                  //res.send(body);
                  var weather = JSON.parse(body)
                  console.log(weather);
                  var wmsg = 'It is '+ weather.main.temp + 
                     ' degrees in '+ weather.name +
                     '! <br> The humidity now is: ' + 
                     weather.main.humidity +
                     '. <br> The weather description now is: ' + weather.weather[0].description +
                     '. <br> The wind speed now is: ' + weather.wind.speed;
                  res.send (wmsg + '<br><br> <a href='+'./user'+'>Home page</a>');            
                } 
            });  
        }
    }); 


///////////////////////////////////////////  registering for an account  //////////////////////////////////////////////////

    //renders register page
    app.get('/register', function (req,res) {
        res.render('register.ejs', shopData);                                                                     
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


    ///////////////////////////////////////////////// Log in and account deletion  ////////////////////////////////////////////////////
    // login page route
    app.get('/login', (req, res) => { 
        res.render('login.ejs', shopData) 
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

     // delete user page route
     app.get('/deleteuser', redirectLogin, (req, res) => { 
        res.render('deleteusers.ejs', shopData) 
    });
    // deleting the user
    app.post('/deleteuser', (req, res) => {
        let sqlquery = 'DELETE from user_details WHERE username = ? '
        const deleteUser = req.sanitize(req.body.username);
        console.log(deleteUser);

        db.query(sqlquery, deleteUser, (err, result) => {
            if (err){
                console.log(err.message)
            }
            
            // checks if an empty set is returned
            else if (result.affectedRows == 0){
                //error message
                res.send("User '" + deleteUser + "' not found. "+  '<a href='+'./deleteuser'+'> Try again.</a>');
            }
            else {
                console.log("user sucessfully deleted!");
                req.session.destroy(err => {
                    if (err) {
                      return res.redirect('./')
                    }
                    res.send('you are now logged out. <a href='+'./'+'>Home</a>');
                    })
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