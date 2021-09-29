import { CMMResourceURI, getResource, patchResource } from "./Resource.js";

const snmpEnabled = document.getElementById("snmp-enable");
const snmpPort = document.getElementById("snmp-port");
    const snmpV1 = document.getElementById("snmpv1");
    const snmpV2 = document.getElementById("snmpv2");
    const snmpV3 = document.getElementById("snmpv3");
const communityAccessMode = document.getElementById("community-access-mode");
    const RWMode = document.getElementById("RW");
    const ROMode = document.getElementById("RO");
const communityStrings = document.getElementById("community-strings");
    const CSTable = document.getElementById("CS-table");
    const hideCS = document.getElementById("hide-CS");
const authProtocolSelect = document.getElementById("auth-protocol-select");
const snmpUserName = document.getElementById("snmp-user-name");
const snmpEncryptionProtocol = document.getElementById("snmp-encryption-protocol");

let snmpPatchCtx = {};
let prevVersion = "";
let selectedVersion = ""; // snmp version
let CSArray = [];

window.onload = () => {
    snmpEnabled.addEventListener("change",function (e) {
        snmpPatchCtx.ProtocolEnabled = this.checked;
    }, false);
    
    snmpPort.addEventListener("input",function (e) {
        snmpPatchCtx.Port = this.innerText;
    }, false);
    
    snmpV1.addEventListener("change", function (e) {
        snmpPatchCtx.EnableSNMPv1 = true;
        snmpPatchCtx.EnableSNMPv2c = false;
        snmpPatchCtx.EnableSNMPv3 = false;
        if (prevVersion == "snmpv3")
            getSNMPInfo();
    }, false);
    snmpV2.addEventListener("change", function (e) {
        snmpPatchCtx.EnableSNMPv1 = false;
        snmpPatchCtx.EnableSNMPv2c = true;
        snmpPatchCtx.EnableSNMPv3 = false;
        if (prevVersion == "snmpv3")
            getSNMPInfo();
    }, false);
    snmpV3.addEventListener("change", function (e) {
        snmpPatchCtx.EnableSNMPv1 = false;
        snmpPatchCtx.EnableSNMPv2c = false;
        snmpPatchCtx.EnableSNMPv3 = true;
        if (prevVersion != "snmpv3")
            getSNMPInfo();
    }, false);

    RWMode.addEventListener("change", function (e) {
        snmpPatchCtx.CommunityAccessMode = "Full";
        ROMode.checked = false;
    }, false);
    ROMode.addEventListener("change", function (e) {
        snmpPatchCtx.CommunityAccessMode = "Limited";
        RWMode.checked = false;
    }, false);

    hideCS.addEventListener("change", function (e) {
        snmpPatchCtx.HideCommunityStrings = this.checked;
        const strings = document.querySelectorAll('.CS-table-row > .table-value');
        if (hideCS.checked){
            strings.forEach(str => {
                str.type = "password";
            });
        }else {
            strings.forEach(str => {
                str.type = "text";
            });
        }
    }, false);
    authProtocolSelect.addEventListener("change", function (e) {
        snmpPatchCtx.AuthenticationProtocol = this.value;
    }, false);

    snmpUserName.addEventListener("input", function (e) {
        snmpPatchCtx.UserName = this.innerText;
    }, false);

    snmpEncryptionProtocol.addEventListener("change", function (e) {
        snmpPatchCtx.EncryptionProtocol = this.value;
    }, false);
}

function addCS() {
    CSArray.push("");
    paintCSList();
}

function onlyOneVersion(id) {
    for (var i = 1; i <= 3; i++){
        document.getElementById(`snmpv${i}`).checked = false;
    }
    document.getElementById(id).checked = true;
    prevVersion = selectedVersion;
    selectedVersion = id;
}

function snmpClearHandler() {
    init();
}

async function snmpPatchHandler() {
    if (selectedVersion != "snmpv3")
        snmpPatchCtx.CommuityStrings = CSArray;

    console.log(snmpPatchCtx);
    await patchResource(CMMResourceURI.NETWORKPROTOCOL, snmpPatchCtx);
    getSNMPInfo();
}

function removeCS(id) {
    CSArray.splice(id, 1);
    paintCSList();
}

