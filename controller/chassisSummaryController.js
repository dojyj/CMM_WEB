import { CMMResourceURI, getResource } from "./getResource.js";

let chassisCollection = [];
let curChassisNum;

const systemHostName = document.getElementById("systemHostName");
const systemType = document.getElementById("systemType");
const systemUUID = document.getElementById("systemUUID");
const systemPartNumber = document.getElementById("systemPartNumber");
const systemSerialNumber = document.getElementById("systemSerialNumber");
const systemManufacturer = document.getElementById("systemManufacturer");
const systemModel = document.getElementById("systemModel");

const chassisSelect = document.querySelector(".select-box > select");
const chassisType = document.getElementById("chassisType");
const chassisPartNumber = document.getElementById("chassisPartNumber");
const chassisSerial = document.getElementById("chassisSerial");
const chassisManufacturer = document.getElementById("chassisManufacturer");
const chassisModel = document.getElementById("chassisModel");

window.onload = () => {
    chassisSelect.addEventListener("change", function (e){
        curChassisNum = e.currentTarget.selectedIndex;
        getChassisInfo(chassisCollection[curChassisNum]["@odata.id"]);
    })
}

function paintChassis({...chassisObj}) {
    console.log(chassisObj);
    const {ChassisType, PartNumber, SerialNumber, Manufacturer, Model} = chassisObj;

    chassisSelect.options.length = 0;
    for (let i = 0; i < chassisCollection.length; i++){
        let option = document.createElement('option');
        option.innerText = `chassis #${i + 1}`;
        chassisSelect.append(option);
    }
    chassisSelect.options.selectedIndex = curChassisNum;

    chassisType.innerText = ChassisType ?? "";
    chassisPartNumber.innerText = PartNumber ?? "";
    chassisSerial.innerText = SerialNumber ?? "";
    chassisManufacturer.innerText = Manufacturer ?? "";
    chassisModel.innerText = Model ?? "";
}

function paintSystem({...systemObj}) {
    console.log(systemObj);
    const {HostName, SystemType, UUID, PartNumber, SerialNumber, Manufacturer, Model} = systemObj;

    systemHostName.innerText = HostName ?? "";
    systemType.innerText = SystemType ?? "";
    systemUUID.innerText = UUID ?? "";
    systemPartNumber.innerText = PartNumber ?? "";
    systemSerialNumber.innerText = SerialNumber ?? "";
    systemManufacturer.innerText = Manufacturer ?? "";
    systemModel.innerText = Model ?? "";
}

async function getChassisInfo(chassis) {
    const chassisInfo = await getResource(chassis);
    paintChassis(chassisInfo);
}

async function getSummary() {
    const chassis = await getResource(CMMResourceURI.CHASSIS);
    chassisCollection = chassis.Members;
    curChassisNum = 0;
    getChassisInfo(chassisCollection[curChassisNum]["@odata.id"]);
    
    const systemInfo = await getResource(CMMResourceURI.SYSTEM);
    paintSystem(systemInfo);
}

function init() {
    getSummary();    
}

init();
