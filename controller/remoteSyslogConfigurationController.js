import { CMMResourceURI, getResource, patchResource } from "./Resource.js";

const syslogServiceEnabled = document.getElementById('syslog-service-enabled');
const syslogPortNumber = document.getElementById('syslog-port-number');
const syslogServer = document.getElementById('syslog-server');

let syslogPatchCtx = {};

window.onload = () => {
    syslogServiceEnabled.addEventListener("change", function (e) {
        syslogPatchCtx.EnableSyslog = this.checked;
    },false)
    syslogPortNumber.addEventListener("input", function (e) {
        syslogPatchCtx.SyslogPortNumber = this.innerText;
    },false)
    syslogServer.addEventListener("input", function (e) {
        syslogPatchCtx.SyslogServer = this.innerText;
    },false)
}

function paintSyslogInfo(...syslogInfo) {
    const {EnableSyslog, SyslogPortNumber, SyslogServer} = syslogInfo[0];

    console.log(syslogInfo);
    syslogServiceEnabled.checked = EnableSyslog ?? false;
    syslogPortNumber.innerText = SyslogPortNumber || "unknown";
    syslogServer.innerText = SyslogServer || "unknown";
}

function syslogClearHandler() {
    init();    
}

async function syslogPatchHandler() {
    console.log(syslogPatchCtx);
    await patchResource(CMMResourceURI.SYSLOGSERVICE, syslogPatchCtx);
    getSyslogInfo();
}

async function getSyslogInfo() {
    syslogPatchCtx.length = 0;
    syslogPatchCtx = {};

    const syslogInfo = await getResource(CMMResourceURI.SYSLOGSERVICE);
    paintSyslogInfo(syslogInfo);
}

function init() {
    getSyslogInfo();
}

init();
window.syslogClearHandler = syslogClearHandler;
window.syslogPatchHandler = syslogPatchHandler;