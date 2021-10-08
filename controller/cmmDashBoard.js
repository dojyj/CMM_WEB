import { HA_API } from "./api.js";

const activeIp = document.getElementById('active-ip');
const activePort = document.getElementById('active-port');
const standByIp = document.getElementById('stand-by-ip');
const standByPort = document.getElementById('stand-by-port');

async function paintHAInfo() {
    const req = await HA_API.get("/CMMHA");
    const HA_info = await req.json();

    console.log(HA_info);
    const { ActiveIP, ActivePort, StandbyIP, StandbyPort} = HA_info;

    activeIp.innerText = ActiveIP ?? "unknown";
    activePort.innerText = ActivePort ?? "unknown";
    standByIp.innerText = StandbyIP ?? "unknown";
    standByPort.innerText = StandbyPort ?? "unknown";
}

async function init() {
    paintHAInfo();
}

init();