import { getRandomArbitarary } from "./util.js";

const PCctx = document.getElementById('power-control-chart');
const PVctx = document.getElementById('power-voltage-chart');
const PSctx = document.getElementById('power-supply-chart');

const timeFormatMinute = 'DD/MM/YYYY hh:mm';
const timeFormatHour = 'DD/MM/YYYY hh';

let PCChart;
let PVChart;
let PSChart;

let PCdataset = [];
let PVdataset = [];
let PSdataset = [];

let PCtimeFlag = "Minute";
let PVtimeFlag = "Minute";
let PStimeFlag = "Minute";

async function timeFlagChange(e) {
    const id = e.id;

    if (id == "pc"){
        PCtimeFlag = e.innerText;
        PCChart.destroy();
        PCChart = await makeChart(PCctx, PCdataset, PCtimeFlag);
    }else if (id == "pv"){
        PVtimeFlag = e.innerText;
        PVChart.destroy();
        PVChart = await makeChart(PVctx, PVdataset, PVtimeFlag);
    }else if (id == "ps"){
        PStimeFlag = e.innerText;
        PSChart.destroy();
        PSChart = await makeChart(PSctx, PSdataset, PStimeFlag);
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
    text : "Power Supply Summary"
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
                        text: 'Watt',
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
        const data4 = initSampleMData();

        // 그래프에 데이터 삽입
        dataset.push(fillDataset("CM #2", "#654", data1));
        dataset.push(fillDataset("CM #2", "#654", data2));
        dataset.push(fillDataset("CM #3", "#ABC", data3));
        dataset.push(fillDataset("CM #4", "#FDE", data4));

        const cf = makeConfig(dataset, graphTitle, timeFormatMinute);

        const chart = new Chart(ctx, cf);
        return chart;
    }else if (timeFlag == "Hour"){
        // sample data 생성
        const data1 = initSampleHData();
        const data2 = initSampleHData();
        const data3 = initSampleHData();
        const data4 = initSampleHData();

        // 그래프에 데이터 삽입
        dataset.push(fillDataset("CM #2", "#654", data1));
        dataset.push(fillDataset("CM #2", "#654", data2));
        dataset.push(fillDataset("CM #3", "#ABC", data3));
        dataset.push(fillDataset("CM #4", "#FDE", data4));

        const cf = makeConfig(dataset, graphTitle, timeFormatHour);

        const chart = new Chart(ctx, cf);
        return chart;
    }else{
        console.log("time flag error");
    }
}

async function init() {
    PCChart = await makeChart(PCctx, PCdataset, PCtimeFlag);
    PVChart = await makeChart(PVctx, PVdataset, PVtimeFlag);
    PSChart = await makeChart(PSctx, PSdataset, PStimeFlag);
}

init();
window.timeFlagChange = timeFlagChange;