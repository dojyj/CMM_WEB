import { ActionsURI, CMMResourceURI, getResource, postResource } from "./Resource.js";
import { paintSelect } from "./util.js";

// LogService Select
let logServiceCollection = [];
let curLogServiceNum;

// Logs
let logEntryCollection = [];
let logInfoArray = [];

const logServiceSelect = document.getElementById("log-service-select");
const logScrollBody = document.getElementById("log-scroll-body");

const description = document.getElementById("description");
const logServiceType = document.getElementById("log-service-type");
const timeOffset = document.getElementById("time-offset");

window.onload = () => {
    logServiceSelect.addEventListener("change", function (e) {
        curLogServiceNum = e.currentTarget.selectedIndex;
        paint();
    },false);
}

async function clearLogs() {
    if (confirm("정말 모든 로그를 삭제하시겠습니까?") == true){
        await postResource(`${logServiceCollection[curLogServiceNum]["@odata.id"]}${ActionsURI.CLEARLOG}`, {});
        paint();
    } else {
        return;
    }
}

async function getLogServiceArray() {
    const logService = await getResource(CMMResourceURI.LOGSERVICE);
    logServiceCollection = logService.Members;    
}

async function getLogArray() {
    const logs = await getResource(`${logServiceCollection[curLogServiceNum]["@odata.id"]}/Entries`);
    logEntryCollection = logs.Members;
}

function paintLogServiceInfo(info) {
    const { Description, LogEntryType, DateTimeLocalOffset } = info;

    description.innerText = Description || "unknown";
    logServiceType.innerText = LogEntryType || "unknown";
    timeOffset.innerText = DateTimeLocalOffset || "unknown";
}

function paintLogInfo() {
    console.log(logInfoArray);
    for (let i = 0; i < logInfoArray.length; i++){
        const { Created, MessageId, Name, EntryType, MessageArgs, Severity} = logInfoArray[i];

        const scrollRow = document.createElement("div");
        const timeStampDiv = document.createElement("div");
        const messageIdDiv = document.createElement("div");
        const logNameDiv = document.createElement("div");
        const logTypeDiv = document.createElement("div");
        const logValueDiv = document.createElement("div");
        const logSeverityDiv = document.createElement("div");

        scrollRow.className = "scroll-row";
        
        timeStampDiv.className = "time-stamp";
        messageIdDiv.className = "log-name";
        logNameDiv.className = "log-name";
        logTypeDiv.className = "log-type";
        logValueDiv.className = "log-value";
        logSeverityDiv.className = "log-severity";

        timeStampDiv.innerText = Created || "unknown";
        messageIdDiv.innerText = MessageId || "unknown";
        logNameDiv.innerText = Name || "unknown";
        logTypeDiv.innerText = EntryType || "unknown";
        logValueDiv.innerText = `${MessageArgs[0]} °C` || "unknown";
        logSeverityDiv.innerText = Severity || "unknown";

        scrollRow.appendChild(timeStampDiv);
        scrollRow.appendChild(messageIdDiv);
        scrollRow.appendChild(logNameDiv);
        scrollRow.appendChild(logTypeDiv);
        scrollRow.appendChild(logValueDiv);
        scrollRow.appendChild(logSeverityDiv);

        logScrollBody.appendChild(scrollRow);
    }
}

async function paint() {
    const logServiceInfo = await getResource(logServiceCollection[curLogServiceNum]["@odata.id"]);
    paintLogServiceInfo(logServiceInfo);
    
    for (let i = 0; i < logEntryCollection.length; i++){
        const logInfo = await getResource(logEntryCollection[i]["@odata.id"]);
        
        // // test
        // for (let test = 0; test < 100; test++)
            logInfoArray.push(logInfo);
    }
    paintLogInfo()
}

async function init() {
    curLogServiceNum = 0;

    await getLogServiceArray();
    paintSelect(logServiceSelect, logServiceCollection, "LogService", curLogServiceNum);
    await getLogArray();
    paint();
}

init();
window.clearLogs = clearLogs;