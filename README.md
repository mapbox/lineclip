## lineclip

[![Build Status](https://travis-ci.org/mapbox/lineclip.svg?branch=master)](https://travis-ci.org/mapbox/lineclip)
[![Coverage Status](https://coveralls.io/repos/mapbox/lineclip/badge.svg?branch=master&service=github)](https://coveralls.io/github/mapbox/lineclip?branch=master)

A very fast JavaScript library for clipping polylines and polygons (by an axis-aligned rectangle). Implements:

- [Cohen-Sutherland algorithm](https://en.wikipedia.org/wiki/Cohen%E2%80%93Sutherland_algorithm) for line clipping
- [Sutherland-Hodgeman algorithm](https://en.wikipedia.org/wiki/Sutherland%E2%80%93Hodgman_algorithm) for polygon clipping

```js
var result = lineclip([[-10, 10], [10, 10], [10, -10]], [0, 0, 20, 20]);
// [[[0, 10], [10, 10], [10, 0]]]
```

### API

- `lineclip.polyline(points, bbox[, result])`:
given a line (an array of `[x, y]`) points and a bounding box (`[xmin, ymin, xmax, ymax]`),
clip it and return an array of lines. If given a `result` array, append output to it.
- `lineclip.polygon(points, bbox)`: given a polygon as an array of points, clip it and return the clipped polygon.
- `lineclip(...)`: alias to `lineclip.polyline`.

### Changelog

#### 1.1.0 (Sep 11, 2015)

- Added Sutherland-Hodgeman polygon clipping (`lineclip.polygon`).
- 2.5 times faster line clipping.

#### 1.0.1 (Sep 11, 2015)

- Minor code cleanup and optimizations.

#### 1.0.0 (Sep 8, 2015)

- Initial release.
