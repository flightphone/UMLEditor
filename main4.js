import './node_modules/bootstrap/dist/css/bootstrap.min.css';
import { Modal } from "./node_modules/bootstrap/dist/js/bootstrap.esm.js";

let myModal = new Modal(document.getElementById('exampleModal'), {
    keyboard: false
});

let mainObj = {};

document.getElementById('saveBut').addEventListener("click", (e) => {
    mainObj[mainObj.active] = document.getElementById("urlInfo").value;
});

document.getElementById('mainobj').addEventListener("mousedown", (e) => {
    let id = e.target.id;
    if (!id)
        id = e.target.dataset.name;
    if (!id)
        id = e.target.parentElement.id;
    if (!id)
        id = e.target.parentElement.dataset.name;
    if (id) {
        mainObj.active = id;
        let txt = mainObj[mainObj.active]?mainObj[mainObj.active]:"";
        document.getElementById("eLabel").textContent = id;
        document.getElementById("urlInfo").value = txt;
        myModal.show();
    }

});