import { fetchAPI } from "./api.js";
import { CMMResourceURI, getResource } from "./getResource.js";

const systemAssetTag = document.getElementById("systemAssetTag");
const chassisAssetTag = document.getElementById("chassisAssetTag");
const driveAssetTag = document.getElementById("driveAssetTag");

async function getSystemInfo() {
    const systemInfo = await getResource(CMMResourceURI.SYSTEM);
    console.log(systemInfo);
    systemAssetTag.innerText = systemInfo.AssetTag;   
}

async function getChassisInfo() {
    const chassisInfo = await getResource(CMMResourceURI.CHASSIS);
    console.log(chassisInfo);
    chassisAssetTag.innerText = chassisInfo.AssetTag;
}

function getDriveInfo() {
    fetchAPI.get("/redfish/v1/Chassis/1/Storage/Drives/0")
    .then(res => {
        return res.json();
    })
    .then(data => {
        console.log(data);
        driveAssetTag.innerText = data.AssetTag;
    })
}

function init() {
    getSystemInfo();
    getChassisInfo();
    getDriveInfo();
}

init();