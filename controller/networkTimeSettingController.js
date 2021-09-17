import { CMMResourceURI, getResource } from "./Resource.js"

const datePicker = document.getElementById("datepicker");

const timeRow = document.getElementById("time-row");
const timeH = document.getElementById("time-h");
const timeM = document.getElementById("time-m");
const timeS = document.getElementById("time-s");

const timezone = document.getElementById("timezone");
const primaryNTPServer = document.getElementById("primary-ntp-server");
const secondaryNTPServer = document.getElementById("secondary-ntp-server")
const useNTPCheck = document.getElementById("use-ntp");

let ntpServerList;
let curServerNum;
let ntpEnabled;
let timeObj = {};
let curTimeZone;

let ntpPatchCtx = {};

window.onload = () => {
    datePicker.addEventListener("change", function (e) {
        ntpPatchCtx.Date = this.value;
    }, false);
    timeH.addEventListener("input", function (e) {
        timeObj.h = this.innerText;
    }, false);
    timeM.addEventListener("input", function (e) {
        timeObj.m = this.innerText;
    }, false);
    timeS.addEventListener("input", function (e) {
        timeObj.s = this.innerText;
    }, false);
    timezone.addEventListener("change", function (e) {
        const timezoneSelect = e.currentTarget.querySelector("select");
        ntpPatchCtx.TimeZone = timezoneSelect.value;
        curTimeZone = timezoneSelect.selectedIndex;
    }, false);
    primaryNTPServer.addEventListener("change", function (e) {
        const primaryNtpSelect = e.currentTarget.querySelector("select");
        ntpPatchCtx.PrimaryNTPServer = primaryNtpSelect.value;
        curServerNum = primaryNtpSelect.selectedIndex;
        ntpServerUpdate();
    }, false);
    secondaryNTPServer.addEventListener("change", function (e) {
        const secondayNtpSelect = e.currentTarget.querySelector("select");
        ntpPatchCtx.SecondaryNTPServer = secondayNtpSelect.value;
        ntpServerUpdate();
    })
    useNTPCheck.addEventListener("change", function (e) {
        ntpPatchCtx.NTPEnable = this.checked;
        ntpEnabled = this.checked;
        paintPlate();
    }, false);    
}

function saveNTPSetting() {
    ntpPatchCtx.ProtocolEnabled = ntpEnabled;
    if (!ntpEnabled){
        const timeStr = `${timeObj.h}:${timeObj.m}:${timeObj.s}`;
        ntpPatchCtx.Time = timeStr;
    }
    console.log(ntpPatchCtx);    
}

function clearNTPSetting() {
    init();    
}

function ntpServerUpdate() {
    const primaryNtpSelect = primaryNTPServer.querySelector("select");
    primaryNtpSelect.options.length = 0;

    for (let i = 0; i < ntpServerList.length; i++){
        let option = document.createElement('option');
        option.innerText = ntpServerList[i];
        primaryNtpSelect.append(option);
    }
    primaryNtpSelect.options.selectedIndex = curServerNum;

    const secondaryNtpSelect = secondaryNTPServer.querySelector("select");
    secondaryNtpSelect.options.length = 0;
    
    for (let i = 0; i < ntpServerList.length; i++){
        if (i == curServerNum)
            continue;
        else{
            let option = document.createElement('option');
            option.innerText = ntpServerList[i];
            secondaryNtpSelect.append(option);
        }
    }
}

function paintPlate(){
    useNTPCheck.value = ntpEnabled;
    curServerNum = 0;
    curTimeZone = 21;
    ntpPatchCtx.length = 0;
    ntpPatchCtx = {};
    datePicker.value = "";
    timeH.innerText = "";
    timeM.innerText = "";
    timeS.innerText = "";

    if (ntpEnabled){
        primaryNTPServer.classList.remove("disabled-div");
        secondaryNTPServer.classList.remove("disabled-div");
        datePicker.classList.add("disabled-div");
        timeRow.classList.add("disabled-div");
        timezone.classList.add("disabled-div");
        timezone.querySelector("select").length = 0;

        // ntp server select only
        ntpServerUpdate();
    } else {
        datePicker.classList.remove("disabled-div");
        timeRow.classList.remove("disabled-div");
        timezone.classList.remove("disabled-div");
        primaryNTPServer.classList.add("disabled-div");
        primaryNTPServer.querySelector("select").length = 0;
        secondaryNTPServer.classList.add("disabled-div");
        secondaryNTPServer.querySelector("select").length = 0;

        const timezoneSelect = timezone.querySelector("select");
        timezoneSelect.length = 0;
        for (let i = -12; i <= 12; i++){
            const curTimezone = (i >= 0) ? `+${i}` : i;
            let option = document.createElement('option');
            option.innerText = `GMT ${curTimezone}`;
            timezoneSelect.append(option);
        }
        timezoneSelect.options.selectedIndex = curTimeZone;
    }
}

async function getNTPServer() {
    const NTPInfo = await getResource(CMMResourceURI.NETWORKPROTOCOL).then(res => {return res.NTP});
    ntpServerList = NTPInfo.NTPServers;
    ntpEnabled = NTPInfo.ProtocolEnabled;
}

async function init() {
    await getNTPServer();
    paintPlate();    
}

init();
window.saveNTPSetting = saveNTPSetting;
window.clearNTPSetting = clearNTPSetting;