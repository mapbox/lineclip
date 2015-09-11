## lineclip

[![Build Status](https://travis-ci.org/mapbox/lineclip.svg?branch=master)](https://travis-ci.org/mapbox/lineclip)
[![Coverage Status](https://coveralls.io/repos/mapbox/lineclip/badge.svg?branch=master&service=github)](https://coveralls.io/github/mapbox/lineclip?branch=master)

A fast [Cohen-Sutherland line clipping algorithm](https://en.wikipedia.org/wiki/Cohen%E2%80%93Sutherland_algorithm) implementation.
Given a LineString and a bounding box, outputs an array of LineStrings.

```js
var result = clip([[-10, 10], [10, 10], [10, -10]], [0, 0, 20, 20]);
// [[[0, 10], [10, 10], [10, 0]]]
```

### Changelog

#### 1.0.1 (Sep 11, 2015)

- Minor code cleanup and optimizations.

#### 1.0.0 (Sep 8, 2015)

- Initial release.
