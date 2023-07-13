/*
let parseD = (dp) => {
    if (dp.indexOf(",") > -1)
        return dp;

    let num = "-0123456789"
    let a = dp.split(" ");
    let res = "";
    let chet = 0;
    for (let i = 0; i < a.length; i++) {
        if (a[i] == "")
            continue;
        if (a[i] == "Z") {
            res += "Z ";
            continue;
        }
        if (num.includes(a[i][0])) {
            if (chet % 2 == 0)
                res += a[i];
            else
                res += `,${a[i]} `;
            chet = (chet + 1) % 2;
        }
        else
            res += a[i];
    }
    return res;
}
*/


/*
let moveD = (d, dx, dy) => {
    let num = "-0123456789"
    d = parseD(d);
    let a = d.split(" ");
    let ad = a.map((val) => {
        if (val == "")
            return "";
        if (val == "Z")
            return val;

        let pref = "";
        if (!num.includes(val[0])) {
            pref = val[0];
            val = val.substr(1);
        }
        let xy = val.split(",")
        let x = parseFloat(xy[0]) + dx;
        let y = parseFloat(xy[1]) + dy;
        let res = `${pref}${x},${y}`;
        return res;
    })
    let nd = ad.join(" ");
    return nd;
}
*/

/*
let resizeD = (d, dx, dy, startX, startY, w, h) => {
    let num = "-0123456789";
    d = parseD(d);
    let a = d.split(" ");
    let ad = a.map((val) => {
        if (val == "")
            return "";
        if (val == "Z")
            return val;
        let pref = "";
        if (!num.includes(val[0])) {
            pref = val[0];
            val = val.substr(1);
        }
        let xy = val.split(",")
        let x = parseFloat(xy[0]);
        let y = parseFloat(xy[1]);

        x += (dx * (x - startX) / w);
        y += (dy * (y - startY) / h);

        let res = `${pref}${x},${y}`;
        return res;
    })
    let nd = ad.join(" ");
    return nd;
}
*/

/*
let getRectFromBez = (d) => {
    let res = []
    let a = d.split(" ");
    for (let i = 2; i < 4; i++) {
        let xy = a[i].split(",")
        let x = parseFloat(xy[0]);
        let y = parseFloat(xy[1]);
        res.push({ x: x, y: y });
    }
    return res;
}
*/