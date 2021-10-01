import { fetchAPI } from "./api.js";

export const CMMResourceURI = {
    SYSTEM : "/redfish/v1/Systems/1",
    CHASSIS : "/redfish/v1/Chassis",
    ETHERNETINTERFACES : "/redfish/v1/Managers/1/EthernetInterfaces",
    FIRMWAREINVENTORY : "/redfish/v1/UpdateService/FirmwareInventory",
    VIRTUALMEDIA : "/redfish/v1/Managers/1/VirtualMedia",
    ACCOUNTS : "/redfish/v1/AccountService/Accounts",
    SESSIONS : "/redfish/v1/SessionService/Sessions",
    SESSIONSERVICE : "/redfish/v1/SessionService",
    NETWORKPROTOCOL : "/redfish/v1/Managers/1/NetworkProtocol",
    SYSLOGSERVICE : "/redfish/v1/Managers/1/Syslog",
    LOGSERVICE : "/redfish/v1/Managers/1/LogServices",
}

export const ActionsURI = {
    CLEARLOG : "/Actions/LogService.ClearLog",
}

export const getResource = async (url) => {
    const res = await fetchAPI.get(url);
    return await res.json();
}

export const postResource = async (url, ctx, headers = {}) => {
    const res = await fetchAPI.post(url, ctx, headers);
    
    if (res.status == 400){
        const data = await res.json();
        alert(data.Error);
    }
    return res;
}

export const patchResource = async (url, ctx, headers = {}) => {
    const res = await fetchAPI.patch(url, ctx, headers);

    if (res.status == 400){
        const data = await res.json();
        alert(data.Error);
    }
    return res;
}

export const deleteResource = async (url, headers = {}) => {
    const res = await fetchAPI.delete(url, headers);

    if (res.status == 400){
        const data = await res.json();
        alert(data.Error);
    }
    return res;
}