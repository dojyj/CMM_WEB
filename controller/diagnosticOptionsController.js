import { CMMResourceURI, getResource, patchResource } from "../controller/Resource.js";
import { modalFrame } from "./modal.js";

const logServiceSelect = document.getElementById("log-service-select");

const name = document.getElementById("name");
const type = document.getElementById("type");
const enable = document.getElementById("enable");
const overwritePolicy = document.getElementById("overwrite-policy");
const maxNumOfRecords = document.getElementById("max-num-of-records");
const datetimeOffsetSelect = document.getElementById("datetime-offset-select");
const filterDiv = document.getElementById("filter");

// filter modal values
const filterAuth = document.getElementById("Auth");
const filterConsole = document.getElementById("Console");
const filterCron = document.getElementById("Cron");
const filterDaemon = document.getElementById("Daemon");
const filterFTP = document.getElementById("FTP");
const filterKern = document.getElementById("Kern");
const filterLPR = document.getElementById("LPR");
const filterMail = document.getElementById("Mail");
const filterNews = document.getElementById("News");
const filterNTP = document.getElementById("NTP");
const filterSecurity = document.getElementById("Security");
const filterSolarisCron = document.getElementById("SolarisCron");
const filterSyslog = document.getElementById("Syslog");
const filterUser = document.getElementById("User");
const filterUUCP = document.getElementById("UUCP");
const filterLowestSeveritySelect = document.getElementById("lowest-severity-select");

let logServiceCollection = [];
let filterArray = [];

let curLogServiceNum;
let curTimeZone;

// filter modal data
let facilityArray = [];
let lowestSeverityValue = "";

let logServicePatchCtx = {};

