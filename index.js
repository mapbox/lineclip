'use strict';

module.exports = lineclip;
module.exports.default = lineclip;

lineclip.polyline = lineclip;
lineclip.polygon = polygonclip;


// Cohen-Sutherland line clippign algorithm, adapted to efficiently
// handle polylines rather than just segments

function lineclip(points, bbox, result) {

    var len = points.length,
        codeA = bitCode(points[0], bbox),
        part = [],
        i, a, b, codeB, lastCode;

    if (!result) result = [];

    for (i = 1; i < len; i++) {
        a = points[i - 1];
        b = points[i];
        codeB = lastCode = bitCode(b, bbox);

        while (true) {

            if (!(codeA | codeB)) { // accept
                part.push(a);

                if (codeB !== lastCode) { // segment went outside
                    part.push(b);

                    if (i < len - 1) { // start a new line
                        result.push(part);
                        part = [];
                    }
                } else if (i === len - 1) {
                    part.push(b);
                }
                break;

            } else if (codeA & codeB) { // trivial reject
                break;

            } else if (codeA) { // a outside, intersect with clip edge
                a = intersect(a, b, codeA, bbox);
                codeA = bitCode(a, bbox);

            } else { // b outside
                b = intersect(a, b, codeB, bbox);
                codeB = bitCode(b, bbox);
            }
        }

        codeA = lastCode;
    }

    if (part.length) result.push(part);

    return result;
}

// Sutherland-Hodgeman polygon clipping algorithm

function polygonclip(points, bbox, removeArtefact) {

    var result, edge, prev, prevInside, i, j, k, p, ip, pCode, prevCode,
        inside, isLR, isTB, pIndex, edgeArray, multiResult = [], ringFound, filoStack = [],
        edgeSegment, v,
        edgePoints = {
            left: [],
            right: [],
            top: [],
            bottom: [],
            count: 0
        };

    // clip against each side of the clip rectangle
    for (edge = 1; edge <= 8; edge *= 2) {
        result = [];
        prev = points[points.length - 1];
        prevInside = !(bitCode(prev, bbox) & edge);

        for (i = 0; i < points.length; i++) {
            p = points[i];
            inside = !(bitCode(p, bbox) & edge);

            // if segment goes through the clip window, add an intersection
            if (inside !== prevInside) {
                ip = intersect(prev, p, edge, bbox);
                result.push(ip);

                if (removeArtefact) {

                    // Detect and save each point on bbox to removing artefact if option setted
                    isOnBbox(ip, bbox, edgePoints);
                }
            }
            if (removeArtefact) {

                // Detect and save each point on bbox to removing artefact if option setted
                isOnBbox(p, bbox, edgePoints);
            }

            if (inside) result.push(p); // add a point if it's inside

            prev = p;
            prevInside = inside;
        }

        points = result;

        if (!points.length) break;
    }

    if (!removeArtefact) {
        return result;
    }

    // If removeArtefact setted the method can generate a list of polygon.
    // The method return an array of polygons instead of one (or zero) polygon
    if (result.length < 3) {
        return [];
    }

    if (result.length === 3 || edgePoints.count <= 1) {
        addPolygon(multiResult, result);
        return multiResult;
    }

    normalize(result);

    prev = null;
    for (i = 0; i < result.length; i++) {
        p = result[i];
        pCode = isOnBbox(p, bbox);

        // point not on bbox
        if (pCode.code === 0) {
            prev = null;
            prevCode = null;
            continue;
        }

        // Point on bbox but not previous point
        if (!prev) {
            prev = p;
            prevCode = pCode;
            continue;
        }

        // Previous point and point on the same left or right bbox edge
        // Previous point and point on the same top or bottom bbox edge
        isLR = (prevCode.lrCode !== 0) && (prevCode.lrCode === pCode.lrCode);
        isTB = (prevCode.tbCode !== 0) && (prevCode.tbCode === pCode.tbCode);

        // Point and previous point not on the same edge
        if (!isLR && !isTB) {
            prev = p;
            prevCode = pCode;
            continue;
        }

        // Previous point and point on the same bbox edge
        if (isLR) {
            edgeArray = pCode.lrCode === 1 ? edgePoints.left : edgePoints.right;
            pIndex = 1; // Iterate over y coordinates
        } else {
            edgeArray = pCode.tbCode === 1 ? edgePoints.bottom : edgePoints.top;
            pIndex = 0; // Iterate over x coordinates
        }

        // Iterate over bbox edge ordered coordinates (x or y) and insert point on potential intersection
        edgeSegment = prev[pIndex] < p[pIndex] ? [prev[pIndex], p[pIndex]] : [p[pIndex], prev[pIndex]];
        k = 0;
        for (j = 0; j < edgeArray.length; j++) {
            v = edgeArray[j]; // x or y coordinates (depending of bbox edge)
            if (v <= edgeSegment[0]) continue;
            if (v >= edgeSegment[1]) break;
            result.splice(
                prev[pIndex] < p[pIndex] ? i + k : i, // Inserting index respecting ascending or descending order
                0,
                pIndex === 0 ? [v, p[1]] : [p[0], v] // x or y coordinates (depending of bbox edge)
            );
            k++;
        }
        i += k; // ignore inserting points on main iteration
        prev = p;
        prevCode = pCode;
    }

    // Now detecting ring and create polygons coordinates array
    for (i = 0; i < result.length; i++) {
        p = result[i];
        pCode = isOnBbox(p, bbox);

        if (pCode.code === 0) continue; // Test only point on bbox

        ringFound = false;
        for (j = filoStack.length - 1; j >= 0; j--) {
            prev = filoStack[j];
            if (p[0] === prev.point[0] && p[1] === prev.point[1]) {
                addPolygon(multiResult, result.splice(prev.index, i - prev.index));
                filoStack.length = j + 1;
                i -= i - prev.index;
                ringFound = true;
                break;
            }
        }

        if (!ringFound) {
            filoStack.push({
                point: p,
                index: i
            });
        }
    }

    addPolygon(multiResult, result);

    return multiResult;
}

