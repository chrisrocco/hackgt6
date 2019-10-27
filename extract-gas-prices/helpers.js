const getPolygonCentroid = (pts) => {
    let first = pts[0]
    let last = pts[pts.length - 1]

    if (first.x != last.x || first.y != last.y) {
        pts.push(first);
    }

    let twiceArea = 0
    let x = 0
    let y = 0
    let nPts = pts.length
    let p1, p2, f

    for (let i = 0, j = nPts - 1; i < nPts; j = i++) {
        p1 = pts[i]; p2 = pts[j];
        f = p1.x * p2.y - p2.x * p1.y;
        twiceArea += f;
        x += (p1.x + p2.x) * f;
        y += (p1.y + p2.y) * f;
    }

    f = twiceArea * 3;
    return { x: x / f, y: y / f };
}

const isNumeric = (text) => /\d+/.test(text)

module.exports = {
    getPolygonCentroid,
    isNumeric
}