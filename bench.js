'use strict';

var Suite = require('benchmark').Suite;
var lineclip = require('./');

var line = [[-10, 10], [10, 10], [10, -10], [20, -10], [20, 10], [40, 10],
    [40, 20], [20, 20], [20, 40], [10, 40], [10, 20], [5, 20], [-10, 20]];

var bbox = [0, 0, 30, 30];

new Suite()
.add('lineclip', function () {
    lineclip(line, bbox);
})
.on('cycle', function(event) {
    console.log(event.target.toString());
})
.on('error', function(err) {
    console.log(err);
})
.run();
