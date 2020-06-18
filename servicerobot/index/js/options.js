/**
 * 条形图的option/光功率统计图
 */
function option_lineChar(){
    
    var option = {
        color: ["#1f5cea", "#40ca7f"],
        toolbox: {
            show : true,
            feature : {
                mark : {show: true},
                dataView : {show: true, readOnly: false},
                // magicType: {show: true, type: ['line', 'bar']},
                restore : {show: true},
                saveAsImage : {show: true}
            }
        },
        dataZoom: [
            {
                show: true,//显示x轴滚动条
                start: 0,
                end: 100,
                top: '94%'
            },
            {
                type: 'inside',
                start: 94,
                end: 100
            },
            {
                show: false, //显示y轴滚动条
                yAxisIndex: 0,
                filterMode: 'empty',
                width: 30,
                height: '80%',
                showDataShadow: false,
                left: '93%'
            }
        ],
        tooltip: {
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
        },
        legend: {
            itemGap: 5,
            data: ['Rx', 'Tx']
            // data: ['直接访问', '邮件营销']
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '20%',
            containLabel: true
        },
        xAxis: [
            {
                type: 'category',
                axisLabel: {
                    show: true,
                    rotate: -45,
                    interval: 0,
                    fontSize: 12,
                    formatter: function (value) {
                        if(!value){
                            return
                        }
                        var length = value.length;
                        if(length>13){
                            return value.substring(0,13) + '\n' + value.substring(13)
                        }
                        return value
                    }
                },
                data: []
                // data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
            }
        ],
        yAxis: [
            {
                type: 'value'
            }
        ],
        series:[{
            name: 'Rx',
            type: 'bar',
            data: []
        },{
            name: "Tx",
            type: 'bar',
            data: []
        }]
        // series: [
        //     {
        //         name: '直接访问',
        //         type: 'bar',
        //         data: [320, 332, 301, 334, 390, 330, 320]
        //     },
        //     {
        //         name: '邮件营销',
        //         type: 'bar',
        //         // stack: '广告',
        //         data: [120, 132, 101, 134, 90, 230, 210]
        //     }]
    
    };
    return option;
}

function option_history(){
    var option = {
        color: ["#1f5cea", "#40ca7f"],
        // title: {
        //     text: '未来一周气温变化',
        //     subtext: '纯属虚构'
        // },
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data:['Rx','Tx',]
        },
        toolbox: {
            show: true,
            feature: {
                dataZoom: {
                    yAxisIndex: 'none'
                },
                dataView: {readOnly: false},
                // magicType: {type: ['line', 'bar']},
                restore: {},
                saveAsImage: {}
            }
        },
        grid: {
            left: '3%',
            right: '14%',
            bottom: '20%',
            containLabel: true
        },
        xAxis:  {
            type: 'category',
            boundaryGap: false,
            axisLabel: {
                show: true,
                rotate: -45,
                interval: 4,
                fontSize: 12,
            },
            // data: ['周一','周二','周三','周四','周五','周六','周日']
            data: []
        },
        yAxis: {
            type: 'value',
            axisLabel: {
                // formatter: '{value} °C'
                formatter: '{value}'
            }
        },
        series: [
            {
                name:'Rx',
                type:'line',
                data: []
                // data:[11, 11, 15, 13, 12, 13, 10],
                // markPoint: {
                //     data: [
                //         {type: 'max', name: '最大值'},
                //         {type: 'min', name: '最小值'}
                //     ]
                // },
                // markLine: {
                //     data: [
                //         {type: 'average', name: '平均值'}
                //     ]
                // }
            },
            {
                name:'Tx',
                type:'line',
                data: []
                // data:[1, -2, 2, 5, 3, 2, 0],
                // markPoint: {
                //     data: [
                //         {name: '周最低', value: -2, xAxis: 1, yAxis: -1.5}
                //     ]
                // },
                // markLine: {
                //     data: [
                //         {type: 'average', name: '平均值'},
                //         [{
                //             symbol: 'none',
                //             x: '90%',
                //             yAxis: 'max'
                //         }, {
                //             symbol: 'circle',
                //             label: {
                //                 normal: {
                //                     position: 'start',
                //                     formatter: '最大值'
                //                 }
                //             },
                //             type: 'max',
                //             name: '最高点'
                //         }]
                //     ]
                // }
            }
        ]
    };
    return option;
}