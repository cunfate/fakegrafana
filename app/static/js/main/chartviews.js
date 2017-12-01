$(document).ready(function(){
    var testchart = echarts.init(document.getElementsByClassName("testchart1")[0]);
    var option = {
        title: {
            text: 'hinoc test'
        },
        tooltip:{},
        legend: {
            data:'show'
        },
        xAxis:{
            data:['noise', 'npb']
        },
        yAxis:{},
        series: {
            name: 'value',
            type: 'line',
            areaStyle:{normal:{}},
            data:[100, 200]
        }
    };
    testchart.setOption(option);

    $("#add-row").click(function() {
        $("#row-adder-bar")[0].style.display="block";
        $("#add-row")[0].style.display="none";
    });

    $("#row-adder-bar").click(function() {
        $("#row-adder-bar")[0].style.display="none";
        $("#add-row")[0].style.display="block";
    });

    $("#add-liner-btn").click(function() {
        chartnew = new HinocChart("line", $("#charts-container")[0]);
        chartnew.show();
    });

    $("#add-bar-btn").click(function() {
        chartnew = new HinocChart("bar", $("#charts-container")[0]);
        chartnew.show();
    });

    $("#add-pan-btn").click(function() {
        chartnew = new HinocChart("pan", $("#charts-container")[0]);
        chartnew.show();
    });
});