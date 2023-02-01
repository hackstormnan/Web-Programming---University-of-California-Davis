// We need many modules

// some of the ones we have used before
const express = require('express');
const bodyParser = require('body-parser');
const assets = require('./assets');
const sqlite3 = require('sqlite3').verbose();  // we'll need this later
const multer = require('multer');
const fs = require('fs');
const FormData = require("form-data");
const request = require("request");


// and some new ones related to doing the login process
const passport = require('passport');
// There are other strategies, including Facebook and Spotify
const GoogleStrategy = require('passport-google-oauth20').Strategy;

// Some modules related to cookies, which indicate that the user
// is logged in
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');

// Setup passport, passing it information about what we want to do
passport.use(new GoogleStrategy(
  // object containing data to be sent to Google to kick off the login process
  // the process.env values come from the key.env file of your app
  // They won't be found unless you have put in a client ID and secret for 
  // the project you set up at Google
  {
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  callbackURL: 'https://ylx-laf-project.glitch.me/auth/accepted',  
  userProfileURL: 'https://www.googleapis.com/oauth2/v3/userinfo', // where to go for info
  scope: ['profile', 'email']  // the information we will ask for from Google
},
  // function to call to once login is accomplished, to get info about user from Google;
  // it is defined down below.
  gotProfile));


// Start setting up the Server pipeline
const app = express();
console.log("setting up pipeline")

// take HTTP message body and put it as a string into req.body
app.use(bodyParser.urlencoded({extended: true}));

// puts cookies into req.cookies
app.use(cookieParser());

// pipeline stage that echos the url and shows the cookies, for debugging.
app.use("/", printIncomingRequest);

// Now some stages that decrypt and use cookies

// express handles decryption of cooikes, storage of data about the session, 
// and deletes cookies when they expire
app.use(expressSession(
  { 
    secret:'bananaBread',  // a random string used for encryption of cookies
    maxAge: 6 * 60 * 60 * 1000, // Cookie time out - six hours in milliseconds
    // setting these to default values to prevent warning messages
    resave: true,
    saveUninitialized: false,
    // make a named session cookie; makes one called "connect.sid" as well
    name: "ecs162-session-cookie"
  }));

// Initializes request object for further handling by passport
app.use(passport.initialize()); 

// If there is a valid cookie, will call passport.deserializeUser()
// which is defined below.  We can use this to get user data out of
// a user database table, if we make one.
// Does nothing if there is no cookie
app.use(passport.session()); 



// The usual pipeline stages

// Public files are still serverd as usual out of /public
app.get('/*',express.static('public'));

// special case for base URL, goes to index.html
app.get('/', function(req, res) {
  res.sendFile(__dirname + '/public/login.html');
});

// Glitch assests directory 
app.use("/assets", assets);

// stage to serve files from /user, only works if user in logged in

// If user data is populated (by deserializeUser) and the
// session cookie is present, get files out 
// of /user using a static server. 
// Otherwise, user is redirected to public splash page (/index) by
// requireLogin (defined below)
app.get('/user/*', requireUser, requireLogin, express.static('.'));




// Now the pipeline stages that handle the login process itself

// Handler for url that starts off login with Google.
// The app (in public/index.html) links to here (note not an AJAX request!)
// Kicks off login process by telling Browser to redirect to Google.
app.get('/auth/google', passport.authenticate('google'));
// The first time its called, passport.authenticate sends 302 
// response (redirect) to the Browser
// with fancy redirect URL that Browser will send to Google,
// containing request for profile, and
// using this app's client ID string to identify the app trying to log in.
// The Browser passes this on to Google, which brings up the login screen. 


// Google redirects here after user successfully logs in. 
// This second call to "passport.authenticate" will issue Server's own HTTPS 
// request to Google to access the user's profile information with the  	
// temporary key we got from Google.
// After that, it calls gotProfile, so we can, for instance, store the profile in 
// a user database table. 
// Then it will call passport.serializeUser, also defined below.
// Then it either sends a response to Google redirecting to the /setcookie endpoint, below
// or, if failure, it goes back to the public splash page. 
app.get('/auth/accepted', 
  passport.authenticate('google', 
    { successRedirect: '/setcookie', failureRedirect: '/?email=notUCD' }
  )
);

