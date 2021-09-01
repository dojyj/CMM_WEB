import { CMMResourceURI, getResource } from "./getResource.js";

let fwCollection = [];

const cmmVersion = document.getElementById("cmmVersion");
const cmmManufacturer = document.getElementById("cmmManufacturer");
const cmmReleaseDate = document.getElementById("cmmReleaseDate");
const cmmLowestSupportedVersion = document.getElementById("cmmLowestSupportedVersion");

const webVersion = document.getElementById("webVersion");
const webManufacturer = document.getElementById("webManufacturer");
const webReleaseDate = document.getElementById("webReleaseDate");
const webLowestSupportedVersion = document.getElementById("webLowestSupportedVersion");

const haVersion = document.getElementById("haVersion");
const haManufacturer = document.getElementById("haManufacturer");
const haReleaseDate = document.getElementById("haReleaseDate");
const haLowestSupportedVersion = document.getElementById("haLowestSupportedVersion");

function paintCMM(cmmInfo) {
    cmmVersion.innerText = cmmInfo.Version;
    cmmManufacturer.innerText = cmmInfo.Manufacturer;
    cmmReleaseDate.innerText = cmmInfo.ReleaseDate;
    cmmLowestSupportedVersion.innerText = cmmInfo.LowestSupportedVersion;    
}

function paintWEB(webInfo) {
    webVersion.innerText = webInfo.Version;
    webManufacturer.innerText = webInfo.Manufacturer;
    webReleaseDate.innerText = webInfo.ReleaseDate;
    webLowestSupportedVersion.innerText = webInfo.LowestSupportedVersion;    
}

function paintHA(haInfo) {
    haVersion.innerText = haInfo.Version;
    haManufacturer.innerText = haInfo.Manufacturer;
    haReleaseDate.innerText = haInfo.ReleaseDate;
    haLowestSupportedVersion.innerText = haInfo.LowestSupportedVersion;    
}

async function getCMMInfo(cmm) {
    const cmmInfo = await getResource(cmm);
    console.log(cmmInfo);
    paintCMM(cmmInfo);
} 

async function getWEBInfo(web) {
    const webInfo = await getResource(web);
    console.log(webInfo); 
    paintWEB(webInfo);
} 

async function getHAInfo(ha) {
    const haInfo = await getResource(ha);
    console.log(haInfo); 
    paintHA(haInfo);
} 

async function getFWInfo() {
    const fwInventory = await getResource(CMMResourceURI.FIRMWAREINVENTORY);
    console.log(fwInventory);
    fwCollection = fwInventory.Members;

    await getCMMInfo(fwCollection[0]["@odata.id"]);
    await getWEBInfo(fwCollection[1]["@odata.id"]);
    getHAInfo(fwCollection[2]["@odata.id"]);
}

function init() {
    getFWInfo();
}

init();
