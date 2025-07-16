## lineclip [![Simply Awesome](https://img.shields.io/badge/simply-awesome-brightgreen.svg)](https://github.com/mourner/projects)

A very fast JavaScript library for clipping polylines and polygons by a bounding box.

- uses [Cohen-Sutherland algorithm](https://en.wikipedia.org/wiki/Cohen%E2%80%93Sutherland_algorithm) for line clipping
- uses [Sutherland-Hodgman algorithm](https://en.wikipedia.org/wiki/Sutherland%E2%80%93Hodgman_algorithm) for polygon clipping

```js
import {clipPolyline} from 'lineclip';

clipPolyline(
    [[-10, 10], [10, 10], [10, -10]], // line
    [0, 0, 20, 20]); // bbox
// returns [[[0, 10], [10, 10], [10, 0]]]
```


### API

#### clipPolyline(points, bbox[, result])

- `points` — an array of `[x, y]` points
- `bbox` — a bounding box as `[xmin, ymin, xmax, ymax]`
- `result` — an array to append the results to

Returns an array of clipped lines.

`lineclip` is an alias to `lineclip.polyline`.

#### clipPolygon(points, bbox)

Returns a clipped polygon.
