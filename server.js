// require DateFormat for formatting date objects
var dateFormat = require('dateformat');
// require mongoose for database clarity
var mongoose = require('mongoose');
// require express for web service
var express = require("express");
// path module -- fixes path issues between macs and pc's
var path = require("path");
// Not sure what it does, but it is required.  Probably for POST requests.
var bodyParser = require('body-parser');
// Session setup if we want to use Session. remove this to disable session.
var session = require('express-session');

// Even if you choose not to use session, leave this line.
var app = express();
// Remove this if you are going to remove session.:
app.use(session({ secret: 'thisisasecret' })); // string for encryption

// This is how we connect to the mongodb database using mongoose -- "CHANGEME" is the name of
//   our db in mongodb -- this should match the name of the db you are going to use for your project.
mongoose.connect('mongodb://localhost/Wolf');

// Use native promises
mongoose.Promise = global.Promise;

var Schema = new mongoose.Schema({
    // change these to match your DB schema.
    id: { type: Number },
    name: { type: String },
    age: { type: Number },
    Birthday: { type: Date }
}, { timestamps: true })
mongoose.model('Wolf', Schema); // We are setting this Schema in our Models as 'Wolf'
var Wolf = mongoose.model('Wolf') // We are retrieving this Schema from our Models, named 'Wolf'

// setting up POST calls.
app.use(bodyParser.urlencoded({ extended: true }));
// static content
app.use(express.static(path.join(__dirname, "./static")));
// setting up ejs and our views folder
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');

//**************** Routes go here ****************
app.get("/", function(req, res) {

    res.render("index", { wolves })
});
app.get("/wolves/:id", function(req, res) {

    res.render("view", { wolf })
})
app.get("/new", function(req, res) {

    res.render("new")
})
app.post("/wolves/new", function(req, res) {

    res.redirect("/")
})
app.get('/wolves/edit/:id', function(req, res) {

    res.render("edit", { wolf })
})
app.post('/wolves/edit/:id', function(req, res) {

})
app.post('/wolves/destroy/:id', function(req, res) {

})

//****************   End Routes   ****************

// tell the express app to listen on port 8000
app.listen(8000, function() {
    console.log("listening on port 8000");
});

function insertDocument(doc, targetCollection) {
    while (1) {
        var cursor = targetCollection.find({}, { id: 1 }).sort({ id: -1 }).limit(1);
        var seq = cursor.hasNext() ? cursor.next()._id + 1 : 1;
        doc.id = seq;
        var results = targetCollection.insert(doc);
        if (results.hasWriteError()) {
            if (results.writeError.code == 11000 /* dup key */ )
                continue;
            else
                print("unexpected error inserting data: " + tojson(results));
        }
        break;
    }
}