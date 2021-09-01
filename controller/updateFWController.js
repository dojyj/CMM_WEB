import { CMMResourceURI, getResource } from "./getResource.js";

const host = document.getElementById("host");
const path = document.getElementById("path");
const user = document.getElementById("user");
const password = document.getElementById("password");
const writeProtect = document.getElementById("writeProtect");

let virtualMediaCollection = [];
let patchCtx = {};
let temp_host;
let temp_path;

window.onload = () => {
    host.addEventListener("input", function (e) {
        temp_host = this.innerText;
    }, false);

    path.addEventListener("input", function (e){
        temp_path = this.innerText;
    }, false);
    
    user.addEventListener("input", function (e){
        patchCtx.UserName = this.innerText;
    }, false);
    
    password.addEventListener("input", function (e){
        patchCtx.Password = this.innerText;
    }, false);

    writeProtect.addEventListener("change", function (e){
        if (e.currentTarget.checked){
            patchCtx.WriteProtected = true;
        } else {
            patchCtx.WriteProtected = false;
        }
            
    }, false);
}

function refreshHandler() {
    init();
}

function mountHandler() {
    patchCtx.Image = `${temp_host}${temp_path}`;
    patchCtx.Inserted = true;

    console.log(patchCtx);
}

function unmountHandler() {
    
}

async function paintVirtualMedia() {
    const virtualMediaList = [];
    for (virtualMedia in virtualMediaCollection){
        virtualMediaList.push(await getResource(virtualMedia["@odata.id"]));   
    }
    console.log(virtualMediaList);
}

async function init() {
    const virtualMedia = await getResource(CMMResourceURI.VIRTUALMEDIA);
    console.log(virtualMedia);
    virtualMediaCollection = virtualMedia.Members;
    paintVirtualMedia();    
}

init();
window.refreshHandler = refreshHandler;
window.mountHandler = mountHandler;
window.unmountHandler = unmountHandler;