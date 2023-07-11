import './drawobject.css'
import './node_modules/bootstrap/dist/css/bootstrap.min.css'
import './node_modules/bootstrap-icons/font/bootstrap-icons.min.css'
import { Modal } from "./node_modules/bootstrap/dist/js/bootstrap.esm.js";

let myModal = new Modal(document.getElementById("staticBackdrop"), {
    keyboard: false
});
import { DrawCnvas } from "./DrawObjects";

let dm = new DrawCnvas(document.getElementById("mainSVG"), 
document.getElementById("images"),
document.getElementById("editcontrol")
);
dm.onSelect = ()=>{
    myModal.hide();
    clearBut({target: document.getElementById("image")});
}
dm.onSetMode = (e) => {
    clearBut({target: document.getElementById(e)});
}


let clearBut = (e)=> {
    let btns = document.getElementById("butPanel").getElementsByTagName("button");    
    for (let i = 0; i < btns.length; i++)
    {
        btns[i].classList.remove("btn-success");
    }
    e.target.classList.add("btn-success");
    //console.log(e.target.classList);
}

document.getElementById("image").addEventListener("click", (e) => {
    myModal.show();
   
});



document.getElementById("text").addEventListener("click", (e) => {
    dm.mode = "text";
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






