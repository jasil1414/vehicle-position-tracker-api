require("@babel/polyfill");
require("@babel/register");

var filename = './scripts/' + process.argv[2] + '.js'
console.log('Running script:', filename);
require(filename);