function paintCSList() {
    while (CSTable.firstChild)
        CSTable.removeChild(CSTable.firstChild);
    
    for (var i = 0; i < CSArray.length; i++){
        const CSTableRow = document.createElement("div");
        const CSRow = document.createElement("input");
        const removeBtn = document.createElement("button");

        CSTableRow.className = "CS-table-row";

        CSRow.classList.add("table-value");
        CSRow.value = CSArray[i];
        CSRow.addEventListener("input", function (e) {
            const idx = e.currentTarget.parentNode.querySelector("button").id;
            CSArray[idx] = this.value;
        })

        removeBtn.innerText = "X";
        removeBtn.classList.add("save");
        removeBtn.id = `${i}`;
        removeBtn.setAttribute("onclick", "removeCS(this.id);");

        CSTableRow.classList.add("list-style");
        CSTableRow.appendChild(CSRow);
        CSTableRow.appendChild(removeBtn);
        
        CSTable.appendChild(CSTableRow);
    }
    const strings = document.querySelectorAll('.CS-table-row > .table-value');
    if (hideCS.checked){
        strings.forEach(str => {
            if (!str.type != "password")
                str.type = "password";
        });
    }
}

function getSelectedVersion(v1,v2,v3) {
    if (selectedVersion == ""){
        if (v1)
            selectedVersion = "snmpv1";
        else if (v2)
            selectedVersion = "snmpv2";
        else if (v3)
            selectedVersion = "snmpv3"; // default
        else
            selectedVersion = "snmpv3"; // default
        
        document.getElementById(selectedVersion).checked = true;
    }    
}

function paintSNMPInfo(...snmpInfo) {
    const { ProtocolEnabled, Port, AuthenticationProtocol, CommunityAccessMode, UserName,
            EnableSNMPv1, EnableSNMPv2c, EnableSNMPv3, EncryptionProtocol, HideCommunityStrings} = snmpInfo[0];

    snmpEnabled.checked = ProtocolEnabled;
    snmpPort.innerText = Port ?? "unknown";

    getSelectedVersion(EnableSNMPv1, EnableSNMPv2c, EnableSNMPv3);

    communityAccessMode.classList.add("disabled-div");
    communityStrings.classList.add("disabled-div");
    snmpUserName.classList.add("disabled-div");
    authProtocolSelect.disabled = true;
    snmpEncryptionProtocol.disabled = true;
    
    if (selectedVersion == "snmpv3"){
        authProtocolSelect.disabled = false;
        snmpEncryptionProtocol.disabled = false;

        for (var i = 0; i < authProtocolSelect.options.length; i++){
            if (authProtocolSelect.options[i].innerText == AuthenticationProtocol)
                authProtocolSelect.selectedIndex = i;
        }

        if (authProtocolSelect.value == "Account"){
            snmpUserName.classList.remove("disabled-div");
            snmpUserName.innerText = UserName ?? "unknown";
        }
        for (var i = 0; i < snmpEncryptionProtocol.options.length; i++){
            if (snmpEncryptionProtocol.options[i] == EncryptionProtocol)
                snmpEncryptionProtocol.selectedIndex = i;
        }
    } else {
        communityAccessMode.classList.remove("disabled-div");
        communityStrings.classList.remove("disabled-div");
    
        if (CommunityAccessMode == "Full")
            RWMode.checked = true;
        else
            ROMode.checked = true; // default

        hideCS.checked = HideCommunityStrings;
        paintCSList();
    }
}

async function getSNMPInfo() {
    const networkInfo = await getResource(CMMResourceURI.NETWORKPROTOCOL);
    if (CSArray.length == 0)
        CSArray = networkInfo.SNMP.CommuityStrings ?? [];
    paintSNMPInfo(networkInfo.SNMP);
}

function init() {
    CSArray.length = 0;
    CSArray = [];
    prevVersion = "";
    selectedVersion = "";
    snmpPatchCtx.length = 0;
    snmpPatchCtx = {};

    getSNMPInfo();
}

init();
window.snmpClearHandler = snmpClearHandler;
window.snmpPatchHandler = snmpPatchHandler;
window.onlyOneVersion = onlyOneVersion;
window.addCS = addCS;
window.removeCS = removeCS;