// intersect a segment against one of the 4 lines that make up the bbox
function intersect(a, b, edge, bbox) {
    return edge & 8 ? [a[0] + (b[0] - a[0]) * (bbox[3] - a[1]) / (b[1] - a[1]), bbox[3]] : // top
        edge & 4 ? [a[0] + (b[0] - a[0]) * (bbox[1] - a[1]) / (b[1] - a[1]), bbox[1]] : // bottom
        edge & 2 ? [bbox[2], a[1] + (b[1] - a[1]) * (bbox[2] - a[0]) / (b[0] - a[0])] : // right
        edge & 1 ? [bbox[0], a[1] + (b[1] - a[1]) * (bbox[0] - a[0]) / (b[0] - a[0])] : // left
        null;
}

// bit code reflects the point position relative to the bbox:

//         left  mid  right
//    top  1001  1000  1010
//    mid  0001  0000  0010
// bottom  0101  0100  0110

function bitCode(p, bbox) {
    var code = 0;

    if (p[0] < bbox[0]) code |= 1; // left
    else if (p[0] > bbox[2]) code |= 2; // right

    if (p[1] < bbox[1]) code |= 4; // bottom
    else if (p[1] > bbox[3]) code |= 8; // top

    return code;
}

// test if p point is on bbox edges, if try a entry is added to edgepoints
function isOnBbox(p, bbox, edgePoints) {
    var code = 0,
        lrCode = 0,
        tbCode = 0,
        array;

    if ((p[1] < bbox[1]) || (bbox[3] < p[1]) || (p[0] < bbox[0]) || (bbox[2] < p[0])) {
        return edgePoints ? null : {
            code: 0,
            lrCode: 0,
            tbCode: 0
        };
    }

    if (p[0] === bbox[0]) code |= 1; // left
    else if (p[0] === bbox[2]) code |= 2; // right

    if (p[1] === bbox[1]) code |= 4; // bottom
    else if (p[1] === bbox[3]) code |= 8; // top

    if (code > 0) { // point on bbox
        lrCode = code % 4;
        tbCode = code >> 2;
        if (lrCode > 0) {
            if (edgePoints) {
                array = lrCode === 1 ? edgePoints.left : edgePoints.right;
                sortedInsert(array, p[1]);
            }
        }
        if (tbCode > 0) {
            if (edgePoints) {
                array = tbCode === 1 ? edgePoints.bottom : edgePoints.top;
                sortedInsert(array, p[0]);
            }
        }
        if (edgePoints) edgePoints.count++;
    }

    if (edgePoints) {
        return null;
    }

    return {
        code: code,
        lrCode: lrCode,
        tbCode: tbCode
    };
}

function sortedInsert(sortedArray, v) {
    for (var i = 0; i < sortedArray.length; i++) {
        if (sortedArray[i] === v) return;
        if (sortedArray[i] < v) continue;
        sortedArray.splice(i, 0, v);
        return;
    }
    sortedArray.push(v);
}

function normalize(polygon) {
    var first = polygon[0],
        last = polygon[polygon.length - 1];

    if (first[0] !== last[0] || first[1] !== last[1]) {
        polygon.push(first);
    }
}

// Add polygon if points represent a valid polygon (4 points and not flat)
function addPolygon(multiResult, polygon) {
    if (polygon.length === 0) {
        return;
    }
    var i,
        first = polygon[0];

    normalize(polygon);

    if (polygon.length < 4) {
        return;
    }
    var xFlat = true,
        yFlat = true,
        point;

    for (i = 1; i < polygon.length; i++) {
        point = polygon[i];
        xFlat = xFlat && (point[0] === first[0]);
        yFlat = yFlat && (point[1] === first[1]);

        if (!xFlat && !yFlat) {
            break;
        }
    }

    if (xFlat || yFlat) {
        return;
    }

    multiResult.push(polygon);
}
