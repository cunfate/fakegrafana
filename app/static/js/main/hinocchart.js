function HinocChart(chartType, container) {
    if(arguments.length === 0 || typeof chartType !== "string") {
        chartType = "line";
    }
    this.chartContainer = $('<div class="col-md-12" style="height:400px;"></div>')[0];
    container.append(this.chartContainer);
    this.chart = echarts.init(this.chartContainer);
    this.chartoption = {
        title: {
            text: 'New Hinoc chart'
        },
        tooltip:{},
        backgroundColor: 'rgba(153, 255, 204, 0.3)',
        legend: {
            data:'show'
        },
        xAxis:{
            data:[]
        },
        yAxis:{},
        series: {
            name: 'value',
            type: chartType,
            areaStyle:{normal:{}},
            data:[]
        }
    };

    this.show = function() {
        this.chart.setOption(this.chartoption);
        return this;
    };
};