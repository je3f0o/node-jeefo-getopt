/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name  : gulp-requireng-concat.js
* Purpose    :
* Created at : 2015-05-15
* Updated at : 2015-09-30
* Author     : jeefo
_._._._._._._._._._._._._._._._._._._._._.*/

"use strict";

var path    = require("path"),
	getopt  = require("./lib/getopt"),
	Builder = require("./lib/builder");

var o = getopt([
	["i" , "input[+]" , "ddddddddddddd"] ,
	["D" , "process-working-directory="   , "RequireNG source directory"] ,
	["c" , "color[=COLOR]" , "ddddddddddddd"] ,
	["s" , "super" , "ddddddddddddd"] ,
	["h" , "help"  , "ddddddddddddd"]
]).parse_system();

console.log(o);
process.exit(0);

if (process.argv.length === 2) {
	console.error("Missing argv1 = directory");
	process.exit();
}
var requireng_path = path.join(process.cwd(), requireng_path, "requireng");
console.log(requireng_path);

process.exit();
console.err("Missing requireng.json file's path for gulp-requireng-concat");



	var builder = new Builder(requireng_path);
