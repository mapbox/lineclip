'use strict';

module.exports = lineclip;

function lineclip(line, bbox, result) {
    var len = line.length,
        xmin = bbox[0],
        ymin = bbox[1],
        xmax = bbox[2],
        ymax = bbox[3],
        codeA = bitCode(line[0][0], line[0][1], bbox),
        part = [];

    if (!result) result = [];

    for (var i = 0; i < len - 1; i++) {

        var a = line[i],
            b = line[i + 1],
            x0 = a[0],
            y0 = a[1],
            x1 = b[0],
            y1 = b[1],
            codeB = bitCode(b[0], b[1], bbox),
            lastCode = codeB,
            accept = false,
            startClipped = false,
            endClipped = false,
            codeOut, x, y;

        while (true) {
            if (!(codeA | codeB)) { // both points inside
                accept = true;
                break;

            } else if (codeA & codeB) { // both points outside
                break;

            } else { // one point inside, the other outside
                codeOut = codeA ? codeA : codeB;

                if (codeOut & 8) { // above
                    x = x0 + (x1 - x0) * (ymax - y0) / (y1 - y0);
                    y = ymax;

                } else if (codeOut & 4) { // below
                    x = x0 + (x1 - x0) * (ymin - y0) / (y1 - y0);
                    y = ymin;

                } else if (codeOut & 2) { // right
                    y = y0 + (y1 - y0) * (xmax - x0) / (x1 - x0);
                    x = xmax;

                } else if (codeOut & 1) { // left
                    y = y0 + (y1 - y0) * (xmin - x0) / (x1 - x0);
                    x = xmin;
                }

                if (codeOut === codeA) {
                    x0 = x;
                    y0 = y;
                    startClipped = true;
                    codeA = bitCode(x, y, bbox);
                } else {
                    x1 = x;
                    y1 = y;
                    endClipped = true;
                    codeB = bitCode(x, y, bbox);
                }
            }
        }

        if (accept) {
            part.push(startClipped ? [x0, y0] : a);

            if (endClipped || i === len - 2) {
                part.push([x1, y1]);
                result.push(part);
                part = [];
            }
        }

        codeA = lastCode;
    }

    return result;
}

function bitCode(x, y, bbox) {
    var code = 0;

    if (x < bbox[0]) code |= 1; // left
    else if (x > bbox[2]) code |= 2; // right

    if (y < bbox[1]) code |= 4; // bottom
    else if (y > bbox[3]) code |= 8; // top

    return code;
}
