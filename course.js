var express = require("express");
var path = require("path");
var request = require("request");
var cheerio = require("cheerio");
var bodyParser = require("body-parser");
var fs = require("fs");
var app = express();
var router = express.Router();
var port = 8080;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/data', function(req, res) {
	var prefix = req.body.prefix;
	var section = req.body.section;
	console.log("Prefix:" + prefix);
	console.log("Section:" + section);
		
	var courseTerm = "20173";
	var coursePrefix = prefix;
	var courseSection = section;
	
	var url = "https://classes.usc.edu/term-" + courseTerm + "/classes/" + coursePrefix + "/";

	request(url, function(err, resp, body){
		if(err) {
			console.log(err);
		}
		else {
			var $ = cheerio.load(body);
		
			var sectionId = $("." + courseSection);
			//var nameCourse = sectionId.parent("id")
			var sectionText = sectionId.children(".section").text();
			var professorText = sectionId.children(".instructor").text();
			var dayText = sectionId.children(".days").text();
			var timeText = sectionId.children(".time").text();
			//var timeArr = timeText.split("-");
			//var startTime = timeArr[0];
			//var endTime = timeArr[1];
			var typeText = sectionId.children(".type").text();
			var locationText = sectionId.children(".location").text();

		
			var course = {
				section: sectionText,
				professor: professorText,
				days: dayText,
				time: timeText,
				type: typeText,
				location: locationText
			};
			console.log(course);
		
	}
	res.writeHead(200, { 'Content-Type': 'text/html' });
	res.write(
	"<html><head><link rel='stylesheet' href='https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta/css/bootstrap.min.css' integrity='sha384-/Y6pD6FV/Vv2HJnA6t+vslU6fwYXjCFtcEpHbNJ0lyAFsXTsjBbfaDjzALeQsN6M' crossorigin='anonymous'></head><body>" + 
	"<div class='jumbotron jumbotron-fluid' style='padding-top: 0px; text-align: center;'>" +
	"<div class='card' style='width: 50rem; margin: auto; margin-top: 0px;'><div class='card-body'>" +
    "<h1 class='card-title'><b>Course Card</b></h1>" + 
    "<p class='card-text'>" +
    "<ul class='list-group list-group-flush'>" +
    "<li class='list-group-item'>" +
	"<h3>Section: " + 
	JSON.stringify(course.section) +
	"</h3></li>" + 
	"<li class='list-group-item'>" +
	"<h3>Professor: " + 
	JSON.stringify(course.professor) +
	"</h3></li>" + 
	"<li class='list-group-item'>" +
	"<h3>Days: " + 
	JSON.stringify(course.days) +
	"</h3></li>" + 
	"<li class='list-group-item'>" +
	"<h3>Time: " + 
	JSON.stringify(course.time) +
	"</h3></li>" + 
	"<li class='list-group-item'>" +
	"<h3>Type: " + 
	JSON.stringify(course.type) +
	"</h3></li>" + 
	"<li class='list-group-item'>" +
	"<h3>Location: " + 
	JSON.stringify(course.location) +
	"</h3></li>" + 
	"<a href='https://tmlabonte.github.io/TrojanHacks2017/course.html'><h4>Add more to your feed</h4></a></body>" +
	"<form><div class='form-group'>" +
	"<h3>Add Homework</h3>" +
    "<label class='form-control-label' for='hwName'>Homework Name</label>" +
    "<input type='text' class='form-control' id='hwName' placeholder='e.g. Case Memo #2'>" +
    "</div>" +
  	"<div class='form-group'>" +
    "<label class='form-control-label' for='dueDate'>Due Date</label>" +
    "<input type='text' class='form-control' id='dueDate' placeholder='e.g. 09/24/17'>" +
    "</div>" +
    "<div class='col-auto'><div class='form-check mb-2 mb-sm-0'><label class='form-check-label'><input class='form-check-input' type='checkbox'> Notify me please! </label></div></div>" +
	"<div class='col-auto'><button type='submit' class='btn btn-primary'>Submit</button></div>" +
	"</form>" +
	"</p></div></div></div>"
	);
	res.end();
});
});

app.listen(port);
console.log("server is listening on port: " + port);

/*
var destination = fs.createWriteStream("./downloads/usc.html");
request(url)
	.pipe(destination)
	.on("finish", function() {
		console.log("done");
	})
	.on("error", function(err) {
		console.log(err);
	})
*/