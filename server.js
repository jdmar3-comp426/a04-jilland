// Define app using express
var express = require("express")
var app = express()
// Require database SCRIPT file
var db = require('./database.js')

// Require md5 MODULE
var md5 = require("md5")

// Make Express use its own built-in body parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Set server port
var HTTP_PORT = 5000

// Start server
app.listen(HTTP_PORT, () => {
    console.log("Server running on port %PORT%".replace("%PORT%",HTTP_PORT))
});
// READ (HTTP method GET) at root endpoint /app/
app.get("/app/", (req, res, next) => {
    res.json({"message":"Your API works! (200)"});
	res.status(200);
});

// Define other CRUD API endpoints using express.js and better-sqlite3

// CREATE a new user (HTTP method POST) at endpoint /app/new/
app.post("/app/new/user", (req, res) => {	
	var data = {
		user: req.body.user,
		pass: req.body.pass ? md5(req.body.pass) : null
	}
	const stmt = db.prepare("INSERT INTO userinfo (user, pass) VALUES (?, ?)");
	const info = stmt.run(data.user, data.pass);
	res.status(201).json({"message":info.changes+" record created: ID "+info.lastInsertRowid+ " (201)"});

});

// given in template
// READ a list of all users (HTTP method GET) at endpoint /app/users/
app.get("/app/users", (req, res) => {	
	const stmt = db.prepare("SELECT * FROM userinfo").all();
	res.status(200).json(stmt);
});

// READ a single user (HTTP method GET) at endpoint /app/user/:id
app.get("/app/user/:id", (req, res) => {	
	const stmt = db.prepare("SELECT * FROM userinfo WHERE id = ?").get(req.params.id);
	res.json(stmt);
	res.status(200);
});

// UPDATE a single user (HTTP method PATCH) at endpoint /app/update/user/:id
app.patch("/app/update/user/:id", (req, res) => {
	var data = {
		user: req.body.user,
		pass: req.body.pass ? md5(req.body.pass) : null
	}
	const stmt = db.prepare("UPDATE userinfo SET user = COALESCE(?, user), pass = COALESCE(?, pass) WHERE id = ?");
	const info = stmt.run(data.user, data.pass);
	res.status(201).json({"message":info.changes+" record created: ID "+info.lastInsertRowid+ " (201)"});


});

// DELETE a single user (HTTP method DELETE) at endpoint /app/delete/user/:id
app.delete("/app/delete/user/:id", (req, res) => {
	const stmt = db.prepare("DELETE * FROM userinfo WHERE id = ?");
	res.json(stmt);
	res.status(200);
});

// Default response for any other request
app.use(function(req, res){
	res.json({"message":"Your API is working!"});
    res.status(404);
});
