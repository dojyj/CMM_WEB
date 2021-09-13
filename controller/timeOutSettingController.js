import { fetchAPI } from "./api.js";
import { CMMResourceURI, getResource } from "./getResource.js";

const sessionServiceName = document.getElementById('session-service-name');
const sessionServiceEnabled = document.getElementById('session-service-enabled');
const sessionDefualtTimeout = document.getElementById('session-default-timeout');

let sessionPatchCtx = {};

window.onload = () => {
    sessionServiceEnabled.addEventListener("change", function (e) {
        sessionPatchCtx.ServiceEnabled = this.checked;
    }, false);
    sessionDefualtTimeout.addEventListener("input", function (e) {
        sessionPatchCtx.SessionTimeout = parseInt(this.innerText);
    }, false);
}

function paintSessionInfo(...sessionInfo) {
    const {Name, ServiceEnabled, SessionTimeout} = sessionInfo[0];

    console.log(sessionInfo);
    sessionServiceName.innerText = Name;
    sessionServiceEnabled.checked = ServiceEnabled;
    sessionDefualtTimeout.innerText = SessionTimeout;
}

async function sessionPatchHandler(){
    console.log(sessionPatchCtx);
    await fetchAPI.patch(CMMResourceURI.SESSIONSERVICE, sessionPatchCtx)
    .then(res => {console.log(res);})
    getSessionInfo();
}

function sessionClearHandler() {
    getSessionInfo();    
}

async function getSessionInfo() {
    const sessionInfo = await getResource(CMMResourceURI.SESSIONSERVICE);
    paintSessionInfo(sessionInfo);

}

function init() {
    getSessionInfo();    
}

init();
window.sessionPatchHandler = sessionPatchHandler;
window.sessionClearHandler = sessionClearHandler;