window.onload = () => {
    logServiceSelect.addEventListener("change", function (e) {
        curLogServiceNum = e.currentTarget.selectedIndex;
        paintLogServiceConfig();
    },false);

    enable.addEventListener("change", function name(params) {
        logServicePatchCtx.ServiceEnabled = this.checked;
    }, false);
    datetimeOffsetSelect.addEventListener("change", function (e) {
        logServicePatchCtx.DateTimeLocalOffset = this.options[this.selectedIndex].innerText;
    }, false);

    filterAuth.addEventListener("click", function (e) {
        if (this.classList.toggle("clicked-card")){
            // toggled true
            facilityArray.push(this.id);
        }else {
            // toggled false
            while (1){
                const idx = facilityArray.indexOf(this.id);
                if (idx !== -1)
                    facilityArray.splice(idx, 1);
                else break;
            }
        }
    }, false);
    filterConsole.addEventListener("click", function (e) {
        if (this.classList.toggle("clicked-card")){
            // toggled true
            facilityArray.push(this.id);
        }else {
            // toggled false
            while (1){
                const idx = facilityArray.indexOf(this.id);
                if (idx !== -1)
                    facilityArray.splice(idx, 1);
                else break;
            }
        }
    }, false);
    filterCron.addEventListener("click", function (e) {
        if (this.classList.toggle("clicked-card")){
            // toggled true
            facilityArray.push(this.id);
        }else {
            // toggled false
            while (1){
                const idx = facilityArray.indexOf(this.id);
                if (idx !== -1)
                    facilityArray.splice(idx, 1);
                else break;
            }
        }
    }, false);
    filterDaemon.addEventListener("click", function (e) {
        if (this.classList.toggle("clicked-card")){
            // toggled true
            facilityArray.push(this.id);
        }else {
            // toggled false
            while (1){
                const idx = facilityArray.indexOf(this.id);
                if (idx !== -1)
                    facilityArray.splice(idx, 1);
                else break;
            }
        }
    }, false);
    filterFTP.addEventListener("click", function (e) {
        if (this.classList.toggle("clicked-card")){
            // toggled true
            facilityArray.push(this.id);
        }else {
            // toggled false
            while (1){
                const idx = facilityArray.indexOf(this.id);
                if (idx !== -1)
                    facilityArray.splice(idx, 1);
                else break;
            }
        }
    }, false);
    filterKern.addEventListener("click", function (e) {
        if (this.classList.toggle("clicked-card")){
            // toggled true
            facilityArray.push(this.id);
        }else {
            // toggled false
            while (1){
                const idx = facilityArray.indexOf(this.id);
                if (idx !== -1)
                    facilityArray.splice(idx, 1);
                else break;
            }
        }
    }, false);
    filterLPR.addEventListener("click", function (e) {
        if (this.classList.toggle("clicked-card")){
            // toggled true
            facilityArray.push(this.id);
        }else {
            // toggled false
            while (1){
                const idx = facilityArray.indexOf(this.id);
                if (idx !== -1)
                    facilityArray.splice(idx, 1);
                else break;
            }
        }
    }, false);
    filterMail.addEventListener("click", function (e) {
        if (this.classList.toggle("clicked-card")){
            // toggled true
            facilityArray.push(this.id);
        }else {
            // toggled false
            while (1){
                const idx = facilityArray.indexOf(this.id);
                if (idx !== -1)
                    facilityArray.splice(idx, 1);
                else break;
            }
        }
    }, false);
    filterNews.addEventListener("click", function (e) {
        if (this.classList.toggle("clicked-card")){
            // toggled true
            facilityArray.push(this.id);
        }else {
            // toggled false
            while (1){
                const idx = facilityArray.indexOf(this.id);
                if (idx !== -1)
                    facilityArray.splice(idx, 1);
                else break;
            }
        }
    }, false);
    filterNTP.addEventListener("click", function (e) {
        if (this.classList.toggle("clicked-card")){
            // toggled true
            facilityArray.push(this.id);
        }else {
            // toggled false
            while (1){
                const idx = facilityArray.indexOf(this.id);
                if (idx !== -1)
                    facilityArray.splice(idx, 1);
                else break;
            }
        }
    }, false);
    filterSecurity.addEventListener("click", function (e) {
        if (this.classList.toggle("clicked-card")){
            // toggled true
            facilityArray.push(this.id);
        }else {
            // toggled false
            while (1){
                const idx = facilityArray.indexOf(this.id);
                if (idx !== -1)
                    facilityArray.splice(idx, 1);
                else break;
            }
        }
    }, false);
    filterSolarisCron.addEventListener("click", function (e) {
        if (this.classList.toggle("clicked-card")){
            // toggled true
            facilityArray.push(this.id);
        }else {
            // toggled false
            while (1){
                const idx = facilityArray.indexOf(this.id);
                if (idx !== -1)
                    facilityArray.splice(idx, 1);
                else break;
            }
        }
    }, false);
    filterSyslog.addEventListener("click", function (e) {
        if (this.classList.toggle("clicked-card")){
            // toggled true
            facilityArray.push(this.id);
        }else {
            // toggled false
            while (1){
                const idx = facilityArray.indexOf(this.id);
                if (idx !== -1)
                    facilityArray.splice(idx, 1);
                else break;
            }
        }
    }, false);
    filterUser.addEventListener("click", function (e) {
        if (this.classList.toggle("clicked-card")){
            // toggled true
            facilityArray.push(this.id);
        }else {
            // toggled false
            while (1){
                const idx = facilityArray.indexOf(this.id);
                if (idx !== -1)
                    facilityArray.splice(idx, 1);
                else break;
            }
        }
    }, false);
    filterUUCP.addEventListener("click", function (e) {
        if (this.classList.toggle("clicked-card")){
            // toggled true
            facilityArray.push(this.id);
        }else {
            // toggled false
            while (1){
                const idx = facilityArray.indexOf(this.id);
                if (idx !== -1)
                    facilityArray.splice(idx, 1);
                else break;
            }
        }
    }, false);
    filterLowestSeveritySelect.addEventListener("change", function (e) {
        lowestSeverityValue = this.options[this.selectedIndex].innerText;
    }, false);
}

async function saveBtn() {
    logServicePatchCtx.SyslogFilters = filterArray;
    console.log(logServicePatchCtx);
    await patchResource(`${logServiceCollection[curLogServiceNum]["@odata.id"]}`, logServicePatchCtx);
    init();
}

function clearBtn() {
    init();
}

function addFilterModalInit() {
    facilityArray.length = 0;
    facilityArray = [];
    lowestSeverityValue = "";
    
    document.querySelectorAll(".clicked-card").forEach(el => el.classList.remove("clicked-card"));
}

function closeModal(e) {
    const modal = e.currentTarget.modal;
    const bg = document.getElementById('modal-bg');

    bg.remove();
    modal.style.display = 'none';
    addFilterModalInit();
    console.log("init");
}

