import { fetchAPI } from "./api.js";
import { CMMResourceURI, getResource } from "./getResource.js";

const systemAssetTag = document.getElementById("systemAssetTag");
const chassisAssetTag = document.getElementById("chassisAssetTag");
const driveAssetTag = document.getElementById("driveAssetTag");

const chassisSelect = document.querySelector("#chassisNum > select");
let chassisCollection = [];
let curChassisNum;

const driveSelect = document.querySelector("#driveNum > select");
let driveCollection = [];
let curDriveNum;

window.onload = () => {
    chassisSelect.addEventListener("change", async function (e){
        curChassisNum = e.currentTarget.selectedIndex;
        await getChassisInfo(chassisCollection[curChassisNum]["@odata.id"]);

        const drive = await getResource(`/redfish/v1/chassis/${curChassisNum + 1}/Storage/Drives`);
        driveCollection = drive.Members;
        curDriveNum = 0;
        getDriveInfo(driveCollection[curDriveNum]["@odata.id"]);    
    });

    driveSelect.addEventListener("change", function (e){
        curDriveNum = e.currentTarget.selectedIndex;
        getDriveInfo(driveCollection[curDriveNum]["@odata.id"]);
    });
}

async function getSystemInfo() {
    const systemInfo = await getResource(CMMResourceURI.SYSTEM);
    console.log(systemInfo);
    systemAssetTag.innerText = systemInfo.AssetTag;   
}

async function getChassisInfo(chassis) {
    const chassisInfo = await getResource(chassis);
    console.log(chassisInfo);

    chassisSelect.options.length = 0;
    for (let i = 0; i < chassisCollection.length; i++){
        let option = document.createElement('option');
        option.innerText = `chassis #${i + 1}`;
        chassisSelect.append(option);
    }
    chassisSelect.options.selectedIndex = curChassisNum;

    chassisAssetTag.innerText = chassisInfo.AssetTag;
}

async function getDriveInfo(drive) {
    const driveInfo = await getResource(drive);
    console.log(driveInfo);
    
    driveSelect.options.length = 0;
    for (let i = 0; i < driveCollection.length; i++){
        let option = document.createElement('option');
        option.innerText = `drive #${i + 1}`;
        driveSelect.append(option);
    }
    driveSelect.options.selectedIndex = curDriveNum;

    driveAssetTag.innerText = driveInfo.AssetTag;
}

async function init() {
    getSystemInfo();

    const chassis = await getResource(CMMResourceURI.CHASSIS);
    chassisCollection = chassis.Members;
    curChassisNum = 0;
    getChassisInfo(chassisCollection[curChassisNum]["@odata.id"]);
    
    const drive = await getResource(`/redfish/v1/Chassis/${curChassisNum + 1}/Storage/Drives`);
    driveCollection = drive.Members;
    curDriveNum = 0;
    getDriveInfo(driveCollection[curDriveNum]["@odata.id"]);
}

init();