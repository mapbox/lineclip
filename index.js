'use strict';

module.exports = lineclip;

lineclip.polyline = lineclip;
lineclip.polygon = polygonclip;


function lineclip(points, bbox, result) {
    var len = points.length,
        part = [],
        codeA = bitCode(points[0], bbox),
        i, a, b, codeB, lastCode, endClipped;

    if (!result) result = [];

    for (i = 1; i < len; i++) {
        a = points[i - 1];
        b = points[i];
        endClipped = false;
        codeB = lastCode = bitCode(b, bbox);

        while (true) {

            if (!codeA && !codeB) { // accept
                part.push(a);

                if (endClipped) {
                    part.push(b);

                    if (i < len - 1) {
                        result.push(part);
                        part = [];
                    }
                }
                break;

            } else if (codeA & codeB) { // trivial reject
                break;

            } else if (codeA) {
                a = intersect(a, b, codeA, bbox);
                codeA = bitCode(a, bbox);

            } else {
                b = intersect(a, b, codeB, bbox);
                codeB = bitCode(b, bbox);
                endClipped = true;
            }
        }

        codeA = lastCode;
    }

    result.push(part);

    return result;
}

function polygonclip(points, bbox) {

    var len = points.length,
        result, edge, prev, prevInside, i, p, inside;

    for (edge = 1; edge <= 8; edge *= 2) {
        result = [];
        prev = points[len - 1];
        prevInside = !(bitCode(prev, bbox) & edge);

        for (i = 0; i < len; i++) {
            p = points[i];
            inside = !(bitCode(p, bbox) & edge);

            if (inside !== prevInside) result.push(intersect(prev, p, edge, bbox));
            if (inside) result.push(p);

            prev = p;
            prevInside = inside;
        }

        points = result;
    }

    return result;
}

function intersect(a, b, edge, bbox) {
    return edge & 8 ? [a[0] + (b[0] - a[0]) * (bbox[3] - a[1]) / (b[1] - a[1]), bbox[3]] : // top
           edge & 4 ? [a[0] + (b[0] - a[0]) * (bbox[1] - a[1]) / (b[1] - a[1]), bbox[1]] : // bottom
           edge & 2 ? [bbox[2], a[1] + (b[1] - a[1]) * (bbox[2] - a[0]) / (b[0] - a[0])] : // right
           edge & 1 ? [bbox[0], a[1] + (b[1] - a[1]) * (bbox[0] - a[0]) / (b[0] - a[0])] : // left
           null;
}

function bitCode(p, bbox) {
    var code = 0;

    if (p[0] < bbox[0]) code |= 1; // left
    else if (p[0] > bbox[2]) code |= 2; // right

    if (p[1] < bbox[1]) code |= 4; // bottom
    else if (p[1] > bbox[3]) code |= 8; // top

    return code;
}
