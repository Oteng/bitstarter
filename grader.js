#!/usr/bin/env node
/*
Automatically grade files for the presence of specified HTML tags/attributes.
Uses commander.js and cheerio. Teaches command line application development
and basic DOM parsing.

References:

 + cheerio
   - https://github.com/MatthewMueller/cheerio
   - http://encosia.com/cheerio-faster-windows-friendly-alternative-jsdom/
   - http://maxogden.com/scraping-with-node.html

 + commander.js
   - https://github.com/visionmedia/commander.js
   - http://tjholowaychuk.com/post/9103188408/commander-js-nodejs-command-line-interfaces-made-easy

 + JSON
   - http://en.wikipedia.org/wiki/JSON
   - https://developer.mozilla.org/en-US/docs/JSON
   - https://developer.mozilla.org/en-US/docs/JSON#JSON_in_Firefox_2
*/

var fs = require('fs');
var program = require('commander');
var cheerio = require('cheerio');
var HTMLFILE_DEFAULT = "index.html";
var CHECKSFILE_DEFAULT = "checks.json";
var rest = require('restler');

//main function for runing the program
var checkIfUrl = function(arg, arg2) {
    if (/http/i.test(arg)) {
	return getDataFromUrl(arg,  fs.readFileSync(assertFileExists(arg2)));

    }else{
	var checkJson = checkHtmlFile(fs.readFileSync(assertFileExists(arg)), fs.readFileSync(assertFileExists(arg2)));
	var outJson = JSON.stringify(checkJson, null, 4);
	console.log(outJson);


    }
};


//asy for downloading and processing files
var getDataFromUrl = function(url, checkCont) {
    rest.get(url).on('complete',function(data) {
	if(data instanceof Error) {
	    console.log("url error");
	    process.exit(1);
	}else {
	    var checkJson = checkHtmlFile(data, checkCont);
	    var outJson = JSON.stringify(checkJson, null, 4);
	    console.log(outJson);

	}

    });
};

//check if file exsit
var assertFileExists = function(infile) {
    var instr = infile.toString();
    if(!fs.existsSync(instr)) {
	console.log("%s does not exist. Exiting.", instr);
	process.exit(1); // http://nodejs.org/api/process.html#process_process_exit_code
    }
    return instr;
};


var cheerioHtmlFile = function(htmlfile) {
    return cheerio.load(htmlfile);
};

var loadChecks = function(checksfile) {

    return JSON.parse(checksfile);
};

//get the arg pass in from the commmand line
var getArg = function(arg){
    return arg;
};

//process files
var checkHtmlFile = function(htmlfile, checksfile) {
    $ = cheerioHtmlFile(htmlfile);
    var checks = loadChecks(checksfile).sort();
    var out = {};
    for(var ii in checks) {
	var present = $(checks[ii]).length > 0;
	out[checks[ii]] = present;
    }
    return out;
};

var clone = function(fn) {
    // Workaround for commander.js issue.
    // http://stackoverflow.com/a/6772648
    return fn.bind({});
};

if(require.main == module) {
    program
	.option('-c, --checks <check_file>', 'Path to checks.json', clone(getArg), CHECKSFILE_DEFAULT)
	.option('-f, --file <html_file>', 'Path to index.html', clone(getArg),HTMLFILE_DEFAULT)
	.parse(process.argv);

    checkIfUrl(program.file, program.checks);
} else {
    exports.checkHtmlFile = checkHtmlFile;
}
