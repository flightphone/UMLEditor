import './path-data-polyfill.js';
let logPathSegments = (path) => {
    for (let seg of path.getPathData())
        console.log(seg);
}

let moveD1 = (path, dx, dy) => {
    let movepath = path.getPathData({ normalize: true });
    for (let seg of movepath) {

        for (let i = 0; i < seg.values.length; i++) {
            if (i % 2 == 0)
                seg.values[i] += dx;
            else
                seg.values[i] += dy;

        }
    }
    return movepath;
}

let resizeD1 = (path, dx, dy, startX, startY, w, h) => {
    let movepath = path.getPathData({ normalize: true });
    for (let seg of movepath) {

        for (let i = 0; i < seg.values.length; i++) {
            if (i % 2 == 0)
                seg.values[i] += (dx * (seg.values[i] - startX) / w);
            else
                seg.values[i] += (dy * (seg.values[i] - startY) / h);

        }
    }
    return movepath;
}




let moveElement = (el, dx, dy) => {
    if (!el)
        return;
    if (!el.childNodes)
        return;
    for (let i = 0; i < el.childNodes.length; i++) {
        let che = el.childNodes[i];
        if (che.tagName == "ellipse" || che.tagName == "circle") {
            let x = che.cx.baseVal.value + dx;
            let y = che.cy.baseVal.value + dy;
            che.setAttribute("cx", x);
            che.setAttribute("cy", y);
        }
        if (che.tagName == "line") {
            let x1 = che.x1.baseVal.value + dx;
            let y1 = che.y1.baseVal.value + dy;
            let x2 = che.x2.baseVal.value + dx;
            let y2 = che.y2.baseVal.value + dy;
            che.setAttribute("x1", x1);
            che.setAttribute("y1", y1);
            che.setAttribute("x2", x2);
            che.setAttribute("y2", y2);
        }
        if (che.tagName == "text") {
            let x = che.x.baseVal[0].value + dx;
            let y = che.y.baseVal[0].value + dy;
            che.setAttribute("x", x);
            che.setAttribute("y", y);
        }

        if (che.tagName == "rect" || che.tagName == "image") {
            let x = che.x.baseVal.value + dx;
            let y = che.y.baseVal.value + dy;
            che.setAttribute("x", x);
            che.setAttribute("y", y);
        }

        if (che.tagName == "polygon" || che.tagName == "polyline") {
            for (let i = 0; i < che.points.length; i++) {
                let a = che.points[i];
                //console.log(`${a.x}, ${a.y}`);
                a.x += dx;
                a.y += dy;
            }
        }
        if (che.tagName == "path") {
            let d = moveD1(che, dx, dy);
            che.setPathData(d);

        }
        if (che.tagName == "g") {
            moveElement(che, dx, dy);
        }
    }

}


