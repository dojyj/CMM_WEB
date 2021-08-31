import { fetchAPI } from "./api.js";

export const CMMResourceURI = {
    SYSTEM : "/redfish/v1/Systems/1",
    CHASSIS : "/redfish/v1/Chassis",
    ETHERNETINTERFACES : "/redfish/v1/Managers/1/EthernetInterfaces",
}

export const getResource = async (url) => {
    const res = await fetchAPI.get(url);
    return await res.json();
}


