let intersectionSegment = (seg1, seg2) => {
    let l1 = lineXY(seg1);
    let l2 = lineXY(seg2);
    let a1 = l1[0];
    let b1 = l1[1];
    let c1 = l1[2];
    let a2 = l2[0];
    let b2 = l2[1];
    let c2 = l2[2];

    // let a1, b1, c1 = lineXY(seg1);
    // let a2, b2, c2 = lineXY(seg2);
    let d = a1 * b2 - a2 * b1;
    if (d == 0)
        return null
    let x = (c1 * b2 - c2 * b1) / d;
    let y = (c2 * a1 - c1 * a2) / d;
    if (checkSegment(seg1, x, y) && checkSegment(seg2, x, y))
    {
        //console.log('a');
        return { x: x, y: y }
    }
    else
        return null;
}

let checkSegment = (seg, x, y) => {
    let x1 = seg[0].x;
    let y1 = seg[0].y;

    let x2 = seg[1].x;
    let y2 = seg[1].y;
    return (
        ((x - x1) * (x2 - x1) + (y - y1) * (y2 - y1)) > 0 &&
        (((x - x1) * (x - x1) + (y - y1) * (y - y1)) <= ((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1)))
    )
}

let lineXY = (seq) => {
    let a = seq[1].y - seq[0].y;
    let b = seq[0].x - seq[1].x;
    let c = seq[0].x * a + seq[0].y * b;
    return [a, b, c];
}

let mod2 = (a, x0, y0) => {
    let res = (a.x - x0) * (a.x - x0) + (a.y - y0) * (a.y - y0);
    return res;
}

let drawgr = (group, xy) => {
    let p = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    p.setAttribute("cx", xy.x);
    p.setAttribute("cy", xy.y);
    p.setAttribute("r", 5);
    p.setAttribute("class", "image-arrow");
    group.appendChild(p);
}

function SplitPathAll(group, poly)
{
    
    let resgroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
    let paths = group.getElementsByTagName("path");
    for (let path of paths)
    {
        SplitPath(resgroup, poly, path);
    }
    let result = resgroup;
    return result;

}
function SplitPath(group, poly, path) {
    if (!group || !poly)
        return;
    
    let points = path.getPathData({ normalize: true });
    let graph = [];
    let coord = [];
    let start = -1;
    for (let e of points) {
        if (e.type == "Z") {
            graph[graph.length - 1] = start;
            continue;
        }

        if (e.type == "M")
            start = graph.length;

        coord.push({ x: e.values[0], y: e.values[1] });
        graph.push(graph.length + 1);


    }


    //go
    let np = poly.points.length;
    let outspace = true;
    let curLeft = -1;
    let curRight = -1;
    //let left

    for (let k = 1; k < np; k++) {
        let x0 = poly.points[k - 1].x;
        let y0 = poly.points[k - 1].y;
        let lisect = [{ x: poly.points[k].x, y: poly.points[k].y, g: -1, l: mod2(poly.points[k], x0, y0) }]
        let seg1 = [
            { x: poly.points[k - 1].x, y: poly.points[k - 1].y },
            { x: poly.points[k].x, y: poly.points[k].y }
        ]
        
        for (let i = 0; i < graph.length; i++) {
            let j = graph[i];
            if (j == -1)
                continue;
            let seg2 = [coord[i], coord[j]]
            let iseg = intersectionSegment(seg1, seg2);
            if (iseg) {
                lisect.push({ x: iseg.x, y: iseg.y, g: i, l: mod2(iseg, x0, y0) });
                //drawgr(group, iseg);

            }
        }
        
        lisect.sort((a, b) => a.l - b.l);
        for (let ee of lisect) 
        {
            if (ee.g == -1) {
                if (outspace)
                {
                    continue;
                }
                else {

                    let addRight = graph.length;
                    graph.push(-1);
                    coord.push({ x: ee.x, y: ee.y });    
                    graph[curRight] = addRight;
                    curRight = addRight;
                    
                    
                    
                    graph.push(-1);
                    coord.push({ x: ee.x, y: ee.y });
                    graph[graph.length-1] = curLeft;
                    curLeft = graph.length-1;

                    // drawgr(group, coord[curLeft])
                    // drawgr(group, coord[curRight])

                    
                }
            }
            else {
                //border
                if (outspace) {
                    //enter
                    curLeft = graph.length;
                    graph.push(-1);
                    coord.push({ x: ee.x, y: ee.y });
                    curRight = graph.length;
                    graph.push(-1);
                    coord.push({ x: ee.x, y: ee.y });
                    let from = ee.g;
                    let to = graph[from];
                    //split
                    graph[from] = curRight;
                    graph[curLeft] = to;
                    //console.log("enter");
                    // drawgr(group, coord[curLeft])
                    // drawgr(group, coord[curRight])

                    



                    //drawgr(group, coord[from]);
                    //graph[curLeft] = to
                    //graph[from] = curRight
                    //graph[curRight] = -1
                }
                else {
                    //exit
                    let addLeft = graph.length;
                    graph.push(-1);
                    coord.push({ x: ee.x, y: ee.y });
                    let addRight = graph.length;
                    graph.push(-1);
                    coord.push({ x: ee.x, y: ee.y });
                    let from = ee.g;
                    let to = graph[from];


                    graph[curRight] = addRight;
                    graph[addRight] = to;

                    graph[addLeft] = curLeft;
                    graph[from] = addLeft;
                    // drawgr(group, coord[addLeft])
                    // drawgr(group, coord[addRight])

                }
                outspace = !outspace
            }
        }

    }

    //group.removeChild(path);

    let n = graph.length;
    let vis = new Array(n);
    for (let i = 0; i < n; i++)
        if (!vis[i]) {

            let newpath = document.createElementNS("http://www.w3.org/2000/svg", "path");
            newpath.setAttribute("class", "land");
            let g = document.createElementNS("http://www.w3.org/2000/svg", "g");
            g.appendChild(newpath);

            start = i;
            vis[i] = true;
            let next = graph[start];
            let newpoits = [{
                type: "M",
                values: [coord[start].x, coord[start].y]
            }];

            let stop = 0;
            while (!vis[next]) {
                stop += 1;
                vis[next] = true;
                newpoits.push({
                    type: "L",
                    values: [coord[next].x, coord[next].y]
                });
                let bd = next;
                next = graph[next];
                if (next == -1) {
                    //console.log(`${bd} = -1`);
                    drawgr(group, coord[bd]);
                    break;
                }
            }
            newpoits.push({
                type: "Z",
                values: []
            });
            newpath.setPathData(newpoits);
            group.appendChild(g);
        }


}

export { SplitPath, SplitPathAll };