// One more time! a cookie is set before redirecting
// to the protected homepage
// this route uses two middleware functions.
// requireUser is defined below; it makes sure req.user is defined
// the second one makes a public cookie called
// google-passport-example
app.get('/setcookie', requireUser,
  function(req, res) {
    // if(req.get('Referrer') && req.get('Referrer').indexOf("google.com")!=-1){
      // mark the birth of this cookie
  
      // set a public cookie; the session cookie was already set by Passport
      res.cookie('google-passport-example', new Date());
      
      if (req.user.userData == 1) {
        res.redirect('/user/home.html');
      } else {
        res.redirect("/?email=notUCD");
      }
      
    //} else {
    //   res.redirect('/');
    //}
  }
);


// currently not used
// using this route, we can clear the cookie and close the session
app.get('/user/logoff',
  function(req, res) {
    // clear both the public and the named session cookie
    res.clearCookie('google-passport-example');
    res.clearCookie('ecs162-session-cookie');
    res.redirect('/');
  }
);


// listen for requests :)
var listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});


// Some functions called by the handlers in the pipeline above


// Function for debugging. Just prints the incoming URL, and calls next.
// Never sends response back. 
function printIncomingRequest (req, res, next) {
    console.log("Serving",req.url);
    if (req.cookies) {
      console.log("cookies",req.cookies)
    }
    next();
}

// function that handles response from Google containint the profiles information. 
// It is called by Passport after the second time passport.authenticate
// is called (in /auth/accepted/)
function gotProfile(accessToken, refreshToken, profile, done) {
    console.log("Google profile",profile);
    // here is a good place to check if user is in DB,
    // and to store him in DB if not already there. 
    // Second arg to "done" will be passed into serializeUser,
    // should be key to get user out of database.
    console.log("GET EMAIL:"+profile.emails[0].value);
    let getEmail = profile.emails[0].value;
    let dbRowID = 1;  // temporary! Should be the real unique
    // key for db Row for this user in DB table.
    // Note: cannot be zero, has to be something that evaluates to
    // True.  
    if (getEmail.endsWith("ucdavis.edu")) {
      console.log("UCDAVIS YES");
    } else {
      console.log("UCDAVIS NO");
      dbRowID = 2;
      request.get('https://accounts.google.com/o/oauth2/revoke', {
        qs:{token: accessToken }},  function (err, res, body) {
        console.log("revoked token");
        });
    }

    done(null, dbRowID); 
}


// Part of Server's sesssion set-up.  
// The second operand of "done" becomes the input to deserializeUser
// on every subsequent HTTP request with this session's cookie. 
// For instance, if there was some specific profile information, or
// some user history with this Website we pull out of the user table
// using dbRowID.  But for now we'll just pass out the dbRowID itself.
passport.serializeUser((dbRowID, done) => {
    console.log("SerializeUser. Input is",dbRowID);
    done(null, dbRowID);
});

// Called by passport.session pipeline stage on every HTTP request with
// a current session cookie (so, while user is logged in)
// This time, 
// whatever we pass in the "done" callback goes into the req.user property
// and can be grabbed from there by other middleware functions
passport.deserializeUser((dbRowID, done) => {
    console.log("deserializeUser. Input is:", dbRowID);
    // here is a good place to look up user data in database using
    // dbRowID. Put whatever you want into an object. It ends up
    // as the property "user" of the "req" object. 
    let userData = {userData: dbRowID};
    done(null, userData);
});

function requireUser (req, res, next) {
  console.log("require user",req.user);
  console.log("REQUIRE USER:", req.user.userData);
  if (!req.user) {
    res.redirect('/');
  } else {
    console.log("user is",req.user);
    next();
  }
};

function requireLogin (req, res, next) {
  console.log("checking:",req.cookies);
  if (!req.cookies['ecs162-session-cookie']) {
    res.redirect('/');
  } else {
    next();
  }
};


// DB
// CREATE DB
const db = new sqlite3.Database("test2.db", (err) => {
  if(err) {
    console.log(err.message);
  } else {
    console.log("DB connected");
  }
});

function create_table(){
  let cmd = "CREATE TABLE userTable (id INTEGER PRIMARY KEY, type TEXT, title TEXT, category TEXT, description TEXT, img TEXT, date TEXT, location TEXT)";
  db.run(cmd, function (err) {
    if(err) {
      console.log(err.message);
    } else {
      console.log("Table created");
    }
  });
}

