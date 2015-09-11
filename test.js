'use strict';

var test = require('tap').test;
var clip = require('./');

test('clips line', function (t) {
    var result = clip([
        [-10, 10], [10, 10], [10, -10], [20, -10], [20, 10], [40, 10],
        [40, 20], [20, 20], [20, 40], [10, 40], [10, 20], [5, 20], [-10, 20]],
        [0, 0, 30, 30]);

    t.same(result, [
        [[0, 10], [10, 10], [10, 0]],
        [[20, 0], [20, 10], [30, 10]],
        [[30, 20], [20, 20], [20, 30]],
        [[10, 30], [10, 20], [5, 20], [0, 20]]
    ]);

    t.end();
});

test('clips line crossing through many times', function (t) {
    var result = clip(
        [[10, -10], [10, 30], [20, 30], [20, -10]],
        [0, 0, 20, 20]);

    t.same(result, [
        [[10, 0], [10, 20]],
        [[20, 20], [20, 0]]
    ]);

    t.end();
});

test('clips polygon', function (t) {
    var result = clip.polygon([
        [-10, 10], [10, 10], [10, -10], [20, -10], [20, 10], [40, 10],
        [40, 20], [20, 20], [20, 40], [10, 40], [10, 20], [5, 20], [-10, 20]],
        [0, 0, 30, 30]);

    t.same(result, [[0, 10], [10, 10], [10, 0], [20, 0], [20, 10], [30, 10],
        [30, 20], [20, 20], [20, 30], [10, 30], [10, 20], [5, 20], [0, 20]]);

    t.end();
});

test('appends result if passed third argument', function (t) {
    var arr = [];
    var result = clip([[-10, 10], [30, 10]], [0, 0, 20, 20], arr);

    t.same(result, [[[0, 10], [20, 10]]]);
    t.equal(result, arr);

    t.end();
});
