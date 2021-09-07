import { fetchAPI } from "./api.js";

export const CMMResourceURI = {
    SYSTEM : "/redfish/v1/Systems/1",
    CHASSIS : "/redfish/v1/Chassis",
    ETHERNETINTERFACES : "/redfish/v1/Managers/1/EthernetInterfaces",
    FIRMWAREINVENTORY : "/redfish/v1/UpdateService/FirmwareInventory",
    VIRTUALMEDIA : "/redfish/v1/Managers/1/VirtualMedia",
    ACCOUNTS : "/redfish/v1/AccountService/Accounts",
    SESSIONSERVICE : "/redfish/v1/SessionService/Sessions",
}

export const getResource = async (url) => {
    const res = await fetchAPI.get(url);
    return await res.json();
}