let cmd = "SELECT name FROM sqlite_master WHERE type='table' AND name='userTable'";
db.get(cmd, function(err, val) {
  if(val == undefined) {
    create_table();
  } else {
    console.log("Found table userTable");
  }
});

app.get('/checkdb', function (req, res, next){
  let cmd = "SELECT * FROM userTable";
  db.all(cmd, function(err, rows){
    if(err){next();}
    else {res.json(rows); console.log(rows);}
  });
});

// app.use(express.json());
app.post('/finderInsert', function (req, res, next) {
  console.log("POST: finderInsert");
  console.log(req.body);
  let cmd = "INSERT INTO userTable (type, title, category, description, img, date, location) VALUES (?,?,?,?,?,?,?)";
  db.run(cmd, "finder", req.body.title, req.body.category, req.body.description, req.body.attachment, req.body.date+" "+ req.body.time, req.body.location, function(err){
    if(err) {console.log(err.message);next();}
    else {res.send("ADDED"); console.log("ADDED:"+this.lastID);}
  });
  
});

app.post('/seekerInsert', function (req, res, next) {
  console.log("POST: seekerInsert");
  console.log(req.body);
  let cmd = "INSERT INTO userTable (type, title, category, description, img, date, time, location) VALUES (?,?,?,?,?,?,?,?)";
  db.run(cmd, "seeker", req.body.title, req.body.category, req.body.description, req.body.attachment, req.body.date+" "+req.body.time, req.body.location, function(err){
    if(err) {console.log(err.message);next();}
    else {res.send("ADDED"); console.log("ADDED:"+this.lastID);}
  });
  
});

// db.run("DROP TABLE userTable");
app.get('finderGet', function (req, res, next){
  console.log("GET: finderGet");
  console.log(req.body);
  let date1 = req.query.date1;
  let date2 = req.query.date2;
  let category = req.query.category;
  // let time1 = req.query.time1;
  // let time2 = req.query.time2;
  if(category == ''){
    let cmd = "SELECT * FROM userTable WHERE date>= "+ date1 + " AND date<=" + date2 + " AND type='finder'";
    db.all(cmd, function(err, rows){
      if(err){console.log(err.message); next();}
      else {res.json(rows); console.log(rows);}
    });
  }else {
    let cmd = "SELECT * FROM userTable WHERE date>= "+ date1 + " AND date<=" + date2 + " AND type='finder' AND category="+category;
    db.all(cmd, function(err, rows){
      if(err){console.log(err.message); next();}
      else {res.json(rows); console.log(rows);}
    });
  }
});

app.get('/seekerGet', function (req, res, next){
  console.log("GET: seekerGet");
  console.log(req.body);
  let date1 = req.query.date1;
  let date2 = req.query.date2;
  let category = req.query.category;
  if(category == ''){
    let cmd = "SELECT * FROM userTable WHERE date>= "+ date1 + " AND date<=" + date2 + " AND type='seeker'";
    db.all(cmd, function(err, rows){
      if(err){console.log(err.message); next();}
      else {res.json(rows); console.log(rows);}
    });
  }else {
    let cmd = "SELECT * FROM userTable WHERE date>= "+ date1 + " AND date<=" + date2 + " AND type='seeker' AND category="+category;
    db.all(cmd, function(err, rows){
      if(err){console.log(err.message); next();}
      else {res.json(rows); console.log(rows);}
    });
  }
  
});

app.get('/testAll', function (req, res, next){
  console.log("GET: testAll");
  let date1 = req.query.date1;
  let date2 = req.query.date2;
  console.log("date1:"+date1);
  console.log("date2:"+date2);
  let cmd = "SELECT * FROM userTable WHERE date>= "+ date1 + " AND date<=" + date2;
  db.all(cmd, function(err, rows){
    if(err){console.log(err.message); next();}
    else {res.json(rows); console.log(rows);}
  });
});


app.get('/allGet', function (req, res, next){
  console.log("GET: allGet");
  console.log(req.body);
  let date1 = req.query.date1;
  let date2 = req.query.date2;
  let time1 = req.query.time1;
  let time2 = req.query.time2;
  let combine1 = "'"+date1 + " " + time1+"'";
  let combine2 = "'"+date2 + " " + time2+"'";
  console.log("combine1:" + combine1);
  console.log("combine2:" + combine2);
  let category = req.query.category;
  if(category == ''){
    let cmd = "SELECT * FROM userTable WHERE date>= "+ combine1 + " AND date<=" + combine2;
    db.all(cmd, function(err, rows){
      if(err){console.log(err.message); next();}
      else {res.json(rows); console.log(rows);}
    });
  }else {
    let cmd = "SELECT * FROM userTable WHERE date>= "+ combine1 + " AND date<=" + combine2 + " AND category="+category;
    db.all(cmd, function(err, rows){
      if(err){console.log(err.message); next();}
      else {res.json(rows); console.log(rows);}
    });
  }
});

let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, __dirname+'/images')    
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})

let upload = multer({storage: storage});

// Also serve static files out of /images
app.use("/images",express.static('images'));

// Next, the the two POST AJAX queries
let filename = ""
// Handle a post request to upload an image. 
app.post('/upload', upload.single('newImage'), function (request, response) {
  console.log("Recieved",request.file.originalname,request.file.size,"bytes")
  if(request.file) {
    // file is automatically stored in /images, 
    // even though we can't see it. 
    // We set this up when configuring multer
    filename = '/images/'+request.file.originalname;
    console.log("newfile name:"+filename);
    response.end("recieved "+request.file.originalname);
    // sendMediaStore(filename, request, response);
    // fs.unlink(filename.replace("/images/","images/"), (err) => {
    // if(err){console.log("ERROR DELETE:"+ err.message);}
    // else {console.log("DELETE SUCCESS");}
    // });
  }
  else throw 'error';
});

// fire off the file upload if we get this "GET"
app.get("/sendUploadToAPI", function(request, response){
  console.log("uploadtoAPI filename:"+filename);
  sendMediaStore(filename, request, response);
  fs.unlink(filename.replace("/images/","images/"), (err) => {
    if(err){console.log("ERROR DELETE:"+ err.message);}
    else {console.log("DELETE SUCCESS");}
  });
});

// function called when the button is pushed
// handles the upload to the media storage API
function sendMediaStore(filename, serverRequest, serverResponse) {
  let apiKey = process.env.ECS162KEY;
  if (apiKey === undefined) {
    serverResponse.status(400);
    serverResponse.send("No API key provided");
  } else {
    // we'll send the image from the server in a FormData object
    let form = new FormData();
    
    // we can stick other stuff in there too, like the apiKey
    form.append("apiKey", apiKey);
    // stick the image into the formdata object
    form.append("storeImage", fs.createReadStream(__dirname + filename));
    // and send it off to this URL
    form.submit("http://ecs162.org:3000/fileUploadToAPI", function(err, APIres) {
      // did we get a response from the API server at all?
      if (APIres) {
        // OK we did
        console.log("API response status", APIres.statusCode);
        // the body arrives in chunks - how gruesome!
        // this is the kind stream handling that the body-parser 
        // module handles for us in Express.  
        let body = "";
        APIres.on("data", chunk => {
          body += chunk;
        });
        APIres.on("end", () => {
          // now we have the whole body
          if (APIres.statusCode != 200) {
            serverResponse.status(400); // bad request
            serverResponse.send(" Media server says: " + body);
          } else {
            serverResponse.status(200);
            serverResponse.send(body);
          }
        });
      } else { // didn't get APIres at all
        serverResponse.status(500); // internal server error
        serverResponse.send("Media server seems to be down.");
      }
    });
  }
}




// Google map api start
// USE REVERSE GEOCODING TO GET ADDRESS
// SEE https://developers.google.com/maps/documentation/geocoding/intro#reverse-example
app.get("/getAddress", (req, res) => {
  let url = "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + req.query.lat + ", " + req.query.lng + "&key="
  + process.env.API_KEY;
  console.log(url);
  request(url, { json: true }, (error, response, body) => {
    if (error) { return console.log(error); }
    res.json(body);
  });
})

// USE KEYWORDS TO FIND ADDRESS
// SEE https://developers.google.com/places/web-service/search#find-place-examples
app.get("/searchAddress", (req, res) => {
  // LOCATION BIAS
  var url = "https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=" + req.query.input
  + "&inputtype=textquery&fields=photos,formatted_address,name,rating,opening_hours,geometry&locationbias=circle:100000@38.5367859,-121.7553711&key="
  + process.env.API_KEY;
  request(url, { json: true }, (error, response, body) => {
    if (error) { return console.log(error); }
    res.json(body);
  });
})


// Google map api end

