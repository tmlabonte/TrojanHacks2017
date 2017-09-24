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
	res.end(JSON.stringify(course));
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