'use strict';

var test = require('tap').test;
var clip = require('./');

test('clips line', function (t) {
    var result = clip([[-10, 10], [10, 10], [10, -10]], [0, 0, 20, 20]);

    t.same(result, [[[0, 10], [10, 10], [10, 0]]]);
    t.end();
});
