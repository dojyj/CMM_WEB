import { CMMResourceURI, getResource } from "./Resource.js";
import { paintSelect } from "./util.js";

let curBladeServerNum;
let bladeServerCollection;
let bladeServerInfo;

const bladeServerSelect = document.getElementById("blade-server-select");

async function getChassisArray() {
    const bladeCollection = await getResource(CMMResourceURI.CHASSIS);

    bladeServerCollection = bladeCollection.Members;    
    bladeServerCollection.shift(); // cmm chassis 삭제
}

async function getBladeArray() {
    const blade = await getResource(`${bladeServerCollection[curBladeServerNum]["@odata.id"]}`);
    bladeServerInfo = blade;
}

async function init() {
    curBladeServerNum = 0;
    await getChassisArray();
    paintSelect(bladeServerSelect, bladeServerCollection, "BMC", curBladeServerNum);
    await getBladeArray();
    console.log(bladeServerInfo);
}

init();