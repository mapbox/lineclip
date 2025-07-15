
import Benchmark from 'benchmark';
import {clipPolyline, clipPolygon} from './index.js';

const line = [[-10, 10], [0, 10], [10, 10], [10, 5], [10, -5], [10, -10], [20, -10], [20, 10], [40, 10],
    [40, 20], [20, 20], [20, 40], [10, 40], [10, 20], [5, 20], [-10, 20]];

const bbox = [0, 0, 30, 30];

new Benchmark.Suite()
    .add('polyline', () => {
        clipPolyline(line, bbox);
    })
    .add('polygon', () => {
        clipPolygon(line, bbox);
    })
    .on('cycle', (event) => {
        console.log(event.target.toString());
    })
    .on('error', (e) => {
        throw e.target.error;
    })
    .run();
