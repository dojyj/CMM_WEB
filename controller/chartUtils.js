// ==================================================== chart ============================================
// // html write tips
// <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/chart.js"></script>
// <link rel="stylesheet" type="text/css" href="/css/chart.css">

// <div class="chart-div">
//     <canvas id="thermal-chart" width="300px" height="100px"></canvas>                              
// </div>

// const ctx = document.getElementById('thermal-chart');

// const timeFormat = 'DD/MM/YYYY';

// const config = {
//     type: 'line',
//     data: {
//         datasets: [{ 
//             data: [{
//                 x: "01/01/2021", y: 30.6
//             },{
//                 x: "01/02/2021", y: 25.6
//             },{
//                 x: "01/03/2021", y: 24.6
//             },{
//                 x: "01/04/2021", y: 33.6
//             },],
//             label: "CMM",
//             borderColor: "#123",
//             fill: false
//         },{ 
//             data: [{
//                 x: "01/01/2021", y: 38.6
//             },{
//                 x: "01/02/2021", y: 40.6
//             },{
//                 x: "01/03/2021", y: 22.6
//             },{
//                 x: "01/04/2021", y: 56.6
//             },],
//             label: "CM #1",
//             borderColor: "#789",
//             fill: false
//         },{ 
//             data: [{
//                 x: "01/01/2021", y: 31.6
//             },{
//                 x: "01/02/2021", y: 35.6
//             },{
//                 x: "01/03/2021", y: 45.6
//             },{
//                 x: "01/04/2021", y: 22.6
//             },],
//             label: "CM #2",
//             borderColor: "#DEF",
//             fill: false
//         }]
//     },
//     options: {
//         title: {
//             display: true,
//             text: 'Thermal Chart 2021'
//         },
//         scales: {
//             xAxes: [{
//                 type: 'time',
//                 time: {
//                     format: timeFormat,
//                     tooltipFormat: 'll'
//                 },
//                 scaleLabel: {
//                     display: true,
//                     labelString: 'Date'
//                 }
//             }],
//             yAxes: [{
//                 scaleLabel: {
//                     display: true,
//                     labelString: 'thermal'
//                 }
//             }]
//         }
//     }
// };

// export const chart = new Chart(ctx, config);
// ==================================================== chart ============================================
