import test from 'node:test';
import assert from 'node:assert/strict';
import {clipPolyline, clipPolygon} from './index.js';

test('clips line', () => {
    const result = clipPolyline([
        [-10, 10], [10, 10], [10, -10], [20, -10], [20, 10], [40, 10],
        [40, 20], [20, 20], [20, 40], [10, 40], [10, 20], [5, 20], [-10, 20]
    ], [0, 0, 30, 30]);

    assert.deepEqual(result, [
        [[0, 10], [10, 10], [10, 0]],
        [[20, 0], [20, 10], [30, 10]],
        [[30, 20], [20, 20], [20, 30]],
        [[10, 30], [10, 20], [5, 20], [0, 20]]
    ]);
});

test('clips line crossing through many times', () => {
    const result = clipPolyline([[10, -10], [10, 30], [20, 30], [20, -10]], [0, 0, 20, 20]);

    assert.deepEqual(result, [
        [[10, 0], [10, 20]],
        [[20, 20], [20, 0]]
    ]);
});

test('clips polygon', () => {
    const result = clipPolygon([
        [-10, 10], [0, 10], [10, 10], [10, 5], [10, -5], [10, -10], [20, -10],
        [20, 10], [40, 10], [40, 20], [20, 20], [20, 40], [10, 40], [10, 20], [5, 20], [-10, 20]
    ], [0, 0, 30, 30]);

    assert.deepEqual(result, [[0, 10], [0, 10], [10, 10], [10, 5], [10, 0], [20, 0], [20, 10], [30, 10],
        [30, 20], [20, 20], [20, 30], [10, 30], [10, 20], [5, 20], [0, 20]]);
});

test('appends result if passed third argument', () => {
    const arr = [];
    const result = clipPolyline([[-10, 10], [30, 10]], [0, 0, 20, 20], arr);

    assert.deepEqual(result, [[[0, 10], [20, 10]]]);
    assert.equal(result, arr);
});

test('clips floating point lines', () => {
    const line = [
        [-86.66015624999999, 42.22851735620852], [-81.474609375, 38.51378825951165], [-85.517578125, 37.125286284966776],
        [-85.8251953125, 38.95940879245423], [-90.087890625, 39.53793974517628], [-91.93359375, 42.32606244456202],
        [-86.66015624999999, 42.22851735620852]];

    const bbox = [-91.93359375, 42.29356419217009, -91.7578125, 42.42345651793831];

    const result = clipPolyline(line, bbox);

    assert.deepEqual(result, [[
        [-91.91208030440808, 42.29356419217009],
        [-91.93359375, 42.32606244456202],
        [-91.7578125, 42.3228109416169]
    ]]);
});

test('preserves line if no protrusions exist', () => {
    const result = clipPolyline([[1, 1], [2, 2], [3, 3]], [0, 0, 30, 30]);

    assert.deepEqual(result, [[[1, 1], [2, 2], [3, 3]]]);
});

test('clips without leaving empty parts', () => {
    const result = clipPolyline([[40, 40], [50, 50]], [0, 0, 30, 30]);

    assert.deepEqual(result, []);
});

test('still works when polygon never crosses bbox', () => {
    const result = clipPolygon([[3, 3], [5, 3], [5, 5], [3, 5], [3, 3]], [0, 0, 2, 2]);

    assert.deepEqual(result, []);
});
