'use strict';

module.exports = lineclip;

function lineclip(points, bbox, result) {
    var len = points.length,
        codeA = bitCode(points[0], bbox),
        part = [];

    if (!result) result = [];

    for (var i = 0; i < len - 1; i++) {

        var a = points[i],
            b = points[i + 1],
            codeB = bitCode(b, bbox);

        if (!(codeA | codeB)) { // trivial accept
            part.push(a);

        } else if (codeA & codeB) { // trivial reject
            codeA = codeB;
            continue;

        } else if (codeA) { // segment goes inside
            part.push(intersect(a, b, codeA, bbox));

            // and outside too
            if (codeB) part.push(intersect(a, b, codeB, bbox));

        } else { // segment goes outside
            part.push(a);
            part.push(intersect(a, b, codeB, bbox));

            if (i < len - 2) {
                result.push(part);
                part = [];
            }
        }

        codeA = codeB;
    }

    result.push(part);

    return result;
}

function intersect(a, b, edge, bbox) {
    return edge & 8 ? [a[0] + (b[0] - a[0]) * (bbox[3] - b[0]) / (b[1] - b[0]), bbox[3]] :
           edge & 4 ? [a[0] + (b[0] - a[0]) * (bbox[1] - b[0]) / (b[1] - b[0]), bbox[1]] :
           edge & 2 ? [bbox[2], a[1] + (b[1] - a[1]) * (bbox[2] - a[0]) / (b[0] - a[0])] :
           edge & 1 ? [bbox[0], a[1] + (b[1] - a[1]) * (bbox[0] - a[0]) / (b[0] - a[0])] : null;
}

function bitCode(p, bbox) {
    var code = 0;

    if (p[0] < bbox[0]) code |= 1; // left
    else if (p[0] > bbox[2]) code |= 2; // right

    if (p[1] < bbox[1]) code |= 4; // bottom
    else if (p[1] > bbox[3]) code |= 8; // top

    return code;
}
