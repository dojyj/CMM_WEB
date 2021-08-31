import { fetchAPI } from "./api.js";
import { CMMResourceURI, getResource } from "./getResource.js";

const interfaceSelect = document.querySelector(".select-box > select");
const ethernetEnable = document.getElementById("ethernetEnable");
const macAddress = document.getElementById("macAddress");

const ipv4UseDHCP = document.getElementById("ipv4UseDHCP");
const ipv4Address = document.getElementById("ipv4Address");
const ipv4SubnetMask = document.getElementById("ipv4SubnetMask");
const ipv4DefaultGateway = document.getElementById("ipv4DefaultGateway");

const ipv6Enable = document.getElementById("ipv6Enable");
const ipv6UseDHCP = document.getElementById("ipv6UseDHCP");
const ipv6Address = document.getElementById("ipv6Address");
const ipv6SubnetPrefixLength = document.getElementById("ipv6SubnetPrefixLength");
const ipv6DefaultGateway = document.getElementById("ipv6DefaultGateway");

const vlanEnable = document.getElementById("vlanEnable");
const vlanId = document.getElementById("vlanId");
const vlanPriority = document.getElementById("vlanPriority");

let patchCtx;
let networkInterface;
let curEthNum;

window.onload = () => {
    interfaceSelect.addEventListener("change", function (e){
        curEthNum = e.currentTarget.selectedIndex;
        getNetworkConfig(networkInterface[curEthNum]);
    }, false);
    ethernetEnable.addEventListener("change", function (e){
        if (e.currentTarget.checked){
            if (typeof(patchCtx.Status) == "undefined")
                patchCtx.Status = {};
            patchCtx.Status.State = "Enabled";
        } else {
            if (typeof(patchCtx.Status) == "undefined")
                patchCtx.Status = {};
            patchCtx.Status.State = "Disabled";    
        }
            
    }, false);
    macAddress.addEventListener("input", function (e){
        patchCtx.MACAddress = this.innerText;
    }, false);
    
    ipv4UseDHCP.addEventListener("change", function (e){
        if (e.currentTarget.checked){
            if (typeof(patchCtx.DHCPv4) == "undefined")
                patchCtx.DHCPv4 = {};
            patchCtx.DHCPv4.DHCPv4Enabled = true;
        } else {
            if (typeof(patchCtx.DHCPv4) == "undefined")
                patchCtx.DHCPv4 = {};
            patchCtx.DHCPv4.DHCPv4Enabled = false;    
        }
    }, false);
    ipv4Address.addEventListener("input", function (e){
        if (typeof(patchCtx.IPv4Addresses) == "undefined")
            patchCtx.IPv4Addresses = {};
        patchCtx.IPv4Addresses.Address = this.innerText;
    }, false);
    ipv4SubnetMask.addEventListener("input", function (e){
        if (typeof(patchCtx.IPv4Addresses) == "undefined")
            patchCtx.IPv4Addresses = {};
        patchCtx.IPv4Addresses.SubnetMask = this.innerText;    
    }, false);
    ipv4DefaultGateway.addEventListener("input", function (e){
        if (typeof(patchCtx.IPv4Addresses) == "undefined")
            patchCtx.IPv4Addresses = {};
        patchCtx.IPv4Addresses.Gateway = this.innerText;
    }, false);
    
    // ipv6Enable.addEventListener("input", function (e){
    //     console.log("ipv6 is always");
    // }, false);
    ipv6UseDHCP.addEventListener("change", function (e){
        if (e.currentTarget.checked){
            if (typeof(patchCtx.DHCPv6) == "undefined")
                patchCtx.DHCPv6 = {};
            patchCtx.DHCPv6.OperatingMode = "Stateful";
        } else {
            if (typeof(patchCtx.DHCPv6) == "undefined")
                patchCtx.DHCPv6 = {};
            patchCtx.DHCPv6.OperatingMode = "Disabled";    
        }
    }, false);
    ipv6Address.addEventListener("input", function (e){
        if (typeof(patchCtx.IPv6Addresses) == "undefined")
            patchCtx.IPv6Addresses = {};
        patchCtx.IPv6Addresses.Address = this.innerText;
    }, false);
    // ipv6SubnetPrefixLength.addEventListener("input", function (e){
    //     patchCtx.IPv6Addresses.PrefixLength = this.innerText;
    // }, false);
    // ipv6DefaultGateway.addEventListener("input", function (e){
    //     patchCtx.IPv6DefaultGateway = this.innerText;
    // }, false);
    
    vlanEnable.addEventListener("change", function (e){
        if (e.currentTarget.checked){
            if (typeof(patchCtx.VLAN) == "undefined")
                patchCtx.VLAN = {};
            patchCtx.VLAN.VLANEnable = true;
        } else {
            if (typeof(patchCtx.VLAN) == "undefined")
                patchCtx.VLAN = {};
            patchCtx.VLAN.VLANEnable = false;    
        }
    }, false);
    vlanId.addEventListener("input", function (e){
        if (typeof(patchCtx.VLAN) == "undefined")
            patchCtx.VLAN = {};
        patchCtx.VLAN.VLANId = this.innerText;
    }, false);
    // vlanPriority.addEventListener("input", function (e){
    //     if (typeof(patchCtx.VLAN) == "undefined")
    //         patchCtx.VLAN = {};
    //     patchCtx.VLAN.VLAN
    // }, false);    
}

