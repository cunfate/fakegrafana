class HinocChartReact extends React.Component {
    constructor(...args) {
        super(...args);
    }

    render() {
        let self = this;
        return (
            <div className="col-md-12" style={{height:420}}>
                <div className="col-md-12" ref={function(ele){self._echartBar = ele;}} style={{height:20}}>
                    <button type="button" className="close" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div className="col-md-12" ref={function(ele){self._echartContainer = ele;}} style={{height:400}}>
                </div>
            </div> 
        );
    }

    componentDidMount() {
        this._chart = echarts.init(this._echartContainer);
        this._chartoption = {
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
                type: 'line',
                areaStyle:{normal:{}},
                data:[]
            }
        };
        this.showChart();
    }

    showChart() {
        this._chart.setOption(this._chartoption);
    }
}

window.addEventListener("load",function(){
    alert("setup over");
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

    document.getElementById("add-row").onclick = function() {
        document.getElementById("row-adder-bar").style.display="block";
        document.getElementById("add-row").style.display="none";
    };

    document.getElementById("row-adder-bar").onclick = function() {
        document.getElementById("row-adder-bar").style.display="none";
        document.getElementById("add-row").style.display="block";
    };

    var hinocChartCounter = 1;
    var arr = [];
    document.getElementById("add-liner-btn").onclick = function() {
        let chartContainer = document.getElementById("charts-container");
        arr.push(<HinocChartReact key="{hinocChartCounter}" />);
        hinocChartCounter ++;
        ReactDOM.render(
            arr,
            chartContainer,
            function() {hinocChartCounter++;}
        );
    };

    document.getElementById("add-bar-btn").onclick = function() {

    };

    document.getElementById("add-pan-btn").onclick = function() {
    };
},false);