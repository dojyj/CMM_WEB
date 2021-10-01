import { getResource } from "./Resource.js";

const hostname = document.getElementById("hostname");
const domainname = document.getElementById("domainname");
const ipv4prefer = document.getElementById("ipv4prefer");
const ipv4alter = document.getElementById("ipv4alter");
const ipv6prefer = document.getElementById("ipv6prefer");
const ipv6alter = document.getElementById("ipv6alter");
let patchCtx;

window.onload = () => {
    hostname.addEventListener("input", function (e) {
        patchCtx.HostName = this.innerText;
    }, false);

    domainname.addEventListener("input", function (e){
        patchCtx.FQDN = this.innerText;
    }, false);
    
    ipv4prefer.addEventListener("input", function (e){
        if (typeof(patchCtx.NameServers) == "undefined")
            patchCtx.NameServers = new Array(2);
        patchCtx.NameServers[0] = this.innerText;
    }, false);
    
    ipv4alter.addEventListener("input", function (e){
        if (typeof(patchCtx.NameServers) == "undefined")
            patchCtx.NameServers = new Array(2);
        patchCtx.NameServers[1] = this.innerText;
    }, false);
    
    ipv6prefer.addEventListener("input", function (e){
        console.log("ipv6..");
    }, false);
    
    ipv6alter.addEventListener("input", function (e){
        console.log("ipv6..");
    }, false);
}

function dnsSaveHandler() {
    patchCtx("/redfish/v1/Managers/1/EthernetInterfaces/NIC", patchCtx)
    .then(json => {
        console.log(json);
        init();
    })
}

function dnsClearHandler() {
    init();
}

function paintConfig(DNSObj) {
    console.log(DNSObj);

    hostname.innerText = DNSObj.HostName || "unknown";
    domainname.innerText = DNSObj.FQDN || "unknown";
    ipv4prefer.innerText = DNSObj.NameServers[0] || "unknown";
    ipv4alter.innerText = DNSObj.NameServers[1] || "unknown";
    ipv6prefer.innerText = "";
    ipv6alter.innerText = "localhost";
}

async function getDNSConfig() {
    const dnsInfo = await getResource("/redfish/v1/Managers/1/EthernetInterfaces/NIC");
    paintConfig(dnsInfo);
}

function init() {
    patchCtx = new Object();
    getDNSConfig();
}

init();
window.dnsSaveHandler = dnsSaveHandler;
window.dnsClearHandler = dnsClearHandler;