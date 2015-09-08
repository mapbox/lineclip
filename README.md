## lineclip

[![Build Status](https://travis-ci.org/mapbox/lineclip.svg?branch=master)](https://travis-ci.org/mapbox/lineclip)

A fast Cohen-Sutherland line clipping algorithm implementation. Given a LineString and a bounding box, outputs an array of LineStrings.

```js
var result = clip([[-10, 10], [10, 10], [10, -10]], [0, 0, 20, 20]);
// [[[0, 10], [10, 10], [10, 0]]]
```

### Changelog

#### 1.0.0 (Sep 8, 2015)

- Initial release.
