import { fetchAPI } from "./api.js";
import { CMMResourceURI, getResource } from "./getResource.js";

const isoImageTableBody = document.querySelector(".iso-image-table-body");
const host = document.getElementById("host");
const path = document.getElementById("path");
const user = document.getElementById("user");
const password = document.getElementById("password");
const writeProtect = document.getElementById("writeProtect");

let virtualMediaList = [];
let virtualMediaCollection = [];
let postCtx = {};
let temp_host;
let temp_path;
let selectedId;

window.onload = () => {
    host.addEventListener("input", function (e) {
        temp_host = this.innerText;
    }, false);

    path.addEventListener("input", function (e){
        temp_path = this.innerText;
    }, false);
    
    user.addEventListener("input", function (e){
        postCtx.UserName = this.innerText;
    }, false);
    
    password.addEventListener("input", function (e){
        postCtx.Password = this.innerText;
    }, false);

    writeProtect.addEventListener("change", function (e){
        if (e.currentTarget.checked){
            postCtx.WriteProtected = true;
        } else {
            postCtx.WriteProtected = false;
        }
            
    }, false);
}

function onlyOneCheckbox(id) {
    for (var i = 1; i <= virtualMediaCollection.length; i++){
        document.getElementById("iso"+i).checked = false;
    }
    document.getElementById(id).checked = true;
    selectedId = id;
}

function refreshHandler() {
    init();
}

async function mountHandler() {
    postCtx.Image = `${temp_host}:${temp_path}`;
    postCtx.Inserted = true;

    console.log(postCtx);
    await fetchAPI.post("/redfish/v1/Managers/1/VirtualMedia/Actions/VirtualMedia.InsertMediaUSB", postCtx);
    init();
}

async function unmountHandler() {
    const isoObj = document.getElementById(selectedId);
    const isoId = isoObj.parentElement.innerText;
    
    await fetchAPI.post(`/redfish/v1/Managers/1/VirtualMedia/${virtualMediaList[isoId-1].Id}/Actions/VirtualMedia.EjectMedia`, {});
    init();
}

function paintVirtualMedia() {
    while (isoImageTableBody.firstChild)
        isoImageTableBody.removeChild(isoImageTableBody.firstChild);

    for (let i = 0; i < virtualMediaList.length; i++){
        const {ImageName, Size, CreateTime} = virtualMediaList[i];
        const div = document.createElement("div");
        div.className = "iso-image-table-row";
        
        const selectBox = document.createElement("input");
        const number = document.createElement("div");
        const numberText = document.createTextNode(`${i+1}`);
        const size = document.createElement("div");
        const createTime = document.createElement("div");
        const name = document.createElement("div");
    
        selectBox.type = "checkbox";
        selectBox.className = "checkbox";
        selectBox.id = `iso${i + 1}`;
        selectBox.setAttribute("onchange", "onlyOneCheckbox(this.id);");
        
        number.className = "number";
        size.className = "size";
        createTime.className = "create-time";
        name.className = "name";
    
        // number.innerText = i + 1;
        size.innerText = Size ?? "";
        createTime.innerText = CreateTime ?? "";
        name.innerText = ImageName ?? "";

        number.appendChild(selectBox);
        number.appendChild(numberText);
        div.appendChild(number);
        div.appendChild(size);
        div.appendChild(createTime);
        div.appendChild(name);

        isoImageTableBody.appendChild(div);
    }
}

async function getVirtualMediaList() {
    const promise = virtualMediaCollection.map(async (virtualMedia) => {
        const virtualMediaInfo = await getResource(virtualMedia["@odata.id"]);
        virtualMediaList.push(virtualMediaInfo);        
    });
    await Promise.all(promise);
    paintVirtualMedia();
}

async function init() {
    virtualMediaList = [];
    virtualMediaList.length = 0;

    const virtualMedia = await getResource(CMMResourceURI.VIRTUALMEDIA);
    console.log(virtualMedia);
    virtualMediaCollection = virtualMedia.Members;
    getVirtualMediaList();    
}

init();
window.refreshHandler = refreshHandler;
window.mountHandler = mountHandler;
window.unmountHandler = unmountHandler;
window.onlyOneCheckbox = onlyOneCheckbox;