function networkSaveHandler() {
    console.log(patchCtx);
    fetchAPI.patch(networkInterface[curEthNum]["@odata.id"], patchCtx)
    .then(json => {
        console.log(json);
        getNetworkConfig(networkInterface[curEthNum]["@odata.id"]);
    });
}

function networkClearHandler() {
    init();
}

function paintConfig(NetworkObj) {
    console.log(NetworkObj);

    interfaceSelect.options.length = 0;
    for (let i = 0; i < networkInterface.length; i++){
        let option = document.createElement('option');
        option.innerText = `eth${i}`;
        interfaceSelect.append(option);
    }
    interfaceSelect.options.selectedIndex = curEthNum;
    
    ethernetEnable.checked = (NetworkObj.Status.State == "Enabled") ? true : false;
    macAddress.innerText = NetworkObj.MACAddress;
    
    if (NetworkObj.IPv4Addresses.length != 0){
        ipv4UseDHCP.checked = NetworkObj.DHCPv4.DHCPEnabled;
        ipv4Address.innerText = NetworkObj.IPv4Addresses[0].Address;
        ipv4SubnetMask.innerText = NetworkObj.IPv4Addresses[0].SubnetMask;
        ipv4DefaultGateway.innerText = NetworkObj.IPv4Addresses[0].Gateway;
    }
    
    if (NetworkObj.IPv6Addresses.length != 0){
        ipv6Enable.checked = true;
        ipv6UseDHCP.checked = NetworkObj.DHCPv6.OperatingMode == ("Stateful" || "Stateless") ? true : false;
        ipv6Address.innerText = NetworkObj.IPv6Addresses[0].Address;
        ipv6SubnetPrefixLength.innerText = NetworkObj.IPv6Addresses[0].PrefixLength;
        ipv6DefaultGateway.innerText = NetworkObj.IPv6DefaultGateway;
    }

    vlanEnable.checked = NetworkObj.VLAN.VLANEnable;
    vlanId.innerText = NetworkObj.VLAN.VLANId;
    vlanPriority.innerText = "";
}

async function getNetworkConfig(ethernetInterface) {
    const ethernetInfo = await getResource(ethernetInterface);
    paintConfig(ethernetInfo);
}

async function getInterfaceInfo() {
    const ethernetsInfo = await getResource(CMMResourceURI.ETHERNETINTERFACES);
    networkInterface = ethernetsInfo.Members;
    curEthNum = 0;
    getNetworkConfig(networkInterface[curEthNum]["@odata.id"]);    
}

function init() {
    patchCtx = new Object();
    getInterfaceInfo();
}

init();
window.networkSaveHandler = networkSaveHandler;
window.networkClearHandler = networkClearHandler;