let resizeElement = (el, dx, dy, startX, startY, w, h) => {
    if (!el)
        return;
    if (!el.childNodes)
        return;

    let x1 = startX;
    let y1 = startY;
    let x2 = startX;
    let y2 = startY;

    for (let i = 0; i < el.childNodes.length; i++) {
        let che = el.childNodes[i];
        if (che.tagName == "circle") {
            let x = che.cx.baseVal.value + dx * (che.cx.baseVal.value - startX) / w;
            let y = che.cy.baseVal.value + dy * (che.cy.baseVal.value - startY) / h;
            che.setAttribute("cx", x);
            che.setAttribute("cy", y);
        }
        if (che.tagName == "ellipse") {
            let x = che.cx.baseVal.value + dx * (che.cx.baseVal.value - startX) / w;
            let y = che.cy.baseVal.value + dy * (che.cy.baseVal.value - startY) / h;

            let rx = che.rx.baseVal.value + dx * che.rx.baseVal.value / w;
            let ry = che.ry.baseVal.value + dy * che.ry.baseVal.value / h;

            che.setAttribute("cx", x);
            che.setAttribute("cy", y);
            che.setAttribute("rx", rx);
            che.setAttribute("ry", ry);
        }

        if (che.tagName == "line") {
            x1 = che.x1.baseVal.value + dx * (che.x1.baseVal.value - startX) / w;
            y1 = che.y1.baseVal.value + dy * (che.y1.baseVal.value - startY) / h;
            x2 = che.x2.baseVal.value + dx * (che.x2.baseVal.value - startX) / w;
            y2 = che.y2.baseVal.value + dy * (che.y2.baseVal.value - startY) / h;
            che.setAttribute("x1", x1);
            che.setAttribute("y1", y1);
            che.setAttribute("x2", x2);
            che.setAttribute("y2", y2);

        }

        if (che.tagName == "rect" || che.tagName == "image") {
            let x = che.x.baseVal.value + dx * (che.x.baseVal.value - startX) / w;
            let y = che.y.baseVal.value + dy * (che.y.baseVal.value - startY) / h;

            let width = che.width.baseVal.value + dx * che.width.baseVal.value / w;
            let height = che.height.baseVal.value + dy * che.height.baseVal.value / h;

            che.setAttribute("x", x);
            che.setAttribute("y", y);
            che.setAttribute("width", width);
            che.setAttribute("height", height);
        }

        if (che.tagName == "text") {
            let bx = che.getBBox();
            let x = che.x.baseVal[0].value + bx.width / 2;
            let y = che.y.baseVal[0].value - bx.height / 3;

            x = x + dx * (x - startX) / w;
            y = y + dy * (y - startY) / h;

            x = x - bx.width / 2;
            y = y + bx.height / 3;

            che.setAttribute("x", x);
            che.setAttribute("y", y);
        }

        if (che.tagName == "polygon"  || che.tagName == "polyline") {
            if (el.dataset.type == "arrow") {
                let ar = new ArrowObject(x1, y1, x2, y2, 12, 8);
                for (let i = 0; i < che.points.length; i++) {
                    let a = che.points[i];
                    a.x = ar.transform[i].x;
                    a.y = ar.transform[i].y;
                }

            }
            else {
                for (let i = 0; i < che.points.length; i++) {
                    let a = che.points[i];
                    a.x += (dx * (a.x - startX) / w);
                    a.y += (dy * (a.y - startY) / h);
                }
            }
        }

        if (che.tagName == "path") {
            let d = resizeD1(che, dx, dy, startX, startY, w, h);
            che.setPathData(d);
            if (el.dataset.type == "arrow") {
                x1 = d[1].values[2];
                y1 = d[1].values[3];
                x2 = d[1].values[4];
                y2 = d[1].values[5];
            }
        }

    }

}


