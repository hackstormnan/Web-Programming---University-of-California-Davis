// server.js
// where your node app starts

// include modules
const express = require("express");
const multer = require("multer");
const bodyParser = require("body-parser");
const fs = require("fs");
const FormData = require("form-data");
const sql = require("sqlite3").verbose();
const db = new sql.Database("postcard.db");
let filename;
let filepath;
let cmd_query;


let cmd =
  " SELECT name FROM sqlite_master WHERE type='table' AND name='PostcardTable' ";

db.get(cmd, function(err, val) {
  console.log(err, val);
  if (val == undefined) {
    console.log("No database file - creating one");
    createTable();
  } else {
    console.log("Database file found");
  }
});

function createTable() {
  const cmd =
    "CREATE TABLE PostcardTable ( rowIdNum INTEGER PRIMARY KEY,string_id TEXT, image TEXT , color TEXT , filename TEXT, font TEXT, message TEXT)";
  db.run(cmd, function(err, val) {
    if (err) {
      console.log("Database creation failure", err.message);
    } else {
      console.log("Created database");
    }
  });
}

let storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, __dirname + "/images");
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname);
  }
});
let upload = multer({ storage: storage });

const app = express();

app.use(express.static("public"));

app.use("/images", express.static("images"));

app.get("/", function(request, response) {
  response.sendFile(__dirname + "/public/creator.html");
});


app.post("/upload", upload.single("newImage"), function(request, response) {
  console.log(
    "Recieved",
    request.file.originalname,
    request.file.size,
    "bytes"
  );
  filepath = "/images/" + request.file.originalname;
  filename = request.file.originalname;
  if (request.file) {
    sendMediaStore(filepath, request, response);
  }
});

function sendMediaStore(filename, serverRequest, serverResponse) {
  let apiKey = process.env.ECS162KEY;
  if (apiKey === undefined) {
    serverResponse.status(400);
    serverResponse.send("No API key provided");
  } else {
    let form = new FormData();
    form.append("apiKey", apiKey);
    form.append("storeImage", fs.createReadStream(__dirname + filename));
    form.submit("http://ecs162.org:3000/fileUploadToAPI", function(
      err,
      APIres
    ) {
      if (APIres) {
        console.log("API response status", APIres.statusCode);
        let body = "";
        APIres.on("data", chunk => {
          body += chunk;
        });
        APIres.on("end", () => {
          if (APIres.statusCode != 200) {
            serverResponse.status(400); 
            serverResponse.send(" Media server says: " + body);
          } else {
            serverResponse.status(200);
            serverResponse.send(body);
          }
          fs.unlink(filename.substring(1));
        });
      } else {
        serverResponse.status(500); 
        serverResponse.send("Media server seems to be down.");
      }
    });
  }
}

app.use(bodyParser.json());

app.post("/saveDisplay", function(req, res, next) {
  let image = req.body.image;
  let color = req.body.color;
  let font = req.body.font;
  let message = req.body.message;
  let string_id = req.body.string_id;

  cmd =
    "INSERT INTO PostcardTable ( image, color, font, message,string_id,filename) VALUES (?,?,?,?,?,?) ";
  db.run(cmd, image, color, font, message, string_id, filename, function(
    err
  ) {
    if (err) {
      console.log("DB insert error", err.message);
      next();
    } else {
      let newId = this.lastID; 
      res.send(string_id);
    }
  }); 
});

app.get("/display", function(req, res, next) {
  console.log(req.query.id);

  cmd_query =
    "SELECT * FROM PostcardTable WHERE string_id =" + "'" + req.query.id + "'";
  db.all(cmd_query, function(err, rows) {
    if (err) {
      console.log("Database reading error", err.message);
      next();
    } else {
      res.json(rows);
    }
  });
});

// listen for requests 
var listener = app.listen(process.env.PORT, function() {
  console.log("Your app is listening on port " + listener.address().port);
});

