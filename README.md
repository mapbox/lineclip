## lineclip

[![Build Status](https://travis-ci.org/mapbox/lineclip.svg?branch=master)](https://travis-ci.org/mapbox/lineclip)
[![Coverage Status](https://coveralls.io/repos/mapbox/lineclip/badge.svg?branch=master&service=github)](https://coveralls.io/github/mapbox/lineclip?branch=master)

A very fast JavaScript library for clipping polylines and polygons (by an axis-aligned rectangle).

- uses [Cohen-Sutherland algorithm](https://en.wikipedia.org/wiki/Cohen%E2%80%93Sutherland_algorithm) for line clipping
- uses [Sutherland-Hodgeman algorithm](https://en.wikipedia.org/wiki/Sutherland%E2%80%93Hodgman_algorithm) for polygon clipping

```js
lineclip(
    [[-10, 10], [10, 10], [10, -10]], // line
    [0, 0, 20, 20]); // bbox
// returns [[[0, 10], [10, 10], [10, 0]]]
```


### API

#### polyline

```js
lineclip.polyline(points, bbox[, result])
```

- `points` — an array of `[x, y]` points
- `bbox` — a bounding box as `[xmin, ymin, xmax, ymax]`
- `result` — an array to append the results to

Returns an array of clipped lines.

`lineclip` is an alias to `lineclip.polyline`.

#### polygon

```js
lineclip.polygon(points, bbox)
```

Returns a clipped polygon.


### Changelog

#### 1.1.0 (Sep 11, 2015)

- Added Sutherland-Hodgeman polygon clipping (`lineclip.polygon`).
- 2.5 times faster line clipping.

#### 1.0.1 (Sep 11, 2015)

- Minor code cleanup and optimizations.

#### 1.0.0 (Sep 8, 2015)

- Initial release.