function addFilter(e) {
    const filterObj = {};
    filterObj.LogFacilities = new Array();
    filterObj.LogFacilities.push(...facilityArray);
    filterObj["LowestSeverity"] = lowestSeverityValue;

    filterArray.push(filterObj);
    closeModal(e);
    paintFilter();
}

function addFilterModal() {
    const modal = modalFrame("filter-add-modal");

    // close 버튼 처리, 시꺼먼 레이어와 모달 div 지우기
    const modalCloseBtn = modal.querySelector('.modal-close-btn');
    modalCloseBtn.addEventListener('click', closeModal, false);
    modalCloseBtn.modal = modal;
    
    // add 버튼 처리, 시꺼먼 레이어와 모달 div 지우기
    const modalPostBtn = modal.querySelector('.modal-add-btn');
    modalPostBtn.addEventListener('click', addFilter, false);
    modalPostBtn.modal = modal;    

    lowestSeverityValue = filterLowestSeveritySelect[filterLowestSeveritySelect.selectedIndex].innerText;
}

function paintSelect() {
    logServiceSelect.options.length = 0;
    for (let i = 0; i < logServiceCollection.length; i++){
        let option = document.createElement('option');
        option.innerText = `Log #${i+1}`;
        logServiceSelect.append(option);
    }
    logServiceSelect.options.selectedIndex = curLogServiceNum;    
}

function paintFilter() {
    while (filterDiv.firstChild)
        filterDiv.removeChild(filterDiv.firstChild);
    
    for(let i = 0; i < filterArray.length; i++){
        const addableRow = document.createElement("div");
        const facilityDiv = document.createElement("div");
        const lowestSeverity = document.createElement("div");

        addableRow.className = "addable-row";
        facilityDiv.className = "facility-div";
        lowestSeverity.className = "lowest-severity-div";

        const {LogFacilities, LowestSeverity} = filterArray[i];

        let facilitiesStr = "";
        for (let idx in LogFacilities){
            facilitiesStr += LogFacilities[idx];
            if (idx != LogFacilities.length -1)
                facilitiesStr += ", ";
        }
        facilityDiv.innerText = facilitiesStr;
        lowestSeverity.innerText = LowestSeverity;

        addableRow.appendChild(facilityDiv);
        addableRow.appendChild(lowestSeverity);
        filterDiv.appendChild(addableRow);
    }
}

function paintTimeZone() {
    datetimeOffsetSelect.length = 0;
    
    for (let i = -12; i <= 12; i++){
        let t;
        if (i < 10 && i >= 0)
            t = `0${i}`;
        else if (i > -10 && i < 0)
            t = `-0${Math.abs(i)}`;
        else t = i;
            
        const curTimezone = (parseInt(t) > 0) ? `+${t}:00` : `${t}:00`;
        let option = document.createElement('option');
        option.innerText = curTimezone;
        datetimeOffsetSelect.append(option);
    }
    datetimeOffsetSelect.options.selectedIndex = curTimeZone;
}

async function paintConfig() {
    const logServiceConfig = await getResource(`${logServiceCollection[curLogServiceNum]["@odata.id"]}`);
    const {Name, LogEntryType, ServiceEnabled, OverWritePolicy, MaxNumberOfRecords, DateTimeLocalOffset, SyslogFilters} = logServiceConfig;
    
    console.log(logServiceConfig);

    name.innerText = Name ?? "unknown";
    type.innerText = LogEntryType ?? "unknown";
    enable.checked = ServiceEnabled ?? false;
    overwritePolicy.innerText = OverWritePolicy ?? "unknown";
    maxNumOfRecords.innerText = MaxNumberOfRecords ?? "unknown";
    
    const num = parseInt(DateTimeLocalOffset);
    curTimeZone = (num >= 0) ? num + 12 : abs(num); 

    filterArray = SyslogFilters;
    paintFilter();
}

async function paintLogServiceConfig(){
    paintSelect();
    paintConfig();
    paintTimeZone();
}

async function getLogServiceArray() {
    const logService = await getResource(CMMResourceURI.LOGSERVICE);
    logServiceCollection = logService.Members;    
}

async function init() {
    curLogServiceNum = 0;
    curTimeZone = 21;

    await getLogServiceArray();
    paintLogServiceConfig(); 
}

init();
window.addFilterModal = addFilterModal;
window.saveBtn = saveBtn;
window.clearBtn = clearBtn;