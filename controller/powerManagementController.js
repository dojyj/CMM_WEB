import { postResource } from "./Resource.js";

const powerRadioBtns = document.getElementsByName("power-radio-btn");

function powerManagementHandler() {
    const obj_len = powerRadioBtns.length;
    const resetType = {};

    for (let i = 0; i < obj_len; i++){
        if (powerRadioBtns[i].checked == true){
            resetType.ResetType = powerRadioBtns[i].value;
        }
    }

    postResource("/redfish/v1/Systems/1/Actions/ComputerSystem.Reset", resetType);
}

window.powerManagementHandler = powerManagementHandler;