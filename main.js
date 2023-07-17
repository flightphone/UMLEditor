import './drawobject.css'
import { SplitPathAll } from './splitpath'
import './node_modules/bootstrap/dist/css/bootstrap.min.css'
import './node_modules/bootstrap-icons/font/bootstrap-icons.min.css'
import { Modal } from "./node_modules/bootstrap/dist/js/bootstrap.esm.js";

let myModal = new Modal(document.getElementById("staticBackdrop"), {
    keyboard: false
});
import { DrawCnvas } from "./DrawObjects";

//load svg
//let imurl = "/svg/list.svg";
let imurl = "/svg/list2.svg";
//let imurl = "/svg/C4a.svg"
//let imurl = "/svg/archimate.svg"
//let imurl = "/svg/usalow.svg";
//let imurl = "/svg/australiaLow.svg";
//let imurl = "/svg/test7.svg";
//let imurl = "/svg/Plan.svg";

let fileinput = document.createElement("input");
fileinput.setAttribute("type", "file");

fileinput.onchange = (ev) => {
    const file = ev.target.files[0]; // get the file

    if (!file)
        return;

    let reader = new FileReader();
    reader.onload = function () {
        let imageHTML = reader.result;
        let i = imageHTML.indexOf("<svg");
        imageHTML = imageHTML.substring(i);
        let bufDiv = document.createElement("div")
        bufDiv.innerHTML = imageHTML;
        let bufSVG = bufDiv.getElementsByTagName("svg")[0];
        document.getElementById("images").innerHTML = "";
        document.getElementById("images").appendChild(bufSVG);

        
        let defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
        document.getElementById("mainSVG").innerHTML = "";
        document.getElementById("mainSVG").appendChild(defs);
        dm.exit = true;
        dm = new DrawCnvas(document.getElementById("mainSVG"),
            bufSVG,
            //document.getElementById("images"),
            document.getElementById("editcontrol")
        );
        dm.onSelect = () => {
            myModal.hide();
            clearBut({ target: document.getElementById("image") });
        }
        dm.onSetMode = (e) => {
            clearBut({ target: document.getElementById(e) });
        }
    };
    reader.readAsText(file);

}

let loadimages = async (url) => {
    let response = await fetch(url);
    let result = await response.text();
    let i = result.indexOf("<svg");
    result = result.substring(i);
    return result;
}

let dm = {};

let clearBut = (e) => {
    let btns = document.getElementById("butPanel").getElementsByTagName("button");
    for (let i = 0; i < btns.length; i++) {
        btns[i].classList.remove("btn-success");
    }
    e.target.classList.add("btn-success");
    //console.log(e.target.classList);
}

document.getElementById("loadfile").addEventListener("click", (e) => {
    fileinput.click();

});

document.getElementById("image").addEventListener("click", (e) => {
    myModal.show();

});



document.getElementById("text").addEventListener("click", (e) => {
    dm.deactivate();
    dm.ncur = -1;
    dm.mode = "curve";

    clearBut(e);
});

document.getElementById("line").addEventListener("click", (e) => {
    dm.mode = "line";
    clearBut(e);
});
document.getElementById("move").addEventListener("click", (e) => {
    dm.mode = "move";
    clearBut(e);

});

// document.getElementById("poly").addEventListener("click", (e) => {
//     dm.mode = "poly";
//     dm.npoly = 0;
//     clearBut(e);
// });

document.getElementById("del").addEventListener("click", () => {
    dm.delete();
});

document.getElementById("apply").addEventListener("click", () => {
    dm.saveText();
});

let splitObject;
document.getElementById("split").addEventListener("click", (e) => {
    if (!dm.activeObject) {
        alert("Before select object");
        return;
    }

    if (dm.npoly == 0) {
        try {
            if (dm.activeGroupPoly)
                dm.mSVG.removeChild(dm.activeGroupPoly)
        }
        catch
        { ; }
        dm.mode = "poly";
        clearBut(e);
    }
    else {
        dm.npoly = 0;
        dm.mode = "move";
        clearBut({ target: document.getElementById("move") });
        let result = SplitPathAll(dm.activeObject, dm.activePoly);

        dm.delete();
        try {
            if (dm.activeGroupPoly)
                dm.mSVG.removeChild(dm.activeGroupPoly)
        }
        catch
        { ; }
        dm.mSVG.appendChild(result);
    }

});



const infoSVG = document.getElementById("infoSVG");
infoSVG.addEventListener("click", () => {
    dm.deactivate();
    document.getElementById("result").value = dm.generate();
});

let init = async () => {
    let imageHTML = await loadimages(imurl);
    let bufDiv = document.createElement("div")
    bufDiv.innerHTML = imageHTML;
    let bufSVG = bufDiv.getElementsByTagName("svg")[0];
    document.getElementById("images").appendChild(bufSVG);

    
    dm = new DrawCnvas(document.getElementById("mainSVG"),
        bufSVG,
        //document.getElementById("images"),
        document.getElementById("editcontrol")
    );
    dm.onSelect = () => {
        myModal.hide();
        clearBut({ target: document.getElementById("image") });
    }
    dm.onSetMode = (e) => {
        clearBut({ target: document.getElementById(e) });
    }
}


init();