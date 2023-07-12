import './drawobject.css'
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


let loadimages = async (url) => {
    let response = await fetch(url);
    let result = await response.text();
    let i = result.indexOf("<svg");
    result = result.substring(i);
    return result;
}

let imageHTML = await loadimages(imurl);
let bufDiv = document.createElement("div")
bufDiv.innerHTML = imageHTML;
let bufSVG = bufDiv.getElementsByTagName("svg")[0];
document.getElementById("images").appendChild(bufSVG);


let dm = new DrawCnvas(document.getElementById("mainSVG"),
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


let clearBut = (e) => {
    let btns = document.getElementById("butPanel").getElementsByTagName("button");
    for (let i = 0; i < btns.length; i++) {
        btns[i].classList.remove("btn-success");
    }
    e.target.classList.add("btn-success");
    //console.log(e.target.classList);
}

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

document.getElementById("link").addEventListener("click", (e) => {
    dm.mode = "link";
    dm.action = "startlink"
    clearBut(e);
});

document.getElementById("del").addEventListener("click", () => {
    dm.delete();
});

document.getElementById("apply").addEventListener("click", () => {
    dm.saveText();
});


const infoSVG = document.getElementById("infoSVG");
infoSVG.addEventListener("click", () => {
    dm.deactivate();
    document.getElementById("result").value = dm.generate();
});



