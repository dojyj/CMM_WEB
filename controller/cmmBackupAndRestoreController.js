import { formatBytes } from "./util.js";

const fileBrowseRow = document.getElementById('file-browse-row');
let originDroppableDiv = document.querySelector('.droppable');

let fileList;

function callback(files) {
    fileList = files;

    const fileDiv = document.createElement("div");
    const fileNameDiv = document.createElement("div");
    const fileModifiedDateDiv = document.createElement("div");
    const fileSizeDiv = document.createElement("div");

    fileDiv.className = "file-div";

    fileNameDiv.innerHTML = `<b>File Name</b> : ${fileList[0].name}`;
    fileModifiedDateDiv.innerHTML = `<b>Last Modified Date</b> : ${fileList[0].lastModifiedDate}`;
    fileSizeDiv.innerHTML = `<b>File Size</b> : ${formatBytes(fileList[0].size)}`;

    fileDiv.appendChild(fileNameDiv);
    fileDiv.appendChild(fileModifiedDateDiv);
    fileDiv.appendChild(fileSizeDiv);

    fileBrowseRow.replaceChild(fileDiv, originDroppableDiv);
}

function makeDroppable(element, callback) {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('multiple', true);
    input.style.display = 'none';

    input.addEventListener('change', triggerCallback);
    element.appendChild(input);

    element.addEventListener('dragover', function (e) {
        e.preventDefault();
        e.stopPropagation();
        element.classList.add('dragover');        
    }, false);

    element.addEventListener('dragleave', function (e) {
        e.preventDefault();
        e.stopPropagation();
        element.classList.remove('dragover');        
    }, false);

    element.addEventListener('drop', function (e) {
        e.preventDefault();
        e.stopPropagation();
        element.classList.remove('dragover');
        triggerCallback(e);
    }, false);

    element.addEventListener('click', function (e) {
        input.value = null;
        input.click();
    }, false);

    function triggerCallback(e) {
        let files;
        if (e.dataTransfer) {
            files = e.dataTransfer.files;
        } else if (e.target) {
            files = e.target.files;
        }
        callback.call(null, files);
    }
}

function backupBtn() {
    console.log("backup!");    
}

function restoreBtn() {
    console.log(fileList);
}

function fileUploadClearBtn() {
    const droppableDiv = document.createElement("div");
    const originFileDiv = document.querySelector(".file-div");

    droppableDiv.innerHTML = `<div class="droppable">Drop your file here...</div>`;
    fileBrowseRow.replaceChild(droppableDiv, originFileDiv);

    originDroppableDiv = droppableDiv;
    init();    
}

function init() {
    makeDroppable(originDroppableDiv, callback);
}

init();
window.backupBtn = backupBtn;
window.restoreBtn = restoreBtn;
window.fileUploadClearBtn = fileUploadClearBtn;