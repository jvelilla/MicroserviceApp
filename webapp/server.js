var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var mongodb = require("mongodb")

var winston = require('winston');
var zmq = require('zmq')

// Zero MQ
var sock = zmq.socket('req');

function zmqService(input) {
    sock.send(input);
    logger.info("Zeromq request: "+input);
    sock.on("message", function(output) {
      logger.info("Zeromq response: "+output);
   });
}

var ObjectID = mongodb.ObjectID;

var CONTACTS_COLLECTION = "contacts";

var app = express();
app.use(express.static(__dirname + "/html"));
app.use(bodyParser.json());

var logger = new (winston.Logger)({
    transports: [
      new (winston.transports.Console)(),
      new (winston.transports.File)({ filename: 'service.log' })
    ]
  });

// Create a database variable outside of the database connection callback to reuse the connection pool in your app.
var db;
var MONGODB_URI = "YOUR_MONGODB_URI";


// Connect to the database before starting the application server.
mongodb.MongoClient.connect(MONGODB_URI, function (err, database) {
  if (err) {
    logger.error (err)
  }

  // Save database object from the callback for reuse.
  db = database;
 logger.info("Database connection ready");

  // Connect to zmq service-
  sock.connect('tcp://127.0.0.1:4000');
  logger.info ('Connected to zeromq server on port 4000');


  // Initialize the app.
  var server = app.listen(4040, function () {
    var port = server.address().port;
    logger.info ("App now running on port", port);
  });
});

// CONTACTS API ROUTES BELOW

// Generic error handler used by all endpoints.
function handleError(res, reason, message, code) {
  logger.error("ERROR: " + reason);
  res.status(code || 500).json({"error": message});
}

/*  "/contacts"
 *    GET: finds all contacts
 *    POST: creates a new contact
 */

app.get("/contacts", function(req, res) {
  db.collection(CONTACTS_COLLECTION).find({}).toArray(function(err, docs) {
    if (err) {
      handleError(res, err.message, "Failed to get contacts.");
    } else {
        // call our zmqService
      zmqService(JSON.stringify(docs));
      res.status(200).json(docs);
    }
  });
});

app.post("/contacts", function(req, res) {
  var newContact = req.body;
  newContact.createDate = new Date();

  if (!(req.body.firstName || req.body.lastName)) {
    handleError(res, "Invalid user input", "Must provide a first or last name.", 400);
  }

  db.collection(CONTACTS_COLLECTION).insertOne(newContact, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to create new contact.");
    } else {
      zmqService(JSON.stringify(doc));
      res.status(201).json(doc.ops[0]);
    }
  });
});

/*  "/contacts/:id"
 *    GET: find contact by id
 *    PUT: update contact by id
 *    DELETE: deletes contact by id
 */

app.get("/contacts/:id", function(req, res) {
  db.collection(CONTACTS_COLLECTION).findOne({ _id: new ObjectID(req.params.id) }, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to get contact");
    } else {
      zmqService(JSON.stringify(doc));
      res.status(200).json(doc);
    }
  });
});

app.put("/contacts/:id", function(req, res) {
  var updateDoc = req.body;
  delete updateDoc._id;

  db.collection(CONTACTS_COLLECTION).updateOne({_id: new ObjectID(req.params.id)}, updateDoc, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to update contact");
    } else {
      zmqService(JSON.stringify(doc));
      res.status(204).end();
    }
  });
});

app.delete("/contacts/:id", function(req, res) {
  db.collection(CONTACTS_COLLECTION).deleteOne({_id: new ObjectID(req.params.id)}, function(err, result) {
    if (err) {
      handleError(res, err.message, "Failed to delete contact");
    } else {
      zmqService(JSON.stringify(result));
      res.status(204).end();
    }
  });
});