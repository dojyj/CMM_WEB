import { fetchAPI } from "./api.js";

export const dbURI = {
    POWERCONTROL_H : "/Power/hourPowerControls",
    POWERCONTROL_M : "/Power/minPowerControls",
    VOLTAGE_H : "/Power/hourVoltages",
    VOLTAGE_M : "/Power/minVoltages",
    POWERSUPPLY_H : "/Power/hourPowerSupplies",
    POWERSUPPLY_M : "/Power/minPowerSupplies",
}

export const getDB = async (url) => {
    const res = await fetchAPI.get(url);
    return await res.json();
}