function DrawCnvas(svg, images, editcontrol) {
    //defs svg
    let defSVG = svg.getElementsByTagName("defs")[0];
    let defImg = images.getElementsByTagName("defs");
    if (defImg)
        defSVG.innerHTML = defImg[0].innerHTML;

    this.npoly = 0;
    this.arrowW = 12;
    this.arrowH = 8;
    this.mSVG = svg;
    this.ncur = 4;
    this.editcontrol = editcontrol;
    this.mode = "move";
    this.r = 7;
    this.circles = [];
    for (let i = 0; i < 4; i++) {
        let p = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        p.setAttribute("cx", -1000);
        p.setAttribute("cy", -1000);
        p.setAttribute("r", this.r);
        p.setAttribute("class", "image-mapper-point");
        p.setAttribute("data-point", i);
        this.circles.push(p);
    }

    this.drawLine = (x1, y1, x2, y2, index, group) => {
        let p = document.createElementNS("http://www.w3.org/2000/svg", "line");
        p.setAttribute("x1", x1);
        p.setAttribute("y1", y1);
        p.setAttribute("x2", x2);
        p.setAttribute("y2", y2);
        p.setAttribute("class", "image-line");
        p.setAttribute("data-index", index);
        group.appendChild(p);
    }

    this.drawPoligon = (points, index, group) => {
        let poly = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
        poly.setAttribute("class", "image-arrow");
        poly.setAttribute("data-index", index);
        for (let i = 0; i < points.length; i++) {
            let poi = this.mSVG.createSVGPoint();
            poi.x = points[i].x;
            poi.y = points[i].y;
            poly.points.appendItem(poi);
        }
        group.appendChild(poly);
    }

    this.createArrow = (x, y) => {
        let group = document.createElementNS("http://www.w3.org/2000/svg", "g");
        group.setAttribute("data-type", "arrow");
        let a = new ArrowObject(x, y, x, y, this.arrowW, this.arrowH);
        this.drawLine(x, y, x, y, 0, group);
        this.drawPoligon(a.transform, 0, group);
        return group;
    }

    this.renderArrow = (el, x1, y1, x2, y2) => {
        if (!el)
            return;
        if (!el.childNodes)
            return;
        for (let i = 0; i < el.childNodes.length; i++) {
            let che = el.childNodes[i];
            if (che.tagName == "line") {
                let line = che;
                line.setAttribute("x1", x1);
                line.setAttribute("y1", y1);
                line.setAttribute("x2", x2);
                line.setAttribute("y2", y2);
            }
            if (che.tagName == "polygon") {
                let ar = new ArrowObject(x1, y1, x2, y2, this.arrowW, this.arrowH);
                for (let i = 0; i < che.points.length; i++) {
                    let a = che.points[i];
                    //console.log(`${a.x}, ${a.y}`);
                    a.x = ar.transform[i].x;
                    a.y = ar.transform[i].y;
                }
            }
        }
        this.mSVG.appendChild(el);
    }


    this.delete = () => {
        if (this.activeObject) {
            this.activeObject.parentElement.removeChild(this.activeObject);
            this.activeObject = null;

        }
    }

    this.deactivate = () => {
        if (this.activeObject == this.mSVG)
            return;
        if (this.activeObject) {
            try {
                for (let i = 0; i < 4; i++)
                    this.activeObject.removeChild(this.circles[i]);

            }
            catch { ; }
            this.activeObject = null;
        }
    }

    this.activate = (obj) => {
        this.activeObject = obj;
        let crc = this.activeObject.getBBox();
        this.circles[0].setAttribute("cx", crc.x);
        this.circles[0].setAttribute("cy", crc.y);

        this.circles[1].setAttribute("cx", crc.x + crc.width);
        this.circles[1].setAttribute("cy", crc.y);

        this.circles[2].setAttribute("cx", crc.x + crc.width);
        this.circles[2].setAttribute("cy", crc.y + crc.height);

        this.circles[3].setAttribute("cx", crc.x);
        this.circles[3].setAttribute("cy", crc.y + crc.height);


        for (let i = 0; i < 4; i++)
            this.activeObject.appendChild(this.circles[i]);
    }




    this.saveText = () => {
        if (!this.activeText)
            return;
        let bx = this.activeText.getBBox();
        //this.activeText.x.baseVal[0].value
        let x = bx.x + bx.width / 2;
        this.activeText.innerHTML = this.editcontrol.value;
        bx = this.activeText.getBBox();
        x = x - bx.width / 2;
        this.activeText.setAttribute("x", x);
        this.editcontrol.style.display = "none";
        this.activeText = null;
        this.deactivate();
    }

    this.createCurve = () => {
        //create path
        let group = document.createElementNS("http://www.w3.org/2000/svg", "g");
        group.setAttribute("data-type", "arrow");
        let p = document.createElementNS("http://www.w3.org/2000/svg", "path");
        let points = [];
        for (let i = 0; i < 4; i++)
            points.push({
                cx: this.circles[i].cx.baseVal.value,
                cy: this.circles[i].cy.baseVal.value
            })
        let d = `M${points[0].cx},${points[0].cy} C${points[1].cx},${points[1].cy} ${points[2].cx},${points[2].cy} ${points[3].cx},${points[3].cy}`;
        p.setAttribute("class", "image-line");
        p.setAttribute("d", d);
        group.appendChild(p);
        let a = new ArrowObject(points[2].cx, points[2].cy, points[3].cx, points[3].cy, this.arrowW, this.arrowH);
        this.drawPoligon(a.transform, 0, group);
        this.activeObject.appendChild(group);
    }

    //select image
    images.addEventListener("mousedown", (e) => {

        if (e.target.parentElement.tagName == "g") {
            this.activeHTML = e.target.parentElement.innerHTML;
            this.mode = "add";
            if (this.onSelect)
                this.onSelect();

        }

    });

    

    this.addimage = () => {
        let group = document.createElementNS("http://www.w3.org/2000/svg", "g");
        group.innerHTML = this.activeHTML;
        this.mSVG.appendChild(group);
        let bx = group.getBBox();
        //console.log(bx);
        let dx = this.x - bx.x;
        let dy = this.y - bx.y;
        moveElement(group, dx, dy);
        return group;
    }


    window.addEventListener("mouseup", (e) => {
        if (this.isResize)
            this.isResize = false;

        if (this.isDrawing) {
            this.isDrawing = false;

            if (this.mode == "line") {
                this.activeObject = null;
            }
            if (this.mode == "move") {
                //alert(e.target.tagName);
            }
        }
    });

    this.mSVG.addEventListener("mousedown", (e) => {
        this.x = e.offsetX;
        this.y = e.offsetY;
        if (this.mode == "poly") {
            if (this.npoly == 0) {
                //this.deactivate();
                console.log("start");
                this.npoly = 1;
                let group = document.createElementNS("http://www.w3.org/2000/svg", "g");
                let poly = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
                poly.setAttribute("class", "image-line");
                group.appendChild(poly);
                this.mSVG.appendChild(group);
                this.activeGroupPoly = group;
                let poi = this.mSVG.createSVGPoint();
                poi.x = this.x;
                poi.y = this.y;
                poly.points.appendItem(poi);
                this.activePoly = poly;
            }
            else {
                let poly = this.activePoly;
                let poi = this.mSVG.createSVGPoint();
                poi.x = this.x;
                poi.y = this.y;
                poly.points.appendItem(poi);

            }
        }
        //=====================curve==============================================
        if (this.mode == "curve") {
            if (this.ncur == -1 || this.ncur == 4) {
                this.ncur = 0;
                this.deactivate();
                this.activeObject = this.mSVG;
            }
            this.circles[this.ncur].setAttribute("cx", this.x);
            this.circles[this.ncur].setAttribute("cy", this.y);
            this.activeObject.appendChild(this.circles[this.ncur]);
            this.ncur += 1;

            if (this.ncur == 4) {
                this.createCurve();
            }


        }


        //====================================add image============================
        if (this.mode == "add") {
            //add new image
            let group = this.addimage();
            if (e.target.parentElement.tagName == "g")
                e.target.parentElement.appendChild(group);

            this.mode = "move";
            if (this.onSetMode)
                this.onSetMode("move");


        }
        //====================================add line============================
        if (this.mode == "line") {
            this.deactivate();
            this.activeObject = this.createArrow(this.x, this.y)
            this.isDrawing = true;
        }
        //===================================select object========================
        if (this.mode == "move") {
            if (e.target.dataset.point) {
                this.baseIndex = (parseInt(e.target.dataset.point) + 2) % 4;
                this.stopIndex = parseInt(e.target.dataset.point);
                this.activeObject = e.target.parentElement;
                this.isResize = true;
            } else {
                if (e.target.parentElement.tagName == "g" && e.target.tagName == "text" && e.target.parentElement == this.activeObject) {
                    //this.isDrawing = false;
                    let bx = e.target.getBBox();
                    this.editcontrol.style.display = "block";
                    this.editcontrol.style.top = `${bx.y}px`;
                    this.editcontrol.style.left = `${bx.x}px`;
                    this.editcontrol.value = e.target.innerHTML;
                    this.activeText = e.target;
                    return;
                }
                if (e.target.parentElement.tagName == "g") {
                    this.isDrawing = true;
                    if (e.target.parentElement != this.activeObject) {
                        this.deactivate();
                        this.activate(e.target.parentElement);
                    }
                }
                else
                    this.deactivate();

            }
        }

        if (this.mode == "link") {
            if (e.target.parentElement.tagName == "g") {
                if (this.action == "startlink") {
                    this.startObject = e.target.parentElement;
                    this.action = "endlink";
                }
                else {
                    this.endObject = e.target.parentElement;
                    this.action = "startlink";
                    this.endObject.appendChild(this.startObject);
                    let info = `${this.startObject.id} - ${this.endObject.id}`;
                    alert(info);
                }
            }
        }
    });

    this.mSVG.addEventListener("mousemove", (e) => {
        if (this.isDrawing) {
            if (this.mode == "line") {
                this.renderArrow(this.activeObject, this.x, this.y, e.offsetX, e.offsetY);
            }
            if (this.mode == "move") {
                moveElement(this.activeObject, e.offsetX - this.x, e.offsetY - this.y);
                this.x = e.offsetX;
                this.y = e.offsetY;
            }
        }
        if (this.isResize) {
            this.resizeX = this.circles[this.baseIndex].cx.baseVal.value;
            this.resizeY = this.circles[this.baseIndex].cy.baseVal.value;
            this.resizeW = this.circles[this.stopIndex].cx.baseVal.value - this.resizeX;
            this.resizeH = this.circles[this.stopIndex].cy.baseVal.value - this.resizeY;
            resizeElement(this.activeObject, e.offsetX - this.x, e.offsetY - this.y,
                this.resizeX, this.resizeY, this.resizeW, this.resizeH);
            this.x = e.offsetX;
            this.y = e.offsetY;
            if (this.activeObject.dataset.type == "arrow")
                this.mSVG.appendChild(this.activeObject);
        }
    });

    this.generate = () => {
        let style = `<style>
g {
    cursor:pointer
}

.image-line {
    stroke: #A80036;
    stroke-width: 1;
    fill:none;
}

.image-arrow {
    fill: #A80036;
}
.image-rect {
    fill: none;
}

.image-mapper-point {
    fill: none;
    stroke: rgba(0, 0, 0, 0);
}
</style>`
        let res = this.mSVG.outerHTML;
        res = res.replace("<!--CopyRight-->", style)
        res = res.replace('id="mainSVG"', "");
        return res;
    }

    //add alaska for test
    /*
    let usak = images.getElementById("US-AK")
    if (usak) {
        this.activeHTML = usak.outerHTML;
        this.x = 200;
        this.y = 100;
        this.activeObject = this.addimage();

    }
    */


}

function ArrowObject(x1, y1, x2, y2, w, h) {
    let sina = 0;
    let cosa = 1;
    if (!(x1 == x2 && y1 == y2)) {

        let r = (x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1);
        r = Math.sqrt(r);
        sina = (y2 - y1) / r;
        cosa = (x2 - x1) / r
    }
    this.points = [{ x: -w / 2, y: 0 }, { x: -w, y: h }, { x: 0, y: 0 }, { x: -w, y: -h }]
    this.transform = []
    for (let i = 0; i < this.points.length; i++) {
        let p = this.points[i]
        let px = p.x * cosa - p.y * sina + x2;
        let py = p.x * sina + p.y * cosa + y2;
        this.transform.push({ x: px, y: py });
    }
}

export { DrawCnvas };