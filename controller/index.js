import { CMMResourceURI, getResource } from "./Resource.js";
import { getRandomArbitarary, paintSelect } from "./util.js";

const Tempctx = document.getElementById('temperature-chart');

const timeFormatMinute = 'DD/MM/YYYY hh:mm';
const timeFormatHour = 'DD/MM/YYYY hh';

let TempChart;

let Tempdataset = [];

let TemptimeFlag = "Minute";

let curBladeServerNum;
let bladeServerCollection;
let bladeServerInfo;

const bladeServerSelect = document.getElementById("blade-server-select");

async function getChassisArray() {
    const bladeCollection = await getResource(CMMResourceURI.CHASSIS);
    console.log(bladeCollection);
    bladeServerCollection = bladeCollection.Members;    
    bladeServerCollection.shift(); // cmm chassis 삭제
}

async function getBladeArray() {
    const blade = await getResource(`${bladeServerCollection[curBladeServerNum]["@odata.id"]}`);
    bladeServerInfo = blade;
}

async function timeFlagChange(e) {
    const id = e.id;

    if (id == "temp"){
        TemptimeFlag = e.innerText;
        TempChart.destroy();
        TempChart = await makeChart(Tempctx, Tempdataset, TemptimeFlag);
    }
}

// ================ sample data init ==================
function initSampleMData() {
    let data = [];
    for (let i = 0; i < 30; i++){
        let timeStr;
        if (i < 10)
            timeStr = `01/01/2021 15:0${i}`;
        else
            timeStr = `01/01/2021 15:${i}`;
        
        let sensorValue = getRandomArbitarary(30, 50, 2);
        data.push({"x": timeStr, "y": sensorValue});
    }
    
    return data;
}

function initSampleHData() {
    let data = [];
    for (let i = 0; i < 24; i++){
        let timeStr;
        if (i < 10)
            timeStr = `01/01/2021 0${i}:00`;
        else
            timeStr = `01/01/2021 ${i}:00`;
        
        let sensorValue = getRandomArbitarary(30, 50, 2);
        data.push({"x": timeStr, "y": sensorValue});
    }
    return data;
}
// ================ sample data init ==================

// dataset 삽입
function fillDataset(module_id, color, data) {
    const set = {
        label: module_id,
        fill: false,
        borderColor: color,
        data: data,
    }
    return set;
}

// 그래프 config
const graphTitle = {
    display : true,
    text : "Temperature"
}

const makeConfig = (dataset, title, formatX) => {
    const cf = {
        type: 'line',
        data: {
            datasets: dataset
        },
        options: {
            title: title,
            scales: {
                xAxes: [{
                    type: 'time',
                    time: {
                        format: formatX,
                        tooltipFormat: 'll'
                    },
                    scaleLabel: {
                        display: true,
                        labelString: 'Date'
                    }
                }],
                yAxes: {
                    title: {
                        display: true,
                        align: 'center',
                        text: '°C',
                        padding: 10,
                        font: {
                            size: 16,
                            weight: 'bold',
                            family: "Noto Sans KR",
                        }
                    }
                },
            },    
        }
    }
    return cf;
}

// 차트 메이커
async function makeChart(ctx, dataset, timeFlag) {
    // dataset init
    dataset.length = 0;
    dataset = [];

    // todo : db 데이터 삽입
    // db에서 줄 데이터 포맷 확정되면 구현 예정.

    if (timeFlag == "Minute"){
        // sample data 생성
        const data1 = initSampleMData();
        const data2 = initSampleMData();
        const data3 = initSampleMData();

        // 그래프에 데이터 삽입
        dataset.push(fillDataset("CPU", "#654", data1));
        dataset.push(fillDataset("Chassis", "#654", data2));
        dataset.push(fillDataset("Fan", "#ABC", data3));

        const cf = makeConfig(dataset, graphTitle, timeFormatMinute);

        const chart = new Chart(ctx, cf);
        return chart;
    }else if (timeFlag == "Hour"){
        // sample data 생성
        const data1 = initSampleHData();
        const data2 = initSampleHData();
        const data3 = initSampleHData();

        // 그래프에 데이터 삽입
        dataset.push(fillDataset("CPU", "#654", data1));
        dataset.push(fillDataset("Chassis", "#654", data2));
        dataset.push(fillDataset("Fan", "#ABC", data3));

        const cf = makeConfig(dataset, graphTitle, timeFormatHour);

        const chart = new Chart(ctx, cf);
        return chart;
    }else{
        console.log("time flag error");
    }
}

async function init() {
    TempChart = await makeChart(Tempctx, Tempdataset, TemptimeFlag);

    curBladeServerNum = 0;
    await getChassisArray();
    console.log(bladeServerCollection);
    paintSelect(bladeServerSelect, bladeServerCollection, "BMC", curBladeServerNum);
    await getBladeArray();
}

init();
window.timeFlagChange = timeFlagChange;