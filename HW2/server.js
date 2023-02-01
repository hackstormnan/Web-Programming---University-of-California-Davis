// server.js
// where your node app starts

// init project
const express = require("express");
const app = express();

const fs = require("fs");
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Multer is a module to read and handle FormData objects, on the server side
const multer = require("multer");

// Make a "storage" object that explains to multer where to store the images...in /images
let storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, __dirname + "/images");
  },
  // keep the file's original name
  // the default behavior is to make up a random string
  filename: function(req, file, cb) {
    cb(null, file.originalname);
  }
});

// Use that storage object we just made to make a multer object that knows how to
// parse FormData objects and store the files they contain
let uploadMulter = multer({
  storage: storage
});

// First, server any static file requests
app.use(express.static("public"));

// Next, serve any images out of the /images directory
app.use("/images", express.static("images"));

// Next, if no path is given, assume we will look at the postcard creation page
app.get("/", function(request, response) {
  response.sendFile(__dirname + "/public/creator.html");
});

// Next, handle post request to upload an image
// by calling the "single" method of the object uploadMulter that we made above
app.post("/upload", uploadMulter.single("newImage"), function(
  request,
  response
) {
  // file is automatically stored in /images
  // WARNING!  Even though Glitch is storing the file, it won't show up
  // when you look at the /images directory when browsing your project
  // until later (or unless you open the console (Tools->Terminal) and type "refresh").
  // So sorry.
  console.log(
    "Recieved",
    request.file.originalname,
    request.file.size,
    "bytes"
  );
  // the file object "request.file" is truthy if the file exists
  if (request.file) {
    console.log(request.file);
    // Always send HTTP response back to the browser.  In this case it's just a quick note.
    response.end("Server recieved " + request.file.originalname);
  } else throw "error";
});

//receive postcard JSON from the client side
//write the JSON data into a file
app.post("/sharePostcard", function(request, response) {
  let json = JSON.stringify(request.body);
  console.log(json);
  fs.writeFileSync("postcardData.json", json, function(err) {
    if (err) return console.log(err);
  });
  response.end();
});

app.get("/list", function(request, response) {
  let list = fs.readFileSync("postcardData.json");
  response.json(JSON.parse(list));
});

// listen for HTTP requests :)
var listener = app.listen(process.env.PORT, function() {
  console.log("Your app is listening on port " + listener.address().port);
});

//for localhost testing
// var listener = app.listen(3000, function () {
//     console.log('Your app is listening on port ' + listener.address